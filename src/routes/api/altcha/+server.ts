import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

import { createChallenge, verifySolution } from 'altcha-lib';

export async function GET() {
  const challenge = await createChallenge({
    hmacKey: env.ALTCHA_HMAC as string,
    maxNumber: 100000, // the maximum random number
  });
  console.log('challange get');

  return json(challenge);
}

export async function POST({ request }) {
  const { payload }: { payload: string } = await request.json();
  console.log('challange done');
  const ok = await verifySolution(payload, env.ALTCHA_HMAC as string);

  return json({ ok });
}
