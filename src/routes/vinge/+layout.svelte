<script lang="ts">
	import { baseURL, stuffSite } from '$lib/config.js';

	let { children, data } = $props();

	const title = data?.name ? `${data.name} | ${stuffSite.name}` : stuffSite.name;
	const description = data?.description || stuffSite.description;
	const ogImage = data?.image || stuffSite.image;
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />

	<meta name="description" content={description} />
	<meta property="og:description" content={description} />

	<meta property="og:image" content={baseURL + ogImage} />
</svelte:head>

{@render children()}

{#if data?.name === 'Vau kui vali'}
	<style global>
		html {
			--scrollbar-color-thumb: transparent;
			--scrollbar-color-track: transparent;
			--scrollbar-width: none;
			--scrollbar-width-legacy: 0px;

			-ms-overflow-style: none; /* Internet Explorer 10+ */
		}
	</style>
{/if}
