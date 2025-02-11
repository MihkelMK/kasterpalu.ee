import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions, answers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const maxAnswers = 5;

export async function POST({ locals, request }) {
	const { userId, questionId, content }: { userId: string; questionId: string; content: string } =
		await request.json();
	const { session } = locals;

	if (!session?.data?.userId) {
		return;
	}

	const user = session.data.userId;

	if (!user || !userId || user !== userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (!content) {
		return json({ error: 'Answer is required' }, { status: 400 });
	}

	if (!questionId) {
		return json({ error: 'No question specified' }, { status: 400 });
	}

	const question = await db
		.select({
			question: questions
		})
		.from(questions)
		.where(eq(questions.id, questionId))
		.limit(1);

	if (!question) {
		return json({ error: 'Question not found' }, { status: 400 });
	}

	if (question[0].question.creator === user) {
		return json({ error: 'Not allowed to answer your own question' }, { status: 400 });
	}

	const currentAnswers = await db
		.select({
			answer: answers
		})
		.from(answers)
		.where(eq(answers.questionId, questionId));

	if (currentAnswers.length >= maxAnswers) {
		return json({ error: 'No more answers needed for this question' }, { status: 400 });
	}

	try {
		const [newAnswer] = await db
			.insert(answers)
			.values({
				content: content,
				creator: userId,
				questionId: questionId
			})
			.returning();

		return json(newAnswer);
	} catch (e) {
		return json({ error: e }, { status: 400 });
	}
}
