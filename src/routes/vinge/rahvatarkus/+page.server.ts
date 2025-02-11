import type { Actions, PageServerLoad } from './$types';
import type { Question } from '$lib/types';
import { formSchema as questionSchema } from './question-schema';
import { formSchema as answerSchema } from './answer-schema';

import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { nanoid } from 'nanoid';
import { fail } from '@sveltejs/kit';

const perPage = 5;

export const load: PageServerLoad = async ({ fetch, locals }) => {
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

	const archiveRes = fetch(`/api/rahvatarkus/archive/${perPage}`)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			return data;
		});

	return {
		user: user,
		question: question,
		question_form: await superValidate(zod(questionSchema)),
		answer_form: await superValidate({ questionId: question?.id }, zod(answerSchema), {
			errors: false
		}),
		perPage,
		streamed: {
			archive: archiveRes
		}
	};
};

export const actions: Actions = {
	answer: async (event) => {
		const { session } = event.locals;
		if (!session?.data?.userId) {
			return;
		}

		const user = session.data.userId;

		const form = await superValidate(event, zod(answerSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await event
			.fetch('/api/rahvatarkus/answer', {
				method: 'POST',
				body: JSON.stringify({
					userId: user,
					content: form.data.answer,
					questionId: form.data.questionId
				})
			})
			.then(async (res) => {
				const data = await res.json();
				return { ok: res.ok, data: data };
			})
			.then((data) => {
				return data;
			});

		if (!response.ok) {
			const errorMessage = response.data?.error;

			if (form.errors.answer) {
				form.errors.answer.push(errorMessage);
			} else {
				form.errors.answer = [errorMessage];
			}

			return fail(400, {
				form
			});
		}

		return {
			form
		};
	},

	question: async (event) => {
		const { session } = event.locals;
		if (!session?.data?.userId) {
			return;
		}

		const user = session.data.userId;

		const form = await superValidate(event, zod(questionSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await event
			.fetch('/api/rahvatarkus/question', {
				method: 'POST',
				body: JSON.stringify({ userId: user, content: form.data.question })
			})
			.then(async (res) => {
				const data = await res.json();
				return { ok: res.ok, data: data };
			})
			.then((data) => {
				return data;
			});

		if (!response.ok) {
			if (response.data?.error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				const errorMessage = 'Sellel küsimusel on juba vastus.';

				if (form.errors.question) {
					form.errors.question.push(errorMessage);
				} else {
					form.errors.question = [errorMessage];
				}
			}

			return fail(400, {
				form
			});
		}

		return {
			form
		};
	}
};
