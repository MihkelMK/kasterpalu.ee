<script lang="ts">
	import type { EnhancedImage, Tag } from '$lib/types';

	import { Button } from '$lib/components/ui/button/index.js';
	import SquareArrowOutUpRight from '@lucide/svelte/icons/square-arrow-out-up-right';

	import Image from '$lib/components/Image.svelte';

	import { site, baseURL } from '$lib/config';
	import projects from '$lib/data/projects';
</script>

{#snippet projectCard(
	name: string,
	description: string,
	image: EnhancedImage,
	tags: Tag[],
	link: string
)}
	<div class="mb-10 w-72 space-y-3 md:w-60">
		<Image
			{image}
			{tags}
			eager
			class="aspect-4/5 object-cover"
			sizes="(min-width:1920px) 300px, (min-width:768px) 400px"
		/>
		<div class="grid grid-cols-[1fr_auto] items-center text-sm">
			<div class="mt-1 pr-4">
				<h3 class="text-lg leading-none font-medium">{name}</h3>
				<p class="text-muted-foreground mt-1.5 text-sm leading-5">{description}</p>
			</div>
			<Button target="_blank" href={link} variant="secondary" size="icon">
				<SquareArrowOutUpRight />
			</Button>
		</div>
	</div>
{/snippet}

<svelte:head>
	<title>{site.name}</title>
	<meta property="og:title" content={site.name} />

	<meta name="description" content={site.description} />
	<meta property="og:description" content={site.description} />

	<meta property="og:image" content={baseURL + site.image} />
</svelte:head>

<header class="font-title mb-16 flex flex-col items-center text-center">
	<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
		Hei! Mina olen Mihkel
	</h1>
	<p class="text-muted-foreground text-xl leading-7 font-semibold">
		Peale selle toreda saidi on mul veel palju hobisid
	</p>
</header>

<main class="flex w-full flex-wrap justify-center gap-x-8">
	{#each projects as { name, description, image, tags, link } (name)}
		{@render projectCard(name, description, image, tags, link)}
	{/each}
</main>
