<script lang="ts">
	import { site, baseURL } from '$lib/config';
	import games from '$lib/data/games';
	import { m } from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta property="og:title" content={site.name} />

	<meta name="description" content={site.description} />
	<meta property="og:description" content={site.description} />

	<meta property="og:image" content={baseURL + site.image} />
</svelte:head>

<header class="font-title flex flex-col items-center text-center">
	<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
		{m['vinge.title']()}
	</h1>
	<p class="text-muted-foreground text-xl leading-7 font-semibold">
		{m['vinge.subtitle']()}
	</p>
	<p class="text-muted-foreground text-xl leading-7 font-semibold">
		{m['vinge.credit.prefix']()}
		<a href="https://neal.fun" class="font-bold underline underline-offset-4">neal.fun</a>
		{m['vinge.credit.suffix']()}
	</p>
</header>

<div
	class="mx-auto mt-20 flex w-full flex-wrap items-center justify-center justify-items-center gap-4 gap-x-8 gap-y-8 lg:grid-cols-2">
	{#each Object.entries(games) as [href, { image, name }] (name)}
		<a
			class="shadow-sharp flex aspect-4/1 h-16 max-w-sm items-center justify-center rounded-xl border-2 border-current bg-contain bg-no-repeat transition-all md:h-20"
			style="background-image: url('{image}')"
			draggable="false"
			href={localizeHref(`/vinge/${href}`)}>
			<span class="relative block rounded font-mono text-lg font-semibold select-none lg:text-xl">
				{name()}
			</span>
		</a>
	{/each}
</div>
