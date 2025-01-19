<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import DndGroup from '$lib/components/DNDGroup.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	$inspect(data);
</script>

<form method="POST" use:enhance class="grid gap-8">
	<DndGroup items={data.names} type="names"></DndGroup>
	<DndGroup items={data.artists} type="artists"></DndGroup>
	<DndGroup items={data.images} image type="images"></DndGroup>

	<div class="flex justify-evenly">
		<p>Stage: {data.stage}</p>
		<Button type="submit" variant="outline" onsubmit={() => invalidateAll()}>Submit</Button>
		<p>High Score: {data.highscore}</p>
	</div>
</form>
