import type { Question } from '$lib/types';
import type { LayoutServerLoad } from './$types';
import { formSchema as answerSchema } from './answer-schema';
import { formSchema as questionSchema } from './question-schema';

import { questionBalanceStore } from '$lib/server/rahvatarkus/QuestionBalance';
import { nanoid } from 'nanoid';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
  const { session } = locals;

  if (!session?.data?.userId) {
    await session.setData({ userId: nanoid() });
    await session.save();
  }

  const user = session.data.userId;
  const userBalance = questionBalanceStore.getBalance(user);

  const poolSize = await fetch('/api/rahvatarkus/pool')
    .then((res) => res.json())
    .then((data) => data.size);

  let question: Question | undefined = undefined;
  if (poolSize !== 0) {
    const res = await fetch('/api/rahvatarkus/question').then(async (res) => {
      const data = await res.json();
      return { ok: res.ok, data };
    });

    if (res.ok) {
      question = res.data;
    }
  }

  return {
    user: {
      id: user,
      balance: userBalance,
    },
    question,
    poolSize,
    question_form: await superValidate(zod4(questionSchema())),
    answer_form: await superValidate({ questionId: question?.id }, zod4(answerSchema()), {
      errors: false,
    }),
  };
};
