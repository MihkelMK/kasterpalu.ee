import { m } from '$lib/paraglide/messages';
import { z } from 'zod';

export function formSchema() {
  const field = m.question_noun();
  return z.object({
    question: z
      .string()
      .min(2, m.form_atleast_n_char({ field, count: 2 }))
      .max(75, m.form_atmost_n_char({ field, count: 75 })),
    altcha: z.string(),
  });
}

export type FormSchema = ReturnType<typeof formSchema>;
