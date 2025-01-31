<script lang="ts">
	import { mode } from 'mode-watcher';

	import { Badge, type BadgeVariant } from '$lib/components/ui/badge/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';

	import Instagram from 'lucide-svelte/icons/instagram';
	import Facebook from 'lucide-svelte/icons/facebook';
	import Globe from 'lucide-svelte/icons/globe';
	import Link from 'lucide-svelte/icons/link';

	import type { EnhancedImage, ImageCreditType, Tag } from '$lib/types';

	let {
		image,
		tags = [],
		class: className
	}: { image: EnhancedImage; tags: Tag[]; class: string } = $props();

	let badgeVariant: BadgeVariant = $derived($mode == 'dark' ? 'secondary' : 'default');
</script>

{#snippet creditText(author: string, type: ImageCreditType, className: string)}
	{#if type === 'instagram'}
		<Instagram class={className} />
	{:else if type === 'facebook'}
		<Facebook class={className} />
	{:else if type === 'web'}
		<Globe class={className} />
	{:else}
		<Link class={className} />
	{/if}

	<span>
		{author}
	</span>
{/snippet}

<div
	class="projectCardImage grid justify-items-center overflow-hidden rounded-md bg-primary shadow-lg"
>
	{#if typeof image.src === 'string'}
		<img src={image.src} alt={image.alt} class={className} />
	{:else}
		<enhanced:img src={image.src} alt={image.alt} class={className} />
	{/if}
	{#if tags}
		<div class="space-x-4 self-start p-4">
			{#each tags as { name, description }}
				<HoverCard.Root>
					<HoverCard.Trigger>
						<Badge class="transition-none" variant={badgeVariant}>{name}</Badge>
					</HoverCard.Trigger>
					<HoverCard.Content>
						{description}
					</HoverCard.Content>
				</HoverCard.Root>
			{/each}
		</div>
	{/if}

	{#if image.credit}
		<div class="w-full self-end bg-black/50 text-center shadow-lg backdrop-blur-md">
			<p
				class="flex items-center justify-center px-4 py-2 font-mono text-xs font-semibold text-secondary/80 dark:text-primary/80"
			>
				{#if image.credit.href}
					<a class="w-full transition-colors hover:text-white" href={image.credit.href}>
						{@render creditText(
							image.credit.author,
							image.credit.type,
							'w-4 inline align-[-0.65em]'
						)}
					</a>
				{:else}
					{@render creditText(image.credit.author, image.credit.type, 'w-4 inline align-[-0.65em]')}
				{/if}
			</p>
		</div>
	{/if}
</div>

<style>
	.projectCardImage > * {
		grid-area: 1/1/2/2;
	}
</style>
