<script lang="ts">
	import { setAlbumClientState } from '$lib/client/pakubiiti/AlbumClientState.svelte';

	let { children } = $props();

	setAlbumClientState();
</script>

{@render children()}
