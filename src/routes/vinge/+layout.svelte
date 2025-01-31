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
