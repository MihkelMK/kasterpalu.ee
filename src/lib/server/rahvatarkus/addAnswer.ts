import { eq, sql } from 'drizzle-orm';

import { m } from '$lib/paraglide/messages';
import { db } from '$lib/server/db';
import { answers, questions } from '$lib/server/db/schema';
import { questionBalanceStore } from '$lib/server/rahvatarkus/QuestionBalance';
import { cleanContent, maxAnswers } from '$lib/server/rahvatarkus/shared';

export default async (user: string, content: string, questionId: string) => {
  const finalContent = cleanContent(content);
  // better-sqlite3 is synchronous. Transaction callback must not be async
  return db.transaction((tx) => {
    const question = tx
      .select({
        creator: questions.creator,
        answerCount: questions.answerCount,
      })
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1)
      .all();

    if (!question.length) {
      return { error: m['rahvatarkus.error_question_not_found']() };
    }

    const [questionData] = question;

    if (questionData.creator === user) {
      return { error: m['rahvatarkus.error_answer_to_self']() };
    }

    if (questionData.answerCount >= maxAnswers) {
      return { error: m['rahvatarkus.error_answer_max']() };
    }

    // Insert answer and update count atomically
    tx.insert(answers)
      .values({
        content: finalContent,
        creator: user,
        questionId,
      })
      .returning()
      .all();

    tx.update(questions)
      .set({ answerCount: sql`${questions.answerCount} + 1` })
      .where(eq(questions.id, questionId))
      .run();

    // Valid answer. Allow user to ask one question
    questionBalanceStore.addQuestions(user);

    return { error: null };
  });
};
