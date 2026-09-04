import { altcha } from '$lib/altcha';
import { m } from '$lib/paraglide/messages';
import { ratelimit, type RatelimitRegion } from '$lib/server/redis';
import { type RequestEvent } from '@sveltejs/kit';

export async function verifyRatelimit(event: RequestEvent, seshRegion: RatelimitRegion, ipRegion: RatelimitRegion) {
  const user = event.locals.session.data.userId;
  const userAgent = event.request.headers.get('user-agent') || '';
  const ip = event.request.headers.get('cf-connecting-ip') || event.getClientAddress();

  const [seshLimit, ipLimit] = await Promise.all([
    ratelimit[seshRegion].limit(user, { userAgent, ip }),
    ratelimit[ipRegion].limit(ip, { userAgent }),
  ]);

  if (seshLimit.success && ipLimit.success) return null;

  const reset = !seshLimit.success ? seshLimit.reset : ipLimit.reset;
  const seconds = Math.floor((reset - Date.now()) / 1000);
  return { code: 429, message: m.error_rate_limit({ seconds }) };
}

export async function verifyAltcha(event: RequestEvent) {
  const altchaResult = await altcha.verifyEvent(event);
  if (altchaResult.verification?.verified) return null;

  return { code: 403, message: m.error_altcha() };
}

export function addErrorMessage(messages: string[] | undefined, error: string) {
  if (messages) return messages.concat(error);
  return [error];
}
