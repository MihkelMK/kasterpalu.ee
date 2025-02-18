import { z } from 'zod';

export const formSchema = z.object({
	question: z
		.string()
		.min(2, 'Küsimus peab olema vähemalt 2 tähemärki.')
		.max(75, 'Küsimus ei või olla pikem kui 75 tähemärki.'),
	altcha: z.string()
});

export type FormSchema = typeof formSchema;
