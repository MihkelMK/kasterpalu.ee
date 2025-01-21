<script lang="ts">
	const games = [
		{
			name: 'Paku biiti',
			image: '',
			href: 'pakubiiti'
		}
	];
</script>

<header class="mb-24 flex flex-col items-center font-title">
	<h1 class="mb-1 scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl">
		stuff.kasterpalu.ee
	</h1>
	<p class="text-2xl font-semibold text-muted-foreground">Minimängud ja muud huvitavat</p>
</header>
<main class="grid w-full max-w-4xl justify-items-center">
	{#each games as { name, image, href }}
		<a
			class="shadow-sharp flex aspect-[4/1] w-full max-w-sm items-center justify-center rounded-xl border-2 border-current bg-contain bg-no-repeat transition-shadow transition-transform"
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
