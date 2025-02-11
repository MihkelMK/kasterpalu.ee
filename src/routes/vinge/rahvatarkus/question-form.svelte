<script lang="ts">
	import { formSchema, type FormSchema } from './question-schema';
	import type { Question } from '$lib/types';

	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let {
		data
	}: {
		data: {
			question_form: SuperValidated<Infer<FormSchema>>;
			question: Question;
			poolSize: number;
		};
	} = $props();

	const form = superForm(data.question_form, {
		validators: zodClient(formSchema),
		invalidateAll: false,
		resetForm: true,
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
		<Card.Title>Küsi rahvalt</Card.Title>
		<Card.Description>Sul on alles 0 küsimust. Vasta teistele kõigepealt!</Card.Description>
	</Card.Header>
	<form method="POST" use:enhance action="?/question">
		<Card.Content>
			<Form.Field {form} name="question">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Küsimus rahvale</Form.Label>
						<Input {...props} bind:value={$formData.question} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</Card.Content>
		<Card.Footer>
			<Form.Button>Küsi</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>
