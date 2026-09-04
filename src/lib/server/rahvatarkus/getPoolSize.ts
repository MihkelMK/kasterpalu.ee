import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { maxAnswers } from './shared';

export default async () => {
  const results = await db
    .select({
      poolSize: sql`COUNT(CASE WHEN answer_count < ${maxAnswers} THEN 1 END)`,
    })
    .from(questions);

  return Number(results[0].poolSize);
};
