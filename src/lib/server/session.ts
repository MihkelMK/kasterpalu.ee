import { nanoid } from 'nanoid';
import type { Session } from 'svelte-kit-sessions';

export async function getOrCreateUser(session: Session) {
  if (!session?.data?.userId) {
    await session.setData({ userId: nanoid() });
    await session.save();
  }

  return session.data.userId;
}

export function getActiveUser(session: Session) {
  return session?.data?.userId || undefined;
}
