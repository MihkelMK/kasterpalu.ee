<script lang="ts">
	import { formSchema, type FormSchema } from './answer-schema';
	import type { Question } from '$lib/types';

	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { data }: { data: { answer_form: SuperValidated<Infer<FormSchema>>; question: Question } } =
		$props();

	const form = superForm(data.answer_form, {
		validators: zodClient(formSchema),
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

{#if data.question}
	<form method="POST" class="w-2/3 space-y-6" use:enhance action="?/answer">
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
		<Form.Button>Vasta</Form.Button>
	</form>
{/if}
