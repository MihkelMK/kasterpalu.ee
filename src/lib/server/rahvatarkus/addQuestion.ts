import { and, eq, gt, sql } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';
import { questionBalanceStore } from '$lib/server/rahvatarkus/QuestionBalance';
import { cleanContent } from '$lib/server/rahvatarkus/shared';
import { m } from '$lib/paraglide/messages';

export default async (user: string, content: string) => {
  const finalContent = cleanContent(content);
  // better-sqlite3 is synchronous. Transaction callback must not be async
  return db.transaction((tx) => {
    // Check for duplicate questions first
    const existingQuestion = tx
      .select({ id: questions.id })
      .from(questions)
      .where(eq(questions.content, finalContent))
      .limit(1)
      .all();

    if (existingQuestion.length > 0) {
      return { error: m['rahvatarkus.error_question_exists']() };
    }

    // Check user's recent questions (optional rate limiting)
    const recentQuestions = tx
      .select({ count: sql<number>`count(*)` })
      .from(questions)
      .where(and(eq(questions.creator, user), gt(questions.createdAt, sql`datetime('now', '-1 hour')`)))
      .all();

    if (recentQuestions[0].count >= 10) {
      return { error: m['rahvatarkus.error_question_ratelimit']() };
    }

    if (!questionBalanceStore.useQuestion(user)) {
      return { error: m['rahvatarkus.error_no_balance']() };
    }

    // Insert the new question
    tx.insert(questions)
      .values({
        content: finalContent,
        creator: user,
        answerCount: 0,
        createdAt: new Date(),
      })
      .returning()
      .all();

    return { error: null };
  });
};
