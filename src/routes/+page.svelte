<script lang="ts">
	import { site, baseURL, games } from '$lib/config';
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta property="og:title" content={site.name} />

	<meta name="description" content={site.description} />
	<meta property="og:description" content={site.description} />

	<meta property="og:image" content={baseURL + site.image} />
</svelte:head>

<header class="mb-24 flex flex-col items-center text-center font-title">
	<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
		Hei! Mina olen Mihkel
	</h1>
	<p class="text-xl font-semibold text-muted-foreground">
		Siin saidil on mu loodud minimängud ja muud huvitavat. Aitäh <a
			href="https://neal.fun"
			class="font-medium underline underline-offset-4">neal.fun</a
		> inspo eest :]
	</p>
	<p class="text-xl font-semibold text-muted-foreground">
		Vaata ka mu
		<a href="/projektid" class="text-primary underline underline-offset-4">teisi projekte</a>.
	</p>
</header>
<main class="grid w-full max-w-4xl justify-items-center gap-y-8 lg:grid-cols-2">
	{#each Object.entries(games) as [href, { image, name }]}
		<a
			class="shadow-sharp flex aspect-[4/1] w-full max-w-sm items-center justify-center rounded-xl border-2 border-current bg-contain bg-no-repeat transition-all {href ===
			''
				? 'pressed pointer-events-none'
				: ''}"
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
