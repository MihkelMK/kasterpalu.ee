import { db } from '$lib/server/db';
import { answers, questions } from '$lib/server/db/schema';
import { maxAnswers } from '$lib/server/rahvatarkus/shared';
import { and, eq, exists, lt, not, sql } from 'drizzle-orm';

export default async (user: string) => {
  // Use the answerCount field and avoid joins
  const eligibleQuestions = await db
    .select({
      id: questions.id,
      content: questions.content,
      answerCount: questions.answerCount,
    })
    .from(questions)
    .where(
      and(
        not(eq(questions.creator, user)),
        lt(questions.answerCount, maxAnswers),
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

  return eligibleQuestions.at(0);
};
