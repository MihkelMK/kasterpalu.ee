import type { PageServerLoad } from './$types';
import type { AlbumSolveState } from '$lib/types';

import { nanoid } from 'nanoid';
import { shuffleArray } from '$lib/utils';

import { playerState } from '$lib/server/pakubiiti/PlayerState.svelte';
import { ratelimit } from '$lib/server/redis';

const count = 3;

export const load: PageServerLoad = async (event) => {
	const { session } = event.locals;

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

	const useragent = event.request.headers.get('user-agent') || '';
	const ip = event.request.headers.get('cf-connecting-ip') || event.getClientAddress();

	const { success: seshSuccess, reset: seshReset } = await ratelimit.pakubiiti.limit(user, {
		userAgent: useragent,
		ip: ip
	});

	const { success: ipSuccess, reset: ipReset } = await ratelimit.pakubiitiIP.limit(ip, {
		userAgent: useragent,
		ip: ip
	});

	if (!seshSuccess) {
		const timeRemaining = Math.floor((seshReset - Date.now()) / 1000);
		const message = `Proovi ${timeRemaining}s pärast uuesti.`;

		return {
			stage: stage,
			highscore: highscore,
			playing: true,
			error: { title: 'Võta veits rahulikumalt', message }
		};
	}

	if (!ipSuccess) {
		const timeRemaining = Math.floor((ipReset - Date.now()) / 1000);
		const message = `Proovi ${timeRemaining}s pärast uuesti.`;

		return {
			stage: stage,
			highscore: highscore,
			playing: true,
			error: { title: 'Võta veits rahulikumalt', message }
		};
	}

	const albumData = event
		.fetch(`/api/pakubiiti/getAlbums/${count}`)
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

			playerState.setAlbums(user, data.albums);

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
			const name = data.get(`names_${i}`) as string;
			const image = data.get(`images_${i}`) as string;
			const artists = data.get(`artists_${i}`) as string;

			state.push({ name: name, image: image, artists: artists });
		}

		const solved = playerState.score(user, state);

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
