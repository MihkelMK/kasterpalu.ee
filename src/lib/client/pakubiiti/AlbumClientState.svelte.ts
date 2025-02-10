import { getContext, onDestroy, setContext } from 'svelte';
import type { AlbumData, AlbumDataField } from '$lib/types';

export class AlbumClientState {
	albums = $state<AlbumData>({
		names: [],
		artists: [],
		images: []
	});

	constructor() {
		onDestroy(() => {
			this.albums = {
				names: [],
				artists: [],
				images: []
			};
		});
	}

	update(items: AlbumDataField[], type: string) {
		if (type === 'names') {
			this.albums.names = items;
		}

		if (type === 'artists') {
			this.albums.artists = items;
		}

		if (type === 'images') {
			this.albums.images = items;
		}
	}
}

const ALBUM_KEY = Symbol('ALBUM');

export function setAlbumClientState() {
	return setContext(ALBUM_KEY, new AlbumClientState());
}

export function getAlbumClientState() {
	return getContext<ReturnType<typeof setAlbumClientState>>(ALBUM_KEY);
}
