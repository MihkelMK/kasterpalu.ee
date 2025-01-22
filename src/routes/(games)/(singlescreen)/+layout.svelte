<script lang="ts">
	let { children } = $props();
</script>

<div class="container flex min-h-screen flex-col items-center justify-center py-4">
	{@render children()}
</div>
