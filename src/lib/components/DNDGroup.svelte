<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { expoOut } from 'svelte/easing';
	import { truncate } from '$lib/utils';

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
	use:dndzone={{
		items,
		flipDurationMs,
		type: type,
		dropTargetStyle: { outline: 'none' }
	}}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
	class="grid grid-cols-3 items-center gap-16"
>
	{#each items as item, i (item.id)}
		<div animate:flip={{ duration: flipDurationMs, easing: expoOut }}>
			<Card.Root
				class="overflow-hidden rounded-xl border bg-card text-card-foreground shadow {type ===
				'names'
					? 'border-orange-300'
					: type === 'artists'
						? 'border-cyan-300'
						: ''}"
			>
				{#if image}
					<Card.Content class="p-0">
						<img class="aspect-square w-full object-cover" alt="Album Art" src={item.value} />
						<input type="hidden" name="{type}_{i}" value={item.value} />
					</Card.Content>
				{:else}
					<Card.Content>
						<p class="text-center">
							{#if type === 'artists'}
								{truncate(item.value, 30)}
							{:else}
								{truncate(item.value, 45)}
							{/if}
						</p>
						<input type="hidden" name="{type}_{i}" value={item.value} />
					</Card.Content>
				{/if}
			</Card.Root>
		</div>
	{/each}
</section>
