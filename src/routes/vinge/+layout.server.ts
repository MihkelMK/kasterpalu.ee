import type { LayoutServerLoad } from './$types';

import { site } from '$lib/config';
import games from '$lib/data/games';

export const load: LayoutServerLoad = async ({ url }) => {
  if (!url?.pathname) {
    return;
  }

  const gameSlug = url.pathname.split('/').at(-1);

  if (!gameSlug) {
    return;
  }

  const game = games[gameSlug];

  if (!game) {
    return;
  }

  return {
    name: game.name(),
    description: game.description() || site.description,
    image: game.image || site.image,
  };
};
