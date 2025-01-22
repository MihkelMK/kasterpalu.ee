<script lang="ts">
	import { setAlbumClientState } from '$lib/client/AlbumClientState.svelte';

	let { children } = $props();

	setAlbumClientState();
</script>

{@render children()}
