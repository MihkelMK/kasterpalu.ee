<script lang="ts">
  import type { LayoutData } from './$types';
  import type { Snippet } from 'svelte';

  import { onMount } from 'svelte';
  import * as Tabs from '$lib/components/ui/tabs/index.js';

  import AnswerForm from './answer-form.svelte';
  import QuestionForm from './question-form.svelte';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();

  let firstTab = $state('answer');

  onMount(() => {
    firstTab = data?.question ? 'answer' : 'question';
  });
</script>

<Tabs.Root bind:value={firstTab} class="flex w-full max-w-md flex-col items-center gap-1">
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

<header class="mt-24 mb-12 flex flex-col items-center text-center font-title">
  <h1 class="mb-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Mida rahvas teab?</h1>
</header>

{@render children()}
