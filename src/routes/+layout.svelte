<script lang="ts">
	import '../app.css';

	import '@fontsource-variable/smooch-sans';
	import '@fontsource-variable/kode-mono';

	import { onMount } from 'svelte';
	import { site } from '$lib/config';
	import { ModeWatcher, setMode, mode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import LaptopMinimal from '@lucide/svelte/icons/laptop-minimal';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, localizeHref, setLocale } from '$lib/paraglide/runtime';

	let { children } = $props();
	let email: string | undefined = $state(undefined);
	let otherLocale: 'en' | 'et' = $derived(getLocale() === 'en' ? 'et' : 'en');
	const localeText = (locale: 'en' | 'et') => (locale === 'en' ? 'english' : 'estonian');

	const cycleTheme = () => {
		if (mode.current === 'dark') {
			setMode('light');
		} else if (mode.current === 'light') {
			setMode('system');
		} else {
			setMode('dark');
		}
	};

	onMount(() => {
		email = site.email;
	});
</script>

<svelte:head>
	<meta name="author" content={site.author} />
</svelte:head>

<ModeWatcher />

<div class="grid min-h-screen grid-rows-[auto_1fr_auto]">
	<header class="container grid w-full grid-cols-[1fr_auto_1fr] items-center px-8 py-6">
		<a href={localizeHref('/')}>
			<img src="/favicon.svg" alt="Mihkel Martin Kasterpalu logo" class="h-9" />
		</a>

		<a class="font-mono font-medium underline underline-offset-4" href={localizeHref('/vinge')}>
			{m['navigaton.vinge']()}
		</a>

		<div class="flex justify-self-end">
			<Button onclick={() => setLocale(otherLocale)} variant="ghost" size="icon" class="h-12 w-12">
				<p>{getLocale()}</p>

				<span class="sr-only">Change language to {localeText(otherLocale)}</span>
			</Button>
			<Button onclick={() => cycleTheme()} variant="ghost" size="icon" class="h-12 w-12">
				{#if mode.current === 'dark'}
					<Moon class="h-6! w-6!" />
				{:else if mode.current === 'light'}
					<Sun class="h-6! w-6!" />
				{:else}
					<LaptopMinimal class="h-6! w-6!" />
				{/if}

				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</header>

	<div class="relative container mt-16 flex flex-col items-center">
		{@render children()}
	</div>

	<footer class="container flex w-full justify-between px-9 py-6">
		<a
			href="https://github.com/MihkelMK/kasterpalu.ee"
			target="_blank"
			class="text-muted-foreground text-sm underline underline-offset-4">
			{m['navigaton.sourcecode']()}
		</a>

		{#if email}
			<a
				href="mailto://{email}"
				target="_blank"
				class="text-muted-foreground text-right text-sm underline underline-offset-4">
				{email}
			</a>
		{:else}
			<p class="text-muted-foreground text-sm">&lt;email_protected&gt;</p>
		{/if}
	</footer>
</div>
