import type { Picture } from 'vite-imagetools';

export type EnhancedImage = {
	src: string | Picture;
	alt: string;
	credit?: ImageCredit;
};

export type ImageCredit = {
	author: string;
	type?: ImageCreditType;
	href?: string;
};

export enum ImageCreditType {
	instagram = 'instagram',
	facebook = 'facebook',
	web = 'web'
}

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

export interface TimeRemaining {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export type Game = {
	name: string;
	image: string;
	description: string;
};

// the key is the link href for the game
export type GamesObj = Record<string, Game>;

export type Project = {
	name: string;
	description: string;
	link: string;
	image: EnhancedImage;
	tags: Tag[];
};

export type Tag = {
	name: string;
	description: string;
};

export type TagsObj = Record<string, Tag>;
