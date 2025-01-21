<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import DndGroup from '$lib/components/DNDGroup.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: FormData } = $props();

	let loading = $state(true);
	let oldAlbums: SpotifyApi.AlbumObjectSimplified[] = $state([]);

	$effect(() => {
		// this is a hack to disable grayscale, please ignore
		// eslint-disable-next-line no-constant-binary-expression
		loading = false && form?.success;
	});

	// Used when user answers wrong and no new data comes in
	$effect(() => {
		if (data.streamed?.albums) {
			data.streamed.albums.then((data) => {
				oldAlbums = data;
			});
		}
	});
</script>

{#snippet footer(loading: boolean)}
	<div class="mt-8 flex items-center justify-evenly">
		<p class="font-title text-lg font-semibold">Skoor: {data.stage}</p>
		{#if loading}
			<Button disabled class="min-w-[4.5rem]">
				<LoaderCircle class="animate-spin" />
				Oota
			</Button>
		{:else}
			<Button type="submit" class="min-w-[4.5rem]">Saada</Button>
		{/if}
		<p class="font-title text-lg font-semibold">Parim: {data.highscore}</p>
	</div>
{/snippet}

<AlertDialog.Root open={form?.solved === false}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{#if data?.highscore && data?.stage && data.highscore === data.stage}
					Uus parim tulemus!
				{:else}
					Seekord ei vedanud
				{/if}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{#if data.stage === 0}
					Põrusid esimesel katsel.
				{:else}
					Vastasid õigesti <strong>{data.stage} korda.</strong>
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<form action="?/restart" method="POST" use:enhance>
				<AlertDialog.Action type="submit">Uuesti</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<form
	action="?/submit"
	method="POST"
	use:enhance
	class="grid w-full gap-6 transition-all {loading || data?.playing === false ? 'grayscale' : ''}"
>
	{#if data?.streamed?.albums}
		{#await data.streamed.albums}
			{#each { length: 2 } as _}
				<section class="grid grid-cols-3 items-center gap-14">
					{#each { length: 3 } as _}
						<Skeleton class="h-[5.25rem] w-full rounded-xl " />
					{/each}
				</section>
				<Separator />
			{/each}

			<section class="grid grid-cols-3 items-center gap-14">
				{#each { length: 3 } as _}
					<Skeleton class="aspect-square h-auto max-w-full rounded-xl object-cover" />
				{/each}
			</section>

			{@render footer(true)}
		{:then albums}
			<DndGroup items={albums.names} type="names"></DndGroup>
			<Separator />
			<DndGroup items={albums.artists} type="artists"></DndGroup>
			<Separator />
			<DndGroup items={albums.images} image type="images"></DndGroup>

			{@render footer(false)}
		{/await}
	{:else}
		<DndGroup items={oldAlbums.names} type="names"></DndGroup>
		<Separator />
		<DndGroup items={oldAlbums.artists} type="artists"></DndGroup>
		<Separator />
		<DndGroup items={oldAlbums.images} image type="images"></DndGroup>

		{@render footer(false)}
	{/if}
</form>
