import type { LayoutServerData } from './$types';

import { site } from '$lib/config';
import games from '$lib/data/games';

export const load: LayoutServerData = async ({ url }) => {
	if (!url?.pathname) {
		return;
	}

	const gameSlug = url.pathname.split('/').at(-1);

	const game = games[gameSlug];

	if (!game) {
		return;
	}

	return {
		name: game.name,
		description: game.description || site.description,
		image: game.image || site.image
	};
};
