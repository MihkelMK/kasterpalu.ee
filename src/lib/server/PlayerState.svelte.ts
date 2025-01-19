import type { Player } from '$lib/types';
import { getContext, setContext } from 'svelte';

export class PlayerState {
  players = $state<Player[]>([]);

  newPlayer(id: string) {
    this.players.push({ id: id, stage: 0, highscore: 0 });
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

  score(id: string, win: boolean) {
    const player = this.players.find((player) => player.id === id);

    if (!player) {
      return;
    }

    if (win) {
      player.stage += 1;

      if (player.stage > player.highscore) {
        player.highscore = player.stage;
      }
    } else {
      player.stage = 0;
    }
  }

  getHighscore(id: string) {
    const player = this.players.find((player) => player.id === id);

    if (!player) {
      return undefined;
    }

    return player.highscore;
  }
}

export const playerState = new PlayerState();
