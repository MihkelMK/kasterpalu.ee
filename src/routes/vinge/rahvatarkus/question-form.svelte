<script lang="ts">
	import { formSchema, type FormSchema } from './question-schema';
	import type { Question } from '$lib/types';

	import { toast } from 'svelte-sonner';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';

	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Altcha from '$lib/components/Altcha.svelte';

	let {
		data
	}: {
		data: {
			question_form: SuperValidated<Infer<FormSchema>>;
			question: Question;
			poolSize: number;
			user: {
				id: string;
				balance: number;
			};
		};
	} = $props();

	const form = superForm(data.question_form, {
		validators: zodClient(formSchema),
		resetForm: true,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success('Küsimus esitatud.');
			} else {
				toast.error('Küsimine nurjus, palun paranda vead.');
			}
		}
	});

	const { form: formData, enhance, constraints } = form;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Küsi rahvalt</Card.Title>
		<Card.Description
			>Sul on alles {data.user.balance > 0 ? data.user.balance : data.poolSize > 0 ? 0 : 1} küsimust.</Card.Description
		>
	</Card.Header>
	{#if data.user.balance === 0 && (data.question || data.poolSize > 0)}
		<Card.Content>
			<p class="text-sm leading-6">Enne küsimist pead kõigepealt vastama teistele!</p>
		</Card.Content>
	{:else}
		<form method="POST" use:enhance action="?/question">
			<Card.Content>
				<Form.Field {form} name="question">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label class="transition-colors">Küsimus rahvale</Form.Label>
							<Input {...props} bind:value={$formData.question} class="transition-colors" />
						{/snippet}
					</Form.Control>
					<Form.Description class="flex justify-between">
						<Form.FieldErrors />
						<p>{$formData.question.length}/{$constraints.question?.maxlength}</p>
					</Form.Description>
				</Form.Field>
				<Form.Field {form} name="altcha" class="mx-auto  mt-3  w-[var(--altcha-max-width)]">
					<Form.Control>
						{#snippet children({ props })}
							<Altcha {...props} bind:value={$formData.altcha} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</Card.Content>
			<Card.Footer class="justify-center">
				<Form.Button>Küsi</Form.Button>
			</Card.Footer>
		</form>
	{/if}
</Card.Root>
