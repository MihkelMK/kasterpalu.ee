import type { Actions, PageServerLoad } from './$types';
import { formSchema as questionSchema } from './question-schema';
import { formSchema as answerSchema } from './answer-schema';

import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { ratelimit } from '$lib/server/redis';

const pageSize = 5;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('leht')) || 1;

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

		const useragent = event.request.headers.get('user-agent') || '';
		const ip = event.request.headers.get('cf-connecting-ip') || event.getClientAddress();

		const { success: seshSuccess, reset: seshReset } = await ratelimit.rahvaAnswer.limit(user, {
			userAgent: useragent,
			ip: ip
		});

		const { success: ipSuccess, reset: ipReset } = await ratelimit.rahvaAnswerIP.limit(ip, {
			userAgent: useragent,
			ip: ip
		});

		if (!seshSuccess) {
			const timeRemaining = Math.floor((seshReset - Date.now()) / 1000);
			const message = `Võta veits rahulikumalt. Sesh Proovi ${timeRemaining}s pärast uuesti.`;

			if (form.errors.answer) {
				form.errors.answer.push(message);
			} else {
				form.errors.answer = [message];
			}
			return fail(429, {
				form
			});
		}

		if (!ipSuccess) {
			const timeRemaining = Math.floor((ipReset - Date.now()) / 1000);
			const message = `Võta veits rahulikumalt. IP Proovi ${timeRemaining}s pärast uuesti.`;

			if (form.errors.answer) {
				form.errors.answer.push(message);
			} else {
				form.errors.answer = [message];
			}
			return fail(429, {
				form
			});
		}

		const altchaValid = await event
			.fetch('/api/altcha', { method: 'POST', body: JSON.stringify({ payload: form.data.altcha }) })
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			});

		if (!altchaValid) {
			const message =
				'Altchale ei meeldinud see. Sa oled kas liiga boti laadse käitumisega või minu implementatsioon on kohutav.';

			if (form.errors.answer) {
				form.errors.answer.push(message);
			} else {
				form.errors.answer = [message];
			}
			return fail(429, {
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
			if (response.data?.error) {
				if (form.errors.answer) {
					form.errors.answer.push(response.data.error);
				} else {
					form.errors.answer = [response.data.error];
				}
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

		const useragent = event.request.headers.get('user-agent') || '';
		const ip = event.request.headers.get('cf-connecting-ip') || event.getClientAddress();

		const { success: seshSuccess, reset: seshReset } = await ratelimit.rahvaQuestion.limit(user, {
			userAgent: useragent,
			ip: ip
		});

		const { success: ipSuccess, reset: ipReset } = await ratelimit.rahvaQuestionIP.limit(ip, {
			userAgent: useragent,
			ip: ip
		});

		if (!seshSuccess) {
			const timeRemaining = Math.floor((seshReset - Date.now()) / 1000);
			const message = `Võta veits rahulikumalt. Sesh Proovi ${timeRemaining}s pärast uuesti.`;

			if (form.errors.question) {
				form.errors.question.push(message);
			} else {
				form.errors.question = [message];
			}
			return fail(429, {
				form
			});
		}

		if (!ipSuccess) {
			const timeRemaining = Math.floor((ipReset - Date.now()) / 1000);
			const message = `Võta veits rahulikumalt. IP Proovi ${timeRemaining}s pärast uuesti.`;

			if (form.errors.question) {
				form.errors.question.push(message);
			} else {
				form.errors.question = [message];
			}
			return fail(429, {
				form
			});
		}

		const altchaValid = await event
			.fetch('/api/altcha', { method: 'POST', body: JSON.stringify({ payload: form.data.altcha }) })
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				return data;
			});

		if (!altchaValid) {
			const message =
				'Altchale ei meeldinud see. Sa oled kas liiga boti laadse käitumisega või minu implementatsioon on kohutav.';

			if (form.errors.question) {
				form.errors.question.push(message);
			} else {
				form.errors.question = [message];
			}
			return fail(429, {
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
			if (response.data?.error) {
				if (form.errors.question) {
					form.errors.question.push(response.data.error);
				} else {
					form.errors.question = [response.data.error];
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
