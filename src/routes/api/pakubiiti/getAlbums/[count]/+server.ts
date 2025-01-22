import { albumState } from '$lib/server/AlbumState.svelte';
import { spotifyAPI } from '$lib/server/Spotify.svelte';
import type { AlbumSolveState } from '$lib/types';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const count = params.count || 1;

	const albums: AlbumSolveState[] = [];

	for (let i = 0; i < count; i++) {
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

	albumState.setAlbums(albums);

	return json({ albums: albums });
}
