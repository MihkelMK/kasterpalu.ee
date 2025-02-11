<script lang="ts">
	import { formSchema, type FormSchema } from './answer-schema';
	import type { Question } from '$lib/types';

	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';

	let {
		data
	}: {
		data: { answer_form: SuperValidated<Infer<FormSchema>>; question: Question; poolSize: number };
	} = $props();

	const form = superForm(data.answer_form, {
		validators: zodClient(formSchema),
		invalidateAll: 'force',
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance, constraints } = form;
</script>

<Card.Root>
	<Card.Header>
		{#if !data.question}
			<Card.Title>Kõik vastatud</Card.Title>
			<Card.Description>Rahval said kõik küsimused otsa!</Card.Description>
		{:else}
			<Card.Title>Vasta vajajale</Card.Title>
			<Card.Description>Tänutäheks saad vastu ühe küsimuse küsida.</Card.Description>
		{/if}
	</Card.Header>
	{#if !data.question}
		<Card.Content>
			{#if data.poolSize === 0}
				<p class="text-sm leading-6">Sellise erandjuhuga saad ühe korra niisama küsida!</p>
			{:else}
				<p class="text-sm leading-6">Äkki tahaksid su sõbrad vastata või on neil küsimusi?</p>
			{/if}
		</Card.Content>
	{:else}
		<form method="POST" use:enhance action="?/answer">
			<Card.Content>
				<Form.Field {form} name="answer">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{data.question.content}?</Form.Label>
							<Textarea {...props} bind:value={$formData.answer} class="resize-none" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="questionId">
					<Form.Control>
						{#snippet children({ props })}
							<Input type="hidden" {...props} bind:value={$formData.questionId} />
						{/snippet}
					</Form.Control>
					<Form.Description class="text-right">
						{$formData.answer.length}/{$constraints.answer?.maxlength}
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer class="justify-center">
				<Form.Button>Vasta</Form.Button>
			</Card.Footer>
		</form>
	{/if}
</Card.Root>
