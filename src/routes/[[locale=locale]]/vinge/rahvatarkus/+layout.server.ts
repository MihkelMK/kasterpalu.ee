import type { LayoutServerLoad } from './$types';
import { formSchema as answerSchema } from './answer-schema';
import { formSchema as questionSchema } from './question-schema';

import { addErrorMessage, verifyRatelimit } from '$lib/server/forms';
import getPoolSize from '$lib/server/rahvatarkus/getPoolSize';
import getQuestion from '$lib/server/rahvatarkus/getQuestion';
import { questionBalanceStore } from '$lib/server/rahvatarkus/QuestionBalance';
import { getOrCreateUser } from '$lib/server/session';

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: LayoutServerLoad = async (event) => {
  const { session } = event.locals;
  const activeUser = await getOrCreateUser(session);

  const userBalance = questionBalanceStore.getBalance(activeUser);

  const [poolSize, questionForm, verifyFailed] = await Promise.all([
    getPoolSize(),
    superValidate(zod4(questionSchema())),
    verifyRatelimit(event, 'rahvaLoad', 'rahvaLoadIP'),
  ]);

  if (verifyFailed) {
    questionForm.errors.question = addErrorMessage(questionForm.errors.question, verifyFailed.message);
  }

  const question = verifyFailed ? undefined : await getQuestion(activeUser);
  const answerForm = verifyFailed
    ? undefined
    : await superValidate({ questionId: question?.id }, zod4(answerSchema()), { errors: false });

  return {
    user: {
      id: activeUser,
      balance: userBalance,
    },
    poolSize,
    question,
    questionForm,
    answerForm,
  };
};
