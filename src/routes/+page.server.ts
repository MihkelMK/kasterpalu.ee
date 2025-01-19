import { shuffleArray } from '$lib/utils';
import { nanoid } from 'nanoid';
import type { PageServerLoad } from './$types';
import type { AlbumSolveState } from '$lib/types';
import { albumState } from '$lib/server/AlbumState.svelte';
import { playerState } from '$lib/server/PlayerState.svelte';
import { invalidateAll } from '$app/navigation';

const count = 3;
export const load: PageServerLoad = async ({ fetch, locals }) => {
  const { session } = locals;

  if (!session?.data?.userId) {
    await session.setData({ userId: nanoid() });
    await session.save();
  }

  const user = session.data.userId;
  let stage = playerState.getStage(user);

  if (!stage) {
    playerState.newPlayer(user);
    stage = playerState.getStage(user);
  }

  const highscore = playerState.getHighscore(user);

  const albumData = await fetch(`/api/getAlbums/${count}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });

  const albumNames = albumData.albums.map((album) => ({ id: nanoid(), value: album.name }));
  const albumImages = albumData.albums.map((album) => ({
    id: nanoid(),
    value: album.images.at(0).url
  }));
  const albumArtists = albumData.albums.map((album) => ({
    id: nanoid(),
    value: album.artists.map((artist) => artist.name).join(', ')
  }));

  return {
    names: shuffleArray(albumNames),
    images: shuffleArray(albumImages),
    artists: shuffleArray(albumArtists),
    stage: stage,
    highscore: highscore
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const { session } = locals; // you can access `locals.session`

    if (!session?.data?.userId) {
      return;
    }

    const user = session.data.userId;
    const data = await request.formData();

    const state: AlbumSolveState[] = [];

    for (let i = 0; i < count; i++) {
      const name = data.get(`names_${i}`);
      const image = data.get(`images_${i}`);
      const artists = data.get(`artists_${i}`);

      const artistList = artists.split(', ');

      state.push({ name: name, imageUrl: image, artists: artistList });
    }

    const solved = albumState.checkSolve(state);

    playerState.score(user, solved);
    return { loading: false };
  }
};
