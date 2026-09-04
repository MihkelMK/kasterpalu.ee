import { formSchema as answerSchema } from '../answer-schema';
import { formSchema as questionSchema } from '../question-schema';
import type { Actions, PageServerLoad } from './$types';

import { altcha } from '$lib/altcha';
import { m } from '$lib/paraglide/messages';
import { ratelimit } from '$lib/server/redis';
import { fail, type RequestEvent } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

const handleRatelimit = async (user: string, useragent: string, ip: string) => {
  const { success: seshSuccess, reset: seshReset } = await ratelimit.rahvaAnswer.limit(user, {
    userAgent: useragent,
    ip: ip,
  });

  const { success: ipSuccess, reset: ipReset } = await ratelimit.rahvaAnswerIP.limit(ip, {
    userAgent: useragent,
    ip: ip,
  });

  if (seshSuccess && ipSuccess) return null;

  const resetAt = seshSuccess ? ipReset : seshReset;
  const timeRemaining = Math.floor((resetAt - Date.now()) / 1000);
  const message = m.error_rate_limit({ seconds: timeRemaining });
  return message;
};

const validateRequest = async (event: RequestEvent, user: string) => {
  const useragent = event.request.headers.get('user-agent') || '';
  const ip = event.request.headers.get('cf-connecting-ip') || event.getClientAddress();
  const limit_hit_message = await handleRatelimit(user, useragent, ip);
  if (limit_hit_message) return { code: 429, message: limit_hit_message };

  const altchaResult = await altcha.verifyEvent(event);
  if (altchaResult.error) return { code: 403, message: m.error_altcha() };
  return undefined;
};

const pageSize = 5;

export const load: PageServerLoad = async ({ fetch, params }) => {
  const page = params.page ? Number(params.page) : 1;

  const res = await fetch(`/api/rahvatarkus/archive/${pageSize}/${(page - 1) * pageSize}`);
  const { data: answers, meta } = await res.json();

  return {
    page,
    pageSize,
    answers,
    meta,
  };
};

export const actions: Actions = {
  answer: async (event) => {
    const { session } = event.locals;
    if (!session?.data?.userId) {
      return;
    }

    const form = await superValidate(event, zod4(answerSchema()));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const user = session.data.userId;
    const validation_failed = await validateRequest(event, user);

    if (validation_failed) {
      if (form.errors.answer) {
        form.errors.answer.push(validation_failed.message);
      } else {
        form.errors.answer = [validation_failed.message];
      }
      return fail(validation_failed.code, {
        form,
      });
    }

    const response = await event
      .fetch('/api/rahvatarkus/answer', {
        method: 'POST',
        body: JSON.stringify({
          userId: user,
          content: form.data.answer,
          questionId: form.data.questionId,
        }),
      })
      .then(async (res) => {
        const data = await res.json();
        return { ok: res.ok, data: data };
      })
      .then((data) => {
        return data;
      });

    if (!response.ok) {
      if (response.data?.error) {
        if (form.errors.answer) {
          form.errors.answer.push(response.data.error);
        } else {
          form.errors.answer = [response.data.error];
        }
      }

      return fail(400, {
        form,
      });
    }

    return {
      form,
    };
  },

  question: async (event) => {
    const { session } = event.locals;
    if (!session?.data?.userId) {
      return;
    }

    const form = await superValidate(event, zod4(questionSchema()));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const user = session.data.userId;
    const validation_failed = await validateRequest(event, user);

    if (validation_failed) {
      if (form.errors.question) {
        form.errors.question.push(validation_failed.message);
      } else {
        form.errors.question = [validation_failed.message];
      }
      return fail(validation_failed.code, {
        form,
      });
    }

    const response = await event
      .fetch('/api/rahvatarkus/question', {
        method: 'POST',
        body: JSON.stringify({ userId: user, content: form.data.question }),
      })
      .then(async (res) => {
        const data = await res.json();
        return { ok: res.ok, data: data };
      })
      .then((data) => {
        return data;
      });

    if (!response.ok) {
      if (response.data?.error) {
        if (form.errors.question) {
          form.errors.question.push(response.data.error);
        } else {
          form.errors.question = [response.data.error];
        }
      }

      return fail(400, {
        form,
      });
    }

    return {
      form,
    };
  },
};
