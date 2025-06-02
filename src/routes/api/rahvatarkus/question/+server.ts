import { json } from '@sveltejs/kit';

import { eq, and, not, sql, exists, lt, gt } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { questions, answers } from '$lib/server/db/schema';
import { questionBalanceStore } from '$lib/server/rahvatarkus/QuestionBalance';
import { ratelimit } from '$lib/server/redis';

export async function GET({ locals }) {
	const { session } = locals;
	if (!session?.data?.userId) return json({ error: 'Unauthorized' }, { status: 401 });

	const user = session.data.userId;

	const { success, reset } = await ratelimit.rahvaQuestionAPI.limit(user);

	if (!success) {
		const timeRemaining = Math.floor((reset - Date.now()) / 1000);
		const message = `Võta veits rahulikumalt. Proovi ${timeRemaining}s pärast uuesti.`;

		return json({ error: message }, { status: 429 });
	}

	// Use the answerCount field and avoid joins
	const eligibleQuestions = await db
		.select({
			id: questions.id,
			content: questions.content,
			answerCount: questions.answerCount
		})
		.from(questions)
		.where(
			and(
				not(eq(questions.creator, user)),
				lt(questions.answerCount, 5),
				not(
					exists(
						db
							.select()
							.from(answers)
							.where(and(eq(answers.questionId, questions.id), eq(answers.creator, user)))
					)
				)
			)
		)
		.orderBy(sql`RANDOM()`)
		.limit(1);

	if (!eligibleQuestions.length) {
		return json({ error: '' }, { status: 404 });
	}

	return json(eligibleQuestions[0]);
}

export async function POST({ locals, request }) {
	const { userId, content }: { userId: string; content: string } = await request.json();
	const { session } = locals;

	if (!session?.data?.userId) return json({ error: 'Unauthorized' }, { status: 401 });
	const user = session.data.userId;

	if (!user || !userId || user !== userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { success, reset } = await ratelimit.rahvaQuestion.limit(user);

	if (!success) {
		const timeRemaining = Math.floor((reset - Date.now()) / 1000);
		const message = `Võta veits rahulikumalt. Proovi ${timeRemaining}s pärast uuesti.`;

		return json({ error: message }, { status: 429 });
	}

	if (!content?.trim()) {
		return json({ error: 'Küsimustel on sisu vaja' }, { status: 400 });
	}

	// Normalize content
	const normalizedContent = content.trim();
	const finalContent =
		normalizedContent.at(-1) === '?' ? normalizedContent.slice(0, -1) : normalizedContent;

	try {
		// Use transaction to ensure data consistency
		const [newQuestion] = await db.transaction(async (tx) => {
			// Check for duplicate questions first
			const existingQuestion = await tx
				.select({ id: questions.id })
				.from(questions)
				.where(eq(questions.content, finalContent))
				.limit(1);

			if (existingQuestion.length > 0) {
				throw new Error('Seda on juba küsitud');
			}

			// Check user's recent questions (optional rate limiting)
			const recentQuestions = (await tx
				.select({ count: sql`count(*)` })
				.from(questions)
				.where(
					and(
						eq(questions.creator, userId),
						gt(questions.createdAt, sql`datetime('now', '-1 hour')`)
					)
				)) as { count: number }[];

			if (recentQuestions[0].count >= 10) {
				throw new Error('Rahu rahu! Oled tunni aja jooksul liiga palju küsimusi esitanud');
			}

			if (!questionBalanceStore.useQuestion(user)) {
				throw new Error('Pead vastama teistele enne küsimist');
			}

			// Insert the new question
			return await tx
				.insert(questions)
				.values({
					content: finalContent,
					creator: userId,
					answerCount: 0,
					createdAt: new Date()
				})
				.returning();
		});

		return json(newQuestion);
	} catch (e) {
		const error = e instanceof Error ? e.message : 'Küsimine põrus';
		return json({ error }, { status: 400 });
	}
}
