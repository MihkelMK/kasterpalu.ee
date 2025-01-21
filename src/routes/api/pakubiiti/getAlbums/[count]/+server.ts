import { albumState } from '$lib/server/AlbumState.svelte';
import { spotifyAPI } from '$lib/server/Spotify.svelte';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
  const count = params.count || 1;

  const albums: SpotifyApi.AlbumObjectSimplified[] = [];

  for (let i = 0; i < count; i++) {
    const album = await spotifyAPI.getRandomAlbum();
    if (album) {
      albums.push(album);
    }
  }

  albumState.setAlbums(albums);

  return json({ albums: albums });
}
