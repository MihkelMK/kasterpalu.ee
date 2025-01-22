<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/smooch-sans';
	import '@fontsource-variable/kode-mono';

	import { ModeWatcher, resetMode, setMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import LaptopMinimal from 'lucide-svelte/icons/laptop-minimal';

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
	<meta name="author" content="Mihkel Martin Kasterpalu" />
</svelte:head>

<ModeWatcher />

<header class="absolute top-0 flex w-full justify-between px-8 py-6">
	<a href="/">
		<img src="/favicon.svg" alt="Mihkel Martin Kasterpalu logo" class="h-10" />
	</a>
	<Button onclick={() => cycleTheme()} variant="outline" size="icon">
		{#if theme === 'dark'}
			<Moon class="absolute h-[1.2rem] w-[1.2rem]" />
		{:else if theme === 'light'}
			<Sun class="h-[1.2rem] w-[1.2rem] " />
		{:else}
			<LaptopMinimal class="h-[1.2rem] w-[1.2rem]" />
		{/if}

		<span class="sr-only">Toggle theme</span>
	</Button>
</header>

<div class="container mt-24 flex flex-col items-center py-4">
	{@render children()}
</div>
