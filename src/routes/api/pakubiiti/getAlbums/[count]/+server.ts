import type { AlbumSolveState } from '$lib/types';

import { error, json } from '@sveltejs/kit';
import { spotifyAPI } from '$lib/server/pakubiiti/Spotify.svelte';

const maxTries = 10;

export async function GET({ params }) {
	const count = Number(params.count) || 1;

	const albums: AlbumSolveState[] = [];
	let tries = 0;

	while (albums.length < count && tries++ < maxTries) {
		const album = await spotifyAPI.getRandomAlbum();

		if (album) {
			const image = album.images.at(0);
			if (!image?.url) {
				return;
			}

			albums.push({
				name: album.name,
				artists: album.artists.map((artist) => artist.name).join(', '),
				image: image.url
			});
		}
	}

	if (albums.length !== count) {
		return error(500, "Couldn't get albums from Spotify.");
	}

	return json({ albums: albums });
}
