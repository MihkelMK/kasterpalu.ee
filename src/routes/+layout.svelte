<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/smooch-sans';
	import '@fontsource-variable/kode-mono';

	import { ModeWatcher, resetMode, setMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import LaptopMinimal from 'lucide-svelte/icons/laptop-minimal';
	import { site } from '$lib/config';

	let { children } = $props();

	let theme: string = $state('system');

	const cycleTheme = () => {
		if (theme === 'dark') {
			theme = 'light';
			setMode('light');
		} else if (theme === 'light') {
			theme = 'system';
			resetMode();
		} else {
			theme = 'dark';
			setMode('dark');
		}
	};
</script>

<svelte:head>
	<meta name="author" content={site.author} />
</svelte:head>

<ModeWatcher />

<div class="grid min-h-screen grid-rows-[auto_1fr_auto]">
	<header class="container flex w-full items-center justify-between px-8 py-6">
		<a href="/">
			<img src="/favicon.svg" alt="Mihkel Martin Kasterpalu logo" class="h-9" />
		</a>
		<Button onclick={() => cycleTheme()} variant="ghost" size="icon" class="h-12 w-12">
			{#if theme === 'dark'}
				<Moon class="!h-6 !w-6" />
			{:else if theme === 'light'}
				<Sun class="!h-6 !w-6" />
			{:else}
				<LaptopMinimal class="!h-6 !w-6" />
			{/if}

			<span class="sr-only">Toggle theme</span>
		</Button>
	</header>

	<div class="container relative flex flex-col items-center">
		{@render children()}
	</div>

	<footer class="container flex w-full justify-center px-8 py-6 text-center">
		<a
			href="https://koodi.lenn.uk/mihkelmk/minigames"
			target="_blank"
			class="text-muted-foreground underline underline-offset-4"
		>
			saidi kood
		</a>
	</footer>
</div>
