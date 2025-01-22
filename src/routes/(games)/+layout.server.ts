import type { LayoutServerData } from './$types';
import { games } from '$lib/config';

export const load: LayoutServerData = async ({ url }) => {
  if (!url?.pathname) {
    return;
  }

  const game = games[url.pathname];

  if (!game) {
    return;
  }

  return {
    name: game.name,
    description: game.description,
    image: game.image
  };
};
