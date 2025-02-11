<script lang="ts">
	import { formSchema, type FormSchema } from './question-schema';

	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { data }: { data: { question_form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.question_form, {
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

<form method="POST" class="w-2/3 space-y-6" use:enhance action="?/question">
	<Form.Field {form} name="question">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Uus küsimus</Form.Label>
				<Input {...props} bind:value={$formData.question} />
			{/snippet}
		</Form.Control>
		<Form.Description>Küsi ükskõik mida sellelt kollektiiv intelektilt.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Küsi</Form.Button>
</form>
