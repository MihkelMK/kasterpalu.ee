export type AlbumData = {
	names: AlbumDataField[];
	artists: AlbumDataField[];
	images: AlbumDataField[];
};

export type AlbumDataField = {
	id: string;
	value: string;
};

export type AlbumSolveState = {
	name: string;
	artists: string;
	image: string;
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
