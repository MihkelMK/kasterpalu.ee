import type { AlbumResponse, AlbumSolveState } from '$lib/types';
import type { PageServerLoad } from './$types';

import { shuffleArray } from '$lib/utils';
import { nanoid } from 'nanoid';

import { m } from '$lib/paraglide/messages';
import { verifyRatelimit } from '$lib/server/forms';
import { playerState } from '$lib/server/pakubiiti/PlayerState.svelte';
import { spotifyAPI } from '$lib/server/pakubiiti/Spotify.svelte';
import { getActiveUser, getOrCreateUser } from '$lib/server/session';

const count = 3;

const getFieldWithId = (albums: AlbumResponse[], key: keyof AlbumResponse) => {
  return albums.map((album: AlbumResponse) => ({
    id: nanoid(),
    value: album[key],
  }));
};

const loadAlbums = async (user: string) => {
  const albums = await spotifyAPI.getAlbums(count).catch(() => null);
  if (!albums) return undefined;

  playerState.setAlbums(user, albums);
  const albumNames = getFieldWithId(albums, 'name');
  const albumImages = getFieldWithId(albums, 'images');
  const albumArtists = getFieldWithId(albums, 'artists');

  return {
    names: shuffleArray(albumNames),
    images: shuffleArray(albumImages),
    artists: shuffleArray(albumArtists),
  };
};

export const load: PageServerLoad = async (event) => {
  const { session } = event.locals;
  const activeUser = await getOrCreateUser(session);

  if (!playerState.getStage(activeUser)) playerState.newPlayer(activeUser);
  const gameState = {
    stage: playerState.getStage(activeUser),
    highscore: playerState.getHighscore(activeUser),
    playing: playerState.getPlaying(activeUser),
  };
  if (!gameState.playing) return gameState;

  const verifyFailed = await verifyRatelimit(event, 'pakubiiti', 'pakubiitiIP');
  if (verifyFailed) {
    return { ...gameState, error: { title: m.error_rate_limit_title(), message: verifyFailed?.message } };
  }

  return {
    ...gameState,
    albums: loadAlbums(activeUser),
  };
};

export const actions = {
  submit: async (event) => {
    const { session } = event.locals;
    const activeUser = getActiveUser(session);
    if (!activeUser) return;

    const verifyFailed = await verifyRatelimit(event, 'pakubiiti', 'pakubiitiIP');
    if (verifyFailed) {
      return { error: { title: m.error_rate_limit_title(), message: verifyFailed?.message } };
    }

    const data = await event.request.formData();
    const state: AlbumSolveState[] = [];
    for (let i = 0; i < count; i++) {
      const name = data.get(`names_${i}`) as string;
      const image = data.get(`images_${i}`) as string;
      const artists = data.get(`artists_${i}`) as string;

      state.push({ name: name, image: image, artists: artists });
    }

    return { solved: playerState.score(activeUser, state) };
  },

  restart: async (event) => {
    const { session } = event.locals;
    const activeUser = getActiveUser(session);
    if (!activeUser) return;

    const verifyFailed = await verifyRatelimit(event, 'pakubiiti', 'pakubiitiIP');
    if (verifyFailed) {
      return { error: { title: m.error_rate_limit_title(), message: verifyFailed?.message } };
    }

    playerState.restart(activeUser);
    return { solved: undefined };
  },
};
