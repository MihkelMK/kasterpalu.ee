import type { Actions, PageServerLoad } from './$types';
import { formSchema as questionSchema } from './question-schema';
import { formSchema as answerSchema } from './answer-schema';

import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

const pageSize = 5;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('leht')) || 0;

	const archiveRes = fetch(`/api/rahvatarkus/archive/${pageSize}/${(page - 1) * pageSize}`)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			return data;
		});

	return {
		page,
		pageSize,
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
