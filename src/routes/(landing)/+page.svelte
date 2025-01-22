<script lang="ts">
	import { games, siteName, baseURL } from '$lib/config';
</script>

<svelte:head>
	<title>{siteName}</title>
	<meta property="og:title" content={siteName} />

	<meta name="description" content="Minimängud ja muud huvitavat." />
	<meta property="og:description" content="Minimängud ja muud huvitavat." />

	<meta property="og:image" content={baseURL + '/favicon.svg'} />
</svelte:head>

<header class="mb-24 flex flex-col items-center font-title">
	<h1 class="mb-1 scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl">
		stuff.kasterpalu.ee
	</h1>
	<p class="text-2xl font-semibold text-muted-foreground">Minimängud ja muud huvitavat</p>
</header>
<main class="grid w-full max-w-4xl justify-items-center">
	{#each Object.entries(games) as [href, { image, name }]}
		<a
			class="shadow-sharp flex aspect-[4/1] w-full max-w-sm items-center justify-center rounded-xl border-2 border-current bg-contain bg-no-repeat transition-all"
			style="background-image: url('{image}')"
			draggable="false"
			{href}
		>
			<span class="relative block select-none rounded font-mono text-2xl font-semibold lg:text-3xl">
				{name}
			</span>
		</a>
	{/each}
</main>
