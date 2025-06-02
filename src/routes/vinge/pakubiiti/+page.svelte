<script lang="ts">
	import type { PageData } from './$types';
	import type { AlbumData } from '$lib/types';

	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { expoIn, expoOut } from 'svelte/easing';

	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	import DndGroup from '$lib/components/DNDGroup.svelte';
	import { getAlbumClientState } from '$lib/client/pakubiiti/AlbumClientState.svelte';

	let { data }: { data: PageData; form: FormData } = $props();

	let loading = $state(false);

	const clientState = getAlbumClientState();
</script>

{#snippet footer(loading: boolean)}
	<footer class="mt-8 flex items-center justify-evenly">
		<p class="font-title text-lg font-semibold">Skoor: {data.stage}</p>
		{#if loading}
			<Button disabled class="min-w-[4.4rem]">
				<LoaderCircle class="animate-spin" />
			</Button>
		{:else}
			<Button type="submit" class="min-w-[4.4rem]">Saada</Button>
		{/if}
		<p class="font-title text-lg font-semibold">Parim: {data.highscore}</p>
	</footer>
{/snippet}

{#snippet playArea(albums: AlbumData | undefined, placeholder = false)}
	{#if placeholder}
		{#each { length: 3 } as _, i}
			<section
				class="grid grid-cols-3 gap-2 rounded-xl p-2 px-3 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-14"
			>
				{#each { length: 3 }}
					{#if i < 2}
						<Skeleton class="border-primary/5 h-20 w-full rounded-xl border" />
					{:else}
						<Skeleton class="aspect-square h-auto max-w-full rounded-xl object-cover" />
					{/if}
				{/each}
			</section>
			{#if i < 2}
				<Separator />
			{/if}
		{/each}
	{:else if albums}
		<DndGroup items={albums.names} type="names"></DndGroup>
		<Separator />
		<DndGroup items={albums.artists} type="artists"></DndGroup>
		<Separator />
		<DndGroup items={albums.images} image type="images"></DndGroup>
	{/if}
{/snippet}

<AlertDialog.Root open={data.playing === false || data.error}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{#if data.error}
					{data.error.title}
				{:else if data?.highscore && data?.stage && data.highscore === data.stage}
					Uus parim tulemus!
				{:else}
					Seekord ei vedanud
				{/if}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{#if data.error}
					{data.error.message}
				{:else if data.stage === 0}
					Põrusid esimesel katsel.
				{:else}
					Vastasid õigesti <strong>{data.stage} korda.</strong>
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		{#if !data.error}
			<AlertDialog.Footer>
				<form action="?/restart" method="POST" use:enhance>
					<AlertDialog.Action type="submit">Uuesti</AlertDialog.Action>
				</form>
			</AlertDialog.Footer>
		{/if}
	</AlertDialog.Content>
</AlertDialog.Root>

<header class="mb-16 flex flex-col items-center text-center font-title">
	<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">Paku biiti</h1>
	<p class="text-xl font-semibold leading-7 text-muted-foreground">
		Lohista kokku õiged albumi <span class="text-red-600 dark:text-red-400">nimed</span>,
		<span class="text-purple-600 dark:text-purple-400">artistid</span> ja
		<span class="text-blue-600 dark:text-blue-400">pildid</span>.
	</p>
</header>
<main class="w-full max-w-4xl">
	<form
		action="?/submit"
		method="POST"
		use:enhance
		class="grid w-full transition-all {loading || data?.playing === false ? 'grayscale' : ''}"
	>
		{#if data?.streamed?.albums}
			{#await data.streamed.albums}
				<div
					class="grid w-full gap-4"
					in:fade={{ duration: 150, easing: expoIn }}
					out:fade={{ duration: 150, easing: expoOut }}
				>
					{@render playArea(undefined, true)}
				</div>
				{@render footer(true)}
			{:then albums}
				{#if albums}
					<div class="grid w-full gap-4" in:fade={{ duration: 150, delay: 150, easing: expoOut }}>
						{@render playArea(albums as AlbumData)}
					</div>
					{@render footer(false)}
				{:else}
					<p class="mx-auto mt-16 max-w-prose text-center text-lg text-red-500">
						<strong>Serveris tekkis mingi error.</strong>
						<br />No clue miks see katki on, sorry.
					</p>
					<p class="mx-auto mt-6 max-w-prose text-center text-lg text-red-500">
						Proovi uuesti või kirjuta mulle.
					</p>
				{/if}
			{/await}
		{:else}
			<div class="grid w-full gap-4" out:fade={{ duration: 150, easing: expoOut }}>
				{@render playArea(clientState.albums)}
			</div>
			{@render footer(false)}
		{/if}
	</form>
</main>

<style>
	form > div {
		grid-area: 1/1;
	}
	form > footer {
		grid-area: 2/1;
	}
</style>
