import { shuffleArray } from '$lib/utils';
import { nanoid } from 'nanoid';
import type { PageServerLoad } from './$types';
import type { AlbumSolveState } from '$lib/types';
import { albumState } from '$lib/server/pakubiiti/AlbumState.svelte';
import { playerState } from '$lib/server/pakubiiti/PlayerState.svelte';

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

	if (!playerState.getPlaying(user)) {
		return {
			stage: stage,
			highscore: highscore,
			playing: false
		};
	}

	const albumData = fetch(`/api/pakubiiti/getAlbums/${count}`)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			const albumNames = data.albums.map((album: AlbumSolveState) => ({
				id: nanoid(),
				value: album.name
			}));
			const albumImages = data.albums.map((album: AlbumSolveState) => ({
				id: nanoid(),
				value: album.image
			}));
			const albumArtists = data.albums.map((album: AlbumSolveState) => ({
				id: nanoid(),
				value: album.artists
			}));

			return {
				names: shuffleArray(albumNames),
				images: shuffleArray(albumImages),
				artists: shuffleArray(albumArtists)
			};
		})
		.catch((err) => {
			console.log(err);

			return undefined;
		});

	return {
		stage: stage,
		highscore: highscore,
		playing: true,
		streamed: { albums: albumData }
	};
};

export const actions = {
	submit: async ({ request, locals }) => {
		const { session } = locals;
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

			state.push({ name: name, image: image, artists: artists });
		}

		const solved = albumState.checkSolve(state);

		playerState.score(user, solved);

		return { solved: solved };
	},

	restart: async ({ locals }) => {
		const { session } = locals;
		if (!session?.data?.userId) {
			return;
		}

		const user = session.data.userId;

		playerState.restart(user);

		return { solved: undefined };
	}
};
