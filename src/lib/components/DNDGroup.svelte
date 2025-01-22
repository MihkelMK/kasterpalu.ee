<script lang="ts">
	import { flip } from 'svelte/animate';
	import { expoOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { truncate } from '$lib/utils';
	import type { AlbumDataField } from '$lib/types';
	import {
		dndzone,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
		type DndEvent,
		type Item
	} from 'svelte-dnd-action';
	import * as Card from '$lib/components/ui/card/index.js';

	let { items = $bindable(), image = false, type = 'default' } = $props();

	const flipDurationMs = 300;

	function handleDndConsider(e: CustomEvent<DndEvent<Item>>) {
		items = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Item>>) {
		items = e.detail.items;
	}
	function transformDraggedElement(draggedEl: HTMLElement | undefined) {
		if (!draggedEl) {
			return;
		}
		const card = draggedEl.querySelector('.bg-card') as HTMLElement;

		if (!card) {
			return;
		}

		card.classList.add('shadow-foreground/25');
	}

	let cardClass = $derived(
		`hover select-none overflow-hidden rounded-xl border bg-card text-card-foreground shadow shadow-foreground/15  ${
			type === 'names'
				? 'border-red-400 '
				: type === 'artists'
					? 'border-purple-400 '
					: 'border-blue-400'
		}`
	);
</script>

{#snippet card(item: AlbumDataField, i: number)}
	{#if image}
		<img class="aspect-square w-full object-cover" alt="Album Art" src={item.value} />
		<input type="hidden" name="{type}_{i}" value={item.value} />
	{:else}
		<p
			class="p-6 text-center {type === 'names'
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
	{/if}
{/snippet}

<section
	use:dndzone={{
		items,
		flipDurationMs,
		type: type,
		dropTargetStyle: {},
		dropTargetClasses: ['bg-muted/50', 'dark:bg-muted/25', 'ring-2', 'ring-muted'],
		transformDraggedElement: transformDraggedElement
	}}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
	class="grid grid-cols-3 items-center gap-2 rounded-xl p-3 transition-colors sm:gap-6 md:gap-8 lg:gap-12 xl:gap-14"
>
	{#each items as item, i (item.id)}
		<div animate:flip={{ duration: flipDurationMs, easing: expoOut }} class="relative">
			{#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
				<div
					in:fade={{ duration: 200, easing: expoOut }}
					class="{cardClass} visible border-transparent bg-transparent opacity-50 shadow-transparent"
				>
					{@render card(item, i)}
				</div>
			{:else}
				<Card.Root class={cardClass}>
					<Card.Content class="p-0">
						{@render card(item, i)}
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
	{/each}
</section>
