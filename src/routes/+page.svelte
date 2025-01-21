<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import DndGroup from '$lib/components/DNDGroup.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: FormData } = $props();

	let loading = $state(true);

	let names: string[] | undefined = $state();
	let artists: string[] | undefined = $state();
	let images: string[] | undefined = $state();

	$effect(() => {
		loading = false;
		console.log(form);
	});

	$inspect(data);
</script>

<AlertDialog.Root open={form?.solved === false}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{#if data?.highscore && data?.stage && data.highscore === data.stage}
					New high score!
				{:else}
					Maybe next time
				{/if}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{#if data.stage === 0}
					That's tough. <strong>0 right answers.</strong>
				{:else}
					You got it right <strong>{data.stage} times.</strong>
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form action="?/restart" method="POST" use:enhance>
				<AlertDialog.Action type="submit">Try again</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<form
	action="?/submit"
	method="POST"
	use:enhance
	class="mx-auto grid w-full max-w-3xl gap-8 px-8 transition-all {loading || data?.playing === false
		? 'grayscale'
		: ''}"
	onsubmit={() => {
		loading = true;
	}}
>
	{#await data.streamed.albums}
		{#each { length: 2 } as _}
			<section class="grid grid-cols-3 items-center gap-16">
				{#each { length: 3 } as _}
					<Skeleton class="h-[6rem] w-full rounded-xl " />
				{/each}
			</section>
		{/each}

		<section class="grid grid-cols-3 items-center gap-16">
			{#each { length: 3 } as _}
				<Skeleton class="aspect-square h-auto max-w-full rounded-xl object-cover" />
			{/each}
		</section>
	{:then albums}
		{#if albums.names && albums.artists && albums.images}
			<DndGroup items={albums.names} type="names"></DndGroup>
			<DndGroup items={albums.artists} type="artists"></DndGroup>
			<DndGroup items={albums.images} image type="images"></DndGroup>
		{:else}
			<DndGroup items={names} type="names"></DndGroup>
			<DndGroup items={artists} type="artists"></DndGroup>
			<DndGroup items={images} image type="images"></DndGroup>
		{/if}
	{/await}

	<div class="flex justify-evenly">
		<p>Stage: {data.stage}</p>
		<Button type="submit" variant="outline">Submit</Button>
		<p>High Score: {data.highscore}</p>
	</div>
</form>
