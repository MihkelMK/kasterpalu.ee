import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// https://perryjanssen.medium.com/getting-random-tracks-using-the-spotify-api-61889b0c0c27
export function getRandomSearch() {
	// A list of all characters that can be chosen.
	const characters = 'abcdefghijklmnopqrstuvwxyz';

	// Gets a random character from the characters string.
	const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
	let randomSearch = '';

	// Places the wildcard character at the beginning, or both beginning and end, randomly.
	switch (Math.round(Math.random())) {
		case 0:
			randomSearch = randomCharacter + '%';
			break;
		case 1:
			randomSearch = '%' + randomCharacter + '%';
			break;
	}

	return randomSearch;
}

// Created using Claude 3.5 Sonett
export function shuffleObjectValues<T extends object>(arr: Array<T>): Array<T> {
	// Create a copy of the array
	const copy = structuredClone(arr);

	// Get all keys from the first object
	const keys = Object.keys(copy[0] as object);

	keys.forEach((key: string) => {
		// Get all values for this key with proper type assertion
		const values = copy.map((obj) => (obj as { [key: string]: unknown })[key]);

		// Fisher-Yates shuffle algorithm
		for (let i = values.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[values[i], values[j]] = [values[j], values[i]];
		}

		// Reassign shuffled values back to objects
		copy.forEach((obj, index) => {
			(obj as { [key: string]: unknown })[key] = values[index];
		});
	});

	return copy;
}

// https://stackoverflow.com/a/12646864
export function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}

// Created using Claude 3.5 Sonett
export function truncate(text: string, maxLength: number): string {
	// Return original text if it's shorter than or equal to maxLength
	if (text.length <= maxLength) {
		return text;
	}

	const ellipsis = '…';
	const tolerance = 5;
	const targetLength = maxLength - 1; // Account for ellipsis

	// Look for spaces within the tolerance range before targetLength
	let spaceBeforeIdx = -1;
	for (let i = targetLength; i >= targetLength - tolerance; i--) {
		if (text[i] === ' ') {
			spaceBeforeIdx = i;
			break;
		}
	}

	// Look for spaces within the tolerance range after targetLength
	let spaceAfterIdx = -1;
	for (let i = targetLength; i <= targetLength + tolerance && i < text.length; i++) {
		if (text[i] === ' ') {
			spaceAfterIdx = i;
			break;
		}
	}

	// Determine the best cutoff point
	let cutoffIndex = targetLength;
	if (spaceBeforeIdx !== -1 && spaceAfterIdx !== -1) {
		// If we found spaces both before and after, use the closest one
		cutoffIndex =
			targetLength - spaceBeforeIdx <= spaceAfterIdx - targetLength
				? spaceBeforeIdx
				: spaceAfterIdx;
	} else if (spaceBeforeIdx !== -1) {
		cutoffIndex = spaceBeforeIdx;
	} else if (spaceAfterIdx !== -1) {
		cutoffIndex = spaceAfterIdx;
	}

	return text.slice(0, cutoffIndex).trim() + ellipsis;
}
