import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { SESH_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { sveltekitSessionHandle } from 'svelte-kit-sessions';

declare module 'svelte-kit-sessions' {
	interface SessionData {
		userId: string;
	}
}

const originalHandle: Handle = sveltekitSessionHandle({ secret: SESH_SECRET });

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle = sequence(originalHandle, handleParaglide);
