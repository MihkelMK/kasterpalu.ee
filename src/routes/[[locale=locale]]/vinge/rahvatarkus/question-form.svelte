<script lang="ts">
  import type { Question } from '$lib/types';
  import { formSchema, type FormSchema } from './question-schema';

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

  let {
    data,
  }: {
    data: {
      question_form: SuperValidated<Infer<FormSchema>>;
      question: Question | undefined;
      poolSize: number;
      user: {
        id: string;
        balance: number;
      };
    };
  } = $props();

  const toastSuccess = $derived(m['rahvatarkus.question_toast_success']());
  const toastError = $derived(m.error_form_submit());

  const form = superForm(
    untrack(() => data.question_form),
    {
      validators: zod4Client(formSchema()),
      invalidateAll: false,
      onUpdated: async ({ form: f }) => {
        if (f.valid) {
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
    <Card.Title>{m['rahvatarkus.ask.title']()}</Card.Title>
    <Card.Description>
      {m['rahvatarkus.ask.description']({
        count: data.user.balance > 0 ? data.user.balance : data.poolSize > 0 ? 0 : 1,
      })}
    </Card.Description>
  </Card.Header>
  {#if data.user.balance === 0 && (data.question || data.poolSize > 0)}
    <Card.Content>
      <p class="text-sm leading-6">{m['rahvatarkus.no_balance']()}</p>
    </Card.Content>
  {:else}
    <form method="POST" use:enhance action="?/question">
      <Card.Content>
        <Form.Field {form} name="question">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label class="transition-colors">{m['rahvatarkus.ask.label']()}</Form.Label>
              <Input {...props} bind:value={$formData.question} class="transition-colors" />
            {/snippet}
          </Form.Control>
          <Form.Description class="flex justify-between">
            <Form.FieldErrors />
            <p>{$formData.question.length}/{$constraints.question?.maxlength}</p>
          </Form.Description>
        </Form.Field>
        <Form.Field {form} name="altcha" class="mx-auto mb-4 w-(--altcha-max-width)">
          <Form.Control>
            {#snippet children({ props })}
              <Altcha {...props} bind:value={$formData.altcha} />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </Card.Content>
      <Card.Footer class="justify-center">
        <Form.Button>{m.ask_verb()}</Form.Button>
      </Card.Footer>
    </form>
  {/if}
</Card.Root>
