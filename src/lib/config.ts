import type { GamesObj } from './types';

export const site = {
	name: 'Stuff.Kasterpalu',
	author: 'Mihkel Martin Kasterpalu',
	description: 'Minimängud ja muud huvitavat.',
	image: '/web-app-manifest-512x512.png'
};

export const baseURL = 'https://stuff.kasterpalu.ee';

export const games: GamesObj = {
	'/pakubiiti': {
		name: 'Paku biiti',
		image: '',
		description: 'Sorteeri kolme suvalise muusika albumi pealkiri, artistid ja pilt.'
	},
	'': {
		name: 'More soonTM',
		image: '',
		description: ''
	}
};
