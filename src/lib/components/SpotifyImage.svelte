<script lang="ts">
	import type { AlbumImage } from '$lib/types';

	let {
		images
	}: {
		images: AlbumImage[];
	} = $props();

	let srcset = $derived(
		images
			.map(({ url, width }) => {
				if (width) {
					return `${url} ${width}w`;
				}
				return url;
			})
			.join(', ')
	);

	const sizes = '(max-width: 320px) 64px, 300px';
	const thumbnail = images.at(-1);

	const className = 'aspect-square w-full object-cover';
</script>

{#if images && thumbnail}
	<picture>
		<source {srcset} {sizes} />

		<img
			src={thumbnail.url}
			alt=""
			class={className}
			loading="eager"
			fetchpriority="high"
			decoding="async"
			width={thumbnail.width}
			height={thumbnail.height}
			{sizes} />
	</picture>
{/if}
