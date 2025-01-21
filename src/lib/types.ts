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
