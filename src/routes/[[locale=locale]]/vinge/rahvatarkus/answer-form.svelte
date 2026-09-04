<script lang="ts">
  import type { Question } from '$lib/types';
  import { formSchema, type FormSchema } from './answer-schema';

  import { invalidateAll } from '$app/navigation';
  import { m } from '$lib/paraglide/messages';
  import { untrack } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

  import Altcha from '$lib/components/Altcha.svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';

  let {
    answerForm,
    question,
    poolSize,
  }: {
    answerForm: SuperValidated<Infer<FormSchema>>;
    question: Pick<Question, 'id' | 'content' | 'answerCount'> | undefined;
    poolSize: number;
  } = $props();

  const toastSuccess = $derived(m['rahvatarkus.answer_toast_success']());
  const toastError = $derived(m.error_form_submit());

  const form = superForm(
    untrack(() => answerForm),
    {
      validators: zod4Client(formSchema()),
      invalidateAll: false,
      onUpdated: async ({ form: f }) => {
        if (f.valid) {
          $formData.altcha = '';
          toast.success(toastSuccess);
          await invalidateAll();
        } else {
          toast.error(toastError);
        }
      },
    }
  );

  const { form: formData, enhance, constraints } = form;
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>{m['rahvatarkus.answer.title']({ question: question ? 'true' : 'false' })}</Card.Title>
    <Card.Description>
      {m['rahvatarkus.answer.description']({ question: question ? 'true' : 'false' })}
    </Card.Description>
  </Card.Header>
  {#if !question}
    <Card.Content>
      {#if poolSize === 0}
        <p class="text-sm leading-6">{m['rahvatarkus.question_pool_empty']()}</p>
      {:else}
        <p class="text-sm leading-6">{m['rahvatarkus.error_no_questions']()}</p>
      {/if}
    </Card.Content>
  {:else}
    <form method="POST" use:enhance action="?/answer">
      <Card.Content>
        <Form.Field {form} name="answer">
          <Form.Control>
            {#snippet children({ props })}
              {#if question}
                <Form.Label class="transition-colors">{question.content}?</Form.Label>
              {/if}
              <Textarea {...props} bind:value={$formData.answer} class="resize-none transition-colors" />
            {/snippet}
          </Form.Control>
          <div class="flex justify-between">
            <Form.FieldErrors />
            <Form.Description>
              {$formData.answer.length}/{$constraints.answer?.maxlength}
            </Form.Description>
          </div>
        </Form.Field>
        <Form.Field {form} name="questionId">
          <Form.Control>
            {#snippet children({ props })}
              <Input type="hidden" {...props} bind:value={$formData.questionId} />
            {/snippet}
          </Form.Control>
        </Form.Field>
        <Form.Field {form} name="altcha" class="mx-auto mb-4 w-(--altcha-max-width)">
          <Form.Control>
            {#snippet children({ props })}
              <Altcha {...props} bind:value={$formData.altcha} />
            {/snippet}
          </Form.Control>
        </Form.Field>
      </Card.Content>
      <Card.Footer class="justify-center">
        <Form.Button>{m.answer_verb()}</Form.Button>
      </Card.Footer>
    </form>
  {/if}
</Card.Root>
