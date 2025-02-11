<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	import QuestionForm from './question-form.svelte';
	import AnswerForm from './answer-form.svelte';

	let { data, children } = $props();

	$inspect(data);

	let firstTab = $derived(data?.question ? 'answer' : 'question');
</script>

<Tabs.Root value={firstTab} class="flex w-full max-w-md flex-col items-center gap-2">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="answer">Vasta</Tabs.Trigger>
		<Tabs.Trigger value="question">Küsi</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="answer" class="w-full">
		<AnswerForm {data} />
	</Tabs.Content>
	<Tabs.Content value="question" class="w-full">
		<QuestionForm {data} />
	</Tabs.Content>
</Tabs.Root>

{@render children()}
