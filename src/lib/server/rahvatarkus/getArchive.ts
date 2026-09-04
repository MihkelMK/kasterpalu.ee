import { db } from '$lib/server/db';
import { questions, answers } from '$lib/server/db/schema';
import { desc, eq, gt, sql } from 'drizzle-orm';

export default async (limit: number = 10, offset: number = 0) => {
  // Get total in parallel with data
  const totalPromise = db
    .select({
      count: sql<number>`count(*)`,
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
      ))`,
    })
    .from(questions)
    .orderBy(desc(questions.createdAt))
    .innerJoin(answers, eq(questions.id, answers.questionId))
    .where(gt(questions.answerCount, 0))
    .groupBy(questions.id)
    .limit(limit)
    .offset(offset);

  const [total, curr_questions] = await Promise.all([totalPromise, questionsPromise]);

  return {
    data: curr_questions.map((q) => ({
      ...q,
      answers: JSON.parse(q.answers as string),
    })),
    meta: { limit, offset, total: total[0].count },
  };
};
