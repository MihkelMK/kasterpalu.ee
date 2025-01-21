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
		dropTargetStyle: {}
	}}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
	class="grid grid-cols-3 items-center gap-4 sm:gap-8 md:gap-10 lg:gap-14"
>
	{#each items as item, i (item.id)}
		<div animate:flip={{ duration: flipDurationMs, easing: expoOut }}>
			<Card.Root
				class="select-none overflow-hidden rounded-xl border bg-card text-card-foreground shadow shadow-foreground/15 transition-shadow hover:shadow-foreground/25 {type ===
				'names'
					? 'border-red-400 '
					: type === 'artists'
						? 'border-purple-400 '
						: 'border-blue-400'}"
			>
				{#if image}
					<Card.Content class="p-0">
						<img class="aspect-square w-full object-cover" alt="Album Art" src={item.value} />
						<input type="hidden" name="{type}_{i}" value={item.value} />
					</Card.Content>
				{:else}
					<Card.Content>
						<p
							class="text-center {type === 'names'
								? 'text-red-900 dark:text-red-200'
								: type === 'artists'
									? 'text-purple-900 dark:text-purple-200'
									: ''}"
						>
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
