<script lang="ts">
	import QuestionForm from './question-form.svelte';
	import AnswerForm from './answer-form.svelte';

	let { data, children } = $props();

	$inspect(data);
</script>

<QuestionForm {data} />
<AnswerForm {data} />

{@render children()}
