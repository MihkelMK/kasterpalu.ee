import { m } from '$lib/paraglide/messages';
import { z } from 'zod';

export function formSchema() {
  const field = m.answer_noun();
  return z.object({
    questionId: z.string().length(21),
    answer: z
      .string()
      .min(2, m.error_form_min({ field, count: 2 }))
      .max(200, m.error_form_max({ field, count: 200 })),
    altcha: z.string(),
  });
}

export type FormSchema = ReturnType<typeof formSchema>;
