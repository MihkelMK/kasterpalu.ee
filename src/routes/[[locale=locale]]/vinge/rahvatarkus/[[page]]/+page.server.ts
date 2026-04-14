import { formSchema as answerSchema } from '../answer-schema';
import { formSchema as questionSchema } from '../question-schema';
import type { Actions, PageServerLoad } from './$types';

import { altcha } from '$lib/altcha';
import { m } from '$lib/paraglide/messages';
import { ratelimit } from '$lib/server/redis';
import { fail } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

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

    const user = session.data.userId;

    const form = await superValidate(event, zod4(answerSchema()));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const useragent = event.request.headers.get('user-agent') || '';
    const ip = event.request.headers.get('cf-connecting-ip') || event.getClientAddress();

    const { success: seshSuccess, reset: seshReset } = await ratelimit.rahvaAnswer.limit(user, {
      userAgent: useragent,
      ip: ip,
    });

    const { success: ipSuccess, reset: ipReset } = await ratelimit.rahvaAnswerIP.limit(ip, {
      userAgent: useragent,
      ip: ip,
    });

    if (!seshSuccess) {
      const timeRemaining = Math.floor((seshReset - Date.now()) / 1000);
      const message = m.rate_limit({ seconds: timeRemaining });

      if (form.errors.answer) {
        form.errors.answer.push(message);
      } else {
        form.errors.answer = [message];
      }
      return fail(429, {
        form,
      });
    }

    if (!ipSuccess) {
      const timeRemaining = Math.floor((ipReset - Date.now()) / 1000);
      const message = m.rate_limit({ seconds: timeRemaining });

      if (form.errors.answer) {
        form.errors.answer.push(message);
      } else {
        form.errors.answer = [message];
      }
      return fail(429, {
        form,
      });
    }

    const altchaResult = await altcha.verifyEvent(event);

    if (altchaResult.error) {
      const message = m.altcha_error();

      if (form.errors.answer) {
        form.errors.answer.push(message);
      } else {
        form.errors.answer = [message];
      }
      return fail(403, {
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

    const user = session.data.userId;

    const form = await superValidate(event, zod4(questionSchema()));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const useragent = event.request.headers.get('user-agent') || '';
    const ip = event.request.headers.get('cf-connecting-ip') || event.getClientAddress();

    const { success: seshSuccess, reset: seshReset } = await ratelimit.rahvaQuestion.limit(user, {
      userAgent: useragent,
      ip: ip,
    });

    const { success: ipSuccess, reset: ipReset } = await ratelimit.rahvaQuestionIP.limit(ip, {
      userAgent: useragent,
      ip: ip,
    });

    if (!seshSuccess) {
      const timeRemaining = Math.floor((seshReset - Date.now()) / 1000);
      const message = m.rate_limit({ seconds: timeRemaining });

      if (form.errors.question) {
        form.errors.question.push(message);
      } else {
        form.errors.question = [message];
      }
      return fail(429, {
        form,
      });
    }

    if (!ipSuccess) {
      const timeRemaining = Math.floor((ipReset - Date.now()) / 1000);
      const message = m.rate_limit({ seconds: timeRemaining });

      if (form.errors.question) {
        form.errors.question.push(message);
      } else {
        form.errors.question = [message];
      }
      return fail(429, {
        form,
      });
    }

    const altchaResult = await altcha.verifyEvent(event);

    if (altchaResult.error) {
      const message = m.altcha_error();

      if (form.errors.question) {
        form.errors.question.push(message);
      } else {
        form.errors.question = [message];
      }
      return fail(403, {
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
