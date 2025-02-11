import { json } from '@sveltejs/kit';
import getPoolSize from '$lib/server/rahvatarkus/getPoolSize';

export async function GET() {
	const size = await getPoolSize();

	return json({ size });
}
