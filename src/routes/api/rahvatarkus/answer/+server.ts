import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions, answers } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';

const maxAnswers = 5;

export async function POST({ locals, request }) {
	const { userId, questionId, content } = await request.json();
	const { session } = locals;

	if (!session?.data?.userId) return;
	const user = session.data.userId;

	if (!user || !userId || user !== userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Start transaction
	return await db.transaction(async (tx) => {
		// Get question and validate in one query
		const question = await tx
			.select({
				creator: questions.creator,
				answerCount: questions.answerCount
			})
			.from(questions)
			.where(eq(questions.id, questionId))
			.limit(1);

		if (!question.length) {
			return json({ error: 'Question not found' }, { status: 400 });
		}

		const [questionData] = question;

		// if (questionData.creator === user) {
		// 	return json({ error: 'Cannot answer own question' }, { status: 400 });
		// }

		if (questionData.answerCount >= maxAnswers) {
			return json({ error: 'No more answers needed' }, { status: 400 });
		}

		// Insert answer and update count atomically
		const [newAnswer] = await tx
			.insert(answers)
			.values({
				content,
				creator: userId,
				questionId
			})
			.returning();

		await tx
			.update(questions)
			.set({ answerCount: sql`${questions.answerCount} + 1` })
			.where(eq(questions.id, questionId));

		return json(newAnswer);
	});
}
