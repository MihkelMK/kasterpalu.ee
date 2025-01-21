import type { Player } from '$lib/types';
import { getContext, setContext } from 'svelte';

export class PlayerState {
	players = $state<Player[]>([]);

	newPlayer(id: string) {
		this.players.push({ id: id, stage: 0, highscore: 0, playing: true });
	}

	getStage(id: string) {
		const player = this.players.find((player) => player.id === id);

		if (!player) {
			return undefined;
		}

		return player.stage;
	}

	nextStage(id: string) {
		const player = this.players.find((player) => player.id === id);

		if (!player) {
			return;
		}

		player.stage += 1;
	}

	restart(id: string) {
		const player = this.players.find((player) => player.id === id);

		if (!player) {
			return;
		}

		player.stage = 0;
		player.playing = true;
	}

	score(id: string, won: boolean) {
		const player = this.players.find((player) => player.id === id);

		if (!player) {
			return;
		}

		if (won) {
			player.stage += 1;
			return;
		}

		player.playing = false;

		if (player.stage > player.highscore) {
			player.highscore = player.stage;
		}
	}

	getHighscore(id: string) {
		const player = this.players.find((player) => player.id === id);

		if (!player) {
			return undefined;
		}

		return player.highscore;
	}

	getPlaying(id: string) {
		const player = this.players.find((player) => player.id === id);

		if (!player) {
			return undefined;
		}

		return player.playing;
	}

	setPlaying(id: string, playing: boolean) {
		const player = this.players.find((player) => player.id === id);

		if (!player) {
			return;
		}

		player.playing = playing;
	}
}

export const playerState = new PlayerState();
