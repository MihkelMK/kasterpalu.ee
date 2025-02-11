import type { LayoutServerLoad } from './$types';
import type { Question } from '$lib/types';
import { formSchema as questionSchema } from './question-schema';
import { formSchema as answerSchema } from './answer-schema';

import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { nanoid } from 'nanoid';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
  const { session } = locals;

  if (!session?.data?.userId) {
    await session.setData({ userId: nanoid() });
    await session.save();
  }

  const user = session.data.userId;

  const res = await fetch('/api/rahvatarkus/question')
    .then(async (res) => {
      const data = await res.json();
      return { ok: res.ok, data: data };
    })
    .then((data) => {
      return data;
    });

  let question: Question | undefined = undefined;

  if (res.ok) {
    question = res.data;
  }

  return {
    user: user,
    question: question,
    question_form: await superValidate(zod(questionSchema)),
    answer_form: await superValidate({ questionId: question?.id }, zod(answerSchema), {
      errors: false
    })
  };
};
