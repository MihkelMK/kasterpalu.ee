import type { AlbumSolveState } from '$lib/types';
import { albumState } from '$lib/server/AlbumState.svelte';
import { spotifyAPI } from '$lib/server/Spotify.svelte';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { state }: { state: AlbumSolveState[] } = request.json();

	const albums: SpotifyApi.AlbumObjectSimplified[] = [];

	return json({ albums: albums });
}
