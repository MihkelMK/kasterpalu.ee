import { SESH_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { sveltekitSessionHandle } from 'svelte-kit-sessions';

export const handle: Handle = sveltekitSessionHandle({
	secret: SESH_SECRET
});

declare module 'svelte-kit-sessions' {
	interface SessionData {
		userId: string;
	}
}
