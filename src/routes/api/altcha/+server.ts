import { ALTCHA_HMAC } from '$env/static/private';
import { json } from '@sveltejs/kit';

import { createChallenge, verifySolution } from 'altcha-lib';

export async function GET() {
	const challenge = await createChallenge({
		hmacKey: ALTCHA_HMAC,
		maxNumber: 100000 // the maximum random number
	});
	console.log('challange get');

	return json(challenge);
}

export async function POST({ request }) {
	const { payload }: { payload: string } = await request.json();
	console.log('challange done');
	const ok = await verifySolution(payload, ALTCHA_HMAC);

	return json({ ok });
}
