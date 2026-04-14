import { env } from '$env/dynamic/private';

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { sveltekitSessionHandle } from 'svelte-kit-sessions';

import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

declare module 'svelte-kit-sessions' {
  interface SessionData {
    userId: string;
  }
}

const originalHandle: Handle = sveltekitSessionHandle({ secret: env.SESH_SECRET as string });

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
    event.request = localizedRequest;
    return resolve(event, {
      transformPageChunk: ({ html }) => {
        return html.replace('%lang%', locale).replace('%dir%', getTextDirection(locale));
      },
    });
  });

export const handle = sequence(originalHandle, paraglideHandle);
