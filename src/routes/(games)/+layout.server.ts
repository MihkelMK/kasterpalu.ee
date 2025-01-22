import type { LayoutServerData } from './$types';
import { games, site } from '$lib/config';

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
		description: game.description || site.description,
		image: game.image || site.image
	};
};
