import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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

export function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i >= 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}
