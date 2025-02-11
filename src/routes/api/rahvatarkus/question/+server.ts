import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions, answers } from '$lib/server/db/schema';
import { eq, count, and, not, sql } from 'drizzle-orm';

export async function GET({ locals }) {
	const { session } = locals;

	if (!session?.data?.userId) {
		return;
	}

	const user = session.data.userId;

	const questionWithAnswerCount = await db
		.select({
			id: questions.id,
			content: questions.content,
			answerCount: count(answers.id)
		})
		.from(questions)
		.leftJoin(answers, eq(questions.id, answers.questionId))
		.groupBy(questions.id)
		.having(and(sql`${count(answers.id)} < 5`, not(eq(questions.creator, user))))
		.orderBy(sql`RANDOM()`)
		.limit(1);

	if (!questionWithAnswerCount.length) {
		return json({ error: 'No questions available' }, { status: 404 });
	}

	return json(questionWithAnswerCount[0]);
}

export async function POST({ locals, request }) {
	const { userId, content }: { userId: string; content: string } = await request.json();
	const { session } = locals;

	if (!session?.data?.userId) {
		return;
	}

	const user = session.data.userId;

	if (!user || !userId || user !== userId) {
		console.log(user, userId);
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!content) {
		return json({ error: 'Content is required' }, { status: 400 });
	}

	try {
		const [newQuestion] = await db
			.insert(questions)
			.values({
				content: content.at(-1) === '?' ? content.slice(0, -1) : content,
				creator: userId
			})
			.returning();

		return json(newQuestion);
	} catch (e) {
		return json({ error: e }, { status: 400 });
	}
}
