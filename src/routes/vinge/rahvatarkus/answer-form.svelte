<script lang="ts">
	import { formSchema, type FormSchema } from './answer-schema';
	import type { Question } from '$lib/types';

	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

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

	const { form: formData, enhance } = form;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Vasta vajajale</Card.Title>
		<Card.Description>
			{#if !data.question}
				{#if data.poolSize === 0}
					Rahval said kõik küsimused otsa!
				{:else}
					Oled kõigile vastanud, kuid enda küsimustel vastused puudu.
				{/if}
			{:else}
				Tänutäheks saad vastu ühe küsimuse küsida.
			{/if}
		</Card.Description>
	</Card.Header>
	{#if !data.question}
		<Card.Content>
			{#if data.poolSize === 0}
				<p class="text-sm leading-6">Sellise erandjuhuga saad ühe korra niisama küsida!</p>
			{:else}
				<p class="text-sm leading-6">Äkki tahaksid su sõbrad vastata või on meil mingi küsimus?</p>
			{/if}
		</Card.Content>
	{:else}
		<form method="POST" use:enhance action="?/answer">
			<Card.Content>
				<Form.Field {form} name="answer">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>{data.question.content}?</Form.Label>
							<Input {...props} bind:value={$formData.answer} />
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
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer>
				<Form.Button>Vasta</Form.Button>
			</Card.Footer>
		</form>
	{/if}
</Card.Root>
