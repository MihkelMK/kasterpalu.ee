import { z } from 'zod';

export const formSchema = z.object({
	questionId: z.string().length(21),
	answer: z
		.string()
		.min(2, 'Vastus peab olema vähemalt 2 tähemärki.')
		.max(200, 'Vastus ei või olla pikem kui 200 tähemärki.'),
	altcha: z.string()
});

export type FormSchema = typeof formSchema;
