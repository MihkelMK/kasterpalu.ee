<script lang="ts">
	import { siteName } from '$lib/config.js';

	let { children, data } = $props();
</script>

<svelte:head>
	{#if data.name}
		<title>{data.name} | {siteName}</title>
		<meta property="og:title" content={data.name + ' | ' + siteName} />
	{/if}

	{#if data.desctiption}
		<meta name="description" content={data.description} />
		<meta property="og:description" content={data.description} />
	{/if}

	{#if data.image}
		<meta property="og:image" content={data.image} />
	{/if}
</svelte:head>

{@render children()}
