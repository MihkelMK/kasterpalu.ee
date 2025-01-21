<script lang="ts">
	let { children } = $props();
</script>

<div class="container mt-32 flex flex-col items-center py-4">
	{@render children()}
</div>
