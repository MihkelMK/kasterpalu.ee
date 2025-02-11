import type { AlbumSolveState, Player } from '$lib/types';

export class PlayerState {
	players = $state<Player[]>([]);
	private lastAccessed: Map<string, number> = new Map();

	constructor() {
		// Clean up expired sessions every hour
		setInterval(() => this.cleanup(), 1000 * 60 * 60);
	}

	private updateLastAccessed(id: string) {
		this.lastAccessed.set(id, Date.now());
	}

	private findPlayer(id: string): Player | undefined {
		this.updateLastAccessed(id);
		return this.players.find((player) => player.id === id);
	}

	private checkSolution(solution: AlbumSolveState[], submission: AlbumSolveState[]) {
		if (!solution || !submission) {
			return false;
		}

		for (const solve of solution) {
			const search = submission.filter((album) => album.name === solve.name);

			if (!search) {
				return false;
			}

			const matching = search.at(0);

			if (!matching) {
				return false;
			}

			if (matching.image !== solve.image) {
				return false;
			}

			if (matching.artists !== solve.artists) {
				return false;
			}
		}

		return true;
	}

	newPlayer(id: string) {
		this.updateLastAccessed(id);
		this.players.push({ id: id, stage: 0, highscore: 0, playing: true, albums: [] });
	}

	nextStage(id: string) {
		const player = this.findPlayer(id);
		if (player) {
			player.stage += 1;
		}
	}

	restart(id: string) {
		const player = this.findPlayer(id);
		if (player) {
			player.stage = 0;
			player.playing = true;
		}
	}

	score(id: string, submission: AlbumSolveState[]) {
		if (!submission) return false;

		const player = this.findPlayer(id);
		if (!player) return false;

		if (this.checkSolution(player.albums, submission)) {
			player.stage += 1;
			return true;
		}

		player.playing = false;
		if (player.stage > player.highscore) {
			player.highscore = player.stage;
		}

		return true;
	}

	getHighscore(id: string) {
		const player = this.findPlayer(id);
		return player?.highscore;
	}

	getStage(id: string) {
		const player = this.findPlayer(id);
		return player?.stage;
	}

	getPlaying(id: string) {
		const player = this.findPlayer(id);
		return player?.playing;
	}

	setPlaying(id: string, playing: boolean) {
		const player = this.findPlayer(id);
		if (player) {
			player.playing = playing;
		}
	}

	getAlbums(id: string) {
		const player = this.findPlayer(id);
		return player?.albums;
	}

	setAlbums(id: string, albums: AlbumSolveState[]) {
		const player = this.findPlayer(id);
		if (player) {
			player.albums = albums;
		}
	}

	// Clean up players that haven't been accessed in 24 hours
	private cleanup(): void {
		const now = Date.now();
		const expiryTime = 24 * 60 * 60 * 1000; // 24 hours

		this.players = this.players.filter((player) => {
			const lastAccess = this.lastAccessed.get(player.id);
			if (!lastAccess || now - lastAccess > expiryTime) {
				this.lastAccessed.delete(player.id);
				return false;
			}
			return true;
		});
	}
}

export const playerState = new PlayerState();
