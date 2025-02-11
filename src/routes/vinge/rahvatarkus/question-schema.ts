import { z } from 'zod';

export const formSchema = z.object({
  question: z
    .string()
    .min(2, 'Küsimus peab olema vähemalt 2 tähemärki.')
    .max(50, 'Küsimus ei või olla pikem kui 50 tähemärki.')
});

export type FormSchema = typeof formSchema;
