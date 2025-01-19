<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	let { items = $bindable(), image = false, type = 'default' } = $props();

	const flipDurationMs = 300;

	function handleDndConsider(e: CustomEvent<any>) {
		items = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<any>) {
		items = e.detail.items;
	}
</script>

<section
	use:dndzone={{ items, flipDurationMs, type: type }}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
	class="grid grid-cols-3"
>
	{#if image}
		{#each items as item, i (item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<img class="object-cover" alt="Album Art" src={item.value} />
				<input type="hidden" name="{type}_{i}" value={item.value} />
			</div>
		{/each}
	{:else}
		{#each items as item, i (item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<p class="text-center">{item.value}</p>

				<input type="hidden" name="{type}_{i}" value={item.value} />
			</div>
		{/each}
	{/if}
</section>
