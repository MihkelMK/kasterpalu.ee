import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
	const results = await db
		.select({
			poolSize: sql`COUNT(CASE WHEN answer_count < 5 THEN 1 END)`
		})
		.from(questions);

	return json({
		size: Number(results[0].poolSize)
	});
}
