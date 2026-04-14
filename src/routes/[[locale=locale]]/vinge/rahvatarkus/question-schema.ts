import { m } from '$lib/paraglide/messages';
import { z } from 'zod';

export function formSchema() {
  const field = m.ask_noun();
  return z.object({
    question: z
      .string()
      .min(2, m.error_form_min({ field, count: 2 }))
      .max(75, m.error_form_max({ field, count: 75 })),
    altcha: z.string(),
  });
}

export type FormSchema = ReturnType<typeof formSchema>;
