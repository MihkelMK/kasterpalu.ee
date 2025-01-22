<script lang="ts">
	import { baseURL, site } from '$lib/config.js';

	let { children, data } = $props();

	const title = data?.name ? `${data.name} | ${site.name}` : site.name;
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />

	{#if data?.description}
		<meta name="description" content={data.description} />
		<meta property="og:description" content={data.description} />
	{/if}

	{#if data?.image}
		<meta property="og:image" content={baseURL + data.image} />
	{/if}
</svelte:head>

{@render children()}
