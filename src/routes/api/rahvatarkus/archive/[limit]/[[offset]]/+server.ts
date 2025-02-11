import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions, answers } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { Question } from '$lib/types';

export async function GET({ params }) {
	const limit = parseInt(params.limit) || 10;
	const offset = parseInt(params.offset) || 0;

	// Get total count
	const [{ total }] = await db
		.select({
			total: sql`count(DISTINCT ${questions.id})`
		})
		.from(questions)
		.innerJoin(answers, eq(questions.id, answers.questionId));

	const results = await db
		.select({
			question: questions,
			answers: answers
		})
		.from(questions)
		.innerJoin(answers, eq(questions.id, answers.questionId))
		.limit(limit)
		.offset(offset);

	// Group answers by question
	type QuestionMap = {
		[key: string]: Question;
	};

	const questionsWithAnswers = results.reduce<QuestionMap>((acc, row) => {
		const questionId = row.question.id;

		if (!acc[questionId]) {
			acc[questionId] = {
				...row.question,
				answers: []
			};
		}

		if (row.answers) {
			acc[questionId].answers.push(row.answers);
		}

		return acc;
	}, {});

	return json({ data: Object.values(questionsWithAnswers), meta: { limit, offset, total } });
}
