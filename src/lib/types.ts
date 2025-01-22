export type AlbumSolveState = {
  name: string;
  artists: string[];
  imageUrl: string;
};

export type Player = {
  id: string;
  stage: number;
  highscore: number;
  playing: boolean;
};

export type Game = {
  name: string;
  image: string;
  description: string;
};

export type GamesObj = Record<string, Game>;
