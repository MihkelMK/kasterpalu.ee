import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions, answers } from '$lib/server/db/schema';
import { eq, gt, sql } from 'drizzle-orm';
import type { Question } from '$lib/types';

export async function GET({ params }) {
	const limit = Math.min(parseInt(params.limit) || 10, 10);
	const offset = parseInt(params.offset) || 0;

	// Get total in parallel with data
	const totalPromise = db
		.select({
			count: sql`count(*)`
		})
		.from(questions)
		.where(gt(questions.answerCount, 0));

	const questionsPromise = db
		.select({
			id: questions.id,
			content: questions.content,
			creator: questions.creator,
			createdAt: questions.createdAt,
			answers: sql`json_group_array(json_object(
        'id', ${answers.id},
        'content', ${answers.content},
        'creator', ${answers.creator},
        'createdAt', ${answers.createdAt}
      ))`
		})
		.from(questions)
		.innerJoin(answers, eq(questions.id, answers.questionId))
		.where(gt(questions.answerCount, 0))
		.groupBy(questions.id)
		.limit(limit)
		.offset(offset);

	const [total, curr_questions] = await Promise.all([totalPromise, questionsPromise]);

	return json({
		data: curr_questions.map((q) => ({
			...q,
			answers: JSON.parse(q.answers)
		})),
		meta: { limit, offset, total: total[0].count }
	});
}
