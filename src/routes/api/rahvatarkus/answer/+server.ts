import { json } from '@sveltejs/kit';

import { eq, sql } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { questions, answers } from '$lib/server/db/schema';
import { questionBalanceStore } from '$lib/server/rahvatarkus/QuestionBalance';
import { ratelimit } from '$lib/server/redis';

const maxAnswers = 5;

export async function POST({ locals, request }) {
  const { userId, questionId, content } = await request.json();
  const { session } = locals;

  if (!session?.data?.userId) return json({ error: 'Unauthorized' }, { status: 401 });
  const user = session.data.userId;

  if (!user || !userId || user !== userId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { success, reset } = await ratelimit.rahvaAnswer.limit(user);

  if (!success) {
    const timeRemaining = Math.floor((reset - Date.now()) / 1000);
    const message = `Võta veits rahulikumalt. Proovi ${timeRemaining}s pärast uuesti.`;

    return json({ error: message }, { status: 429 });
  }

  // better-sqlite3 is synchronous — transaction callback must not be async
  const result = db.transaction((tx) => {
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
      return { error: 'Seda küsimust ei leitud', status: 400 } as const;
    }

    const [questionData] = question;

    if (questionData.creator === user) {
      return { error: 'Iseendale vastamine ei ole produktiivne', status: 400 } as const;
    }

    if (questionData.answerCount >= maxAnswers) {
      return { error: 'Sellel küsimusel on juba piisavalt vastuseid', status: 400 } as const;
    }

    // Insert answer and update count atomically
    const [newAnswer] = tx
      .insert(answers)
      .values({
        content,
        creator: userId,
        questionId,
      })
      .returning()
      .all();

    tx.update(questions)
      .set({ answerCount: sql`${questions.answerCount} + 1` })
      .where(eq(questions.id, questionId))
      .run();

    // Valid answer — allow this user to ask one question
    questionBalanceStore.addQuestions(user);

    return { data: newAnswer, status: 200 } as const;
  });

  if ('error' in result) {
    return json({ error: result.error }, { status: result.status });
  }

  return json(result.data);
}
