import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_TOKEN, UPSTASH_REDIS_URL } from '$env/static/private';

const redis = new Redis({
  url: UPSTASH_REDIS_URL,
  token: UPSTASH_REDIS_TOKEN
});

export const ratelimit = {
  noSesh: new Ratelimit({
    redis,
    prefix: 'ratelimit:noSesh',
    limiter: Ratelimit.slidingWindow(1, '1m'),
    enableProtection: true
  }),
  pakubiiti: new Ratelimit({
    redis,
    prefix: 'ratelimit:pakubiiti',
    limiter: Ratelimit.slidingWindow(5, '15s'),
    enableProtection: true
  }),
  pakubiitiIP: new Ratelimit({
    redis,
    prefix: 'ratelimit:pakubiitiIP',
    limiter: Ratelimit.slidingWindow(5, '15s'),
    enableProtection: true
  }),
  rahvaAnswer: new Ratelimit({
    redis,
    prefix: 'ratelimit:rahvaAnswer',
    limiter: Ratelimit.slidingWindow(8, '15s'),
    enableProtection: true
  }),
  rahvaAnswerIP: new Ratelimit({
    redis,
    prefix: 'ratelimit:rahvaAnswerIP',
    limiter: Ratelimit.slidingWindow(8, '15s'),
    enableProtection: true
  }),
  rahvaQuestion: new Ratelimit({
    redis,
    prefix: 'ratelimit:rahvaQuestion',
    limiter: Ratelimit.slidingWindow(8, '15s'),
    enableProtection: true
  }),
  rahvaQuestionIP: new Ratelimit({
    redis,
    prefix: 'ratelimit:rahvaQuestionIP',
    limiter: Ratelimit.slidingWindow(8, '15s'),
    enableProtection: true
  }),
  rahvaQuestionAPI: new Ratelimit({
    redis,
    prefix: 'ratelimit:rahvaQuestionAPI',
    limiter: Ratelimit.slidingWindow(15, '15s')
  })
};
