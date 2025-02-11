import { z } from 'zod';

export const formSchema = z.object({
  questionId: z.string().length(21),
  answer: z.string().min(2).max(250)
});

export type FormSchema = typeof formSchema;
