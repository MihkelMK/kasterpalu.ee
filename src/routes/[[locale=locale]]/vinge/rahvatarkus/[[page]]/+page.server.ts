import { formSchema as answerSchema } from '../answer-schema';
import { formSchema as questionSchema } from '../question-schema';
import type { Actions, PageServerLoad } from './$types';

import { addErrorMessage, verifyAltcha, verifyRatelimit } from '$lib/server/forms';
import getArchive from '$lib/server/rahvatarkus/getArchive';

import addAnswer from '$lib/server/rahvatarkus/addAnswer';
import addQuestion from '$lib/server/rahvatarkus/addQuestion';
import type { RatelimitRegion } from '$lib/server/redis';
import { getActiveUser } from '$lib/server/session';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

const pageSize = 5;

async function verifySubmission(event: RequestEvent, seshRegion: RatelimitRegion, ipRegion: RatelimitRegion) {
  return (await verifyRatelimit(event, seshRegion, ipRegion)) ?? (await verifyAltcha(event));
}

export const load: PageServerLoad = async ({ params }) => {
  const page = params.page ? Number(params.page) : 1;
  const { data: archive, meta } = await getArchive(pageSize, (page - 1) * pageSize);

  return {
    page,
    pageSize,
    archive,
    meta,
  };
};

export const actions: Actions = {
  answer: async (event) => {
    const { session } = event.locals;
    const activeUser = getActiveUser(session);
    if (!activeUser) return;

    const form = await superValidate(event, zod4(answerSchema()));
    if (!form.valid) return fail(400, { form });

    const validationFailed = await verifySubmission(event, 'rahvaAnswer', 'rahvaAnswerIP');
    if (validationFailed) {
      form.errors.answer = addErrorMessage(form.errors.answer, validationFailed.message);
      return fail(validationFailed.code, { form });
    }

    const { error: errorMessage } = await addAnswer(activeUser, form.data.answer, form.data.questionId);
    if (errorMessage) {
      form.errors.answer = addErrorMessage(form.errors.answer, errorMessage);
      return fail(400, { form });
    }

    return { form };
  },

  question: async (event) => {
    const { session } = event.locals;
    const activeUser = getActiveUser(session);
    if (!activeUser) return;

    const form = await superValidate(event, zod4(questionSchema()));
    if (!form.valid) return fail(400, { form });

    const verifyFailed = await verifySubmission(event, 'rahvaQuestion', 'rahvaQuestionIP');
    if (verifyFailed) {
      form.errors.question = addErrorMessage(form.errors.question, verifyFailed.message);
      return fail(verifyFailed.code, { form });
    }

    const { error: errorMessage } = await addQuestion(activeUser, form.data.question);
    if (errorMessage) {
      form.errors.question = addErrorMessage(form.errors.question, errorMessage);
      return fail(400, { form });
    }

    return { form };
  },
};
