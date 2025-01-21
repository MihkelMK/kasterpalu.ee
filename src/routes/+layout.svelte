<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/smooch-sans';

	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	let { children } = $props();
</script>

<ModeWatcher />

<header class="container absolute top-0 flex justify-between py-6">
	<a href="/">
		<img src="/favicon.svg" alt="Mihkel Martin Kasterpalu logo" class="h-10" />
	</a>
	<Button onclick={toggleMode} variant="outline" size="icon">
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</header>

<div class="container flex min-h-screen flex-col items-center justify-center py-4">
	<header class="font-title mb-24 flex flex-col items-center">
		<h1 class="mb-1 scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl">Paku biiti</h1>
		<p class="text-2xl font-semibold text-muted-foreground">
			Lohista kokku õiged albumi <span class="text-red-600 dark:text-red-400">nimed</span>,
			<span class="text-purple-600 dark:text-purple-400">artistid</span> ja
			<span class="text-blue-600 dark:text-blue-400">pildid</span>.
		</p>
	</header>
	<main class="w-full max-w-4xl">
		{@render children()}
	</main>
</div>
