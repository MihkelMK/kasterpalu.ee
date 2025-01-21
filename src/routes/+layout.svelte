<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<header class="mb-24 flex flex-col items-center">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Paku biiti</h1>
		<p class="text-xl text-muted-foreground">
			Lohista kokku õiged albumi <span class="text-orange-400">nimed</span>,
			<span class="text-cyan-400">artistid</span> ja <span class="text-purple-400">pildid</span>.
		</p>
	</header>
	<main class="w-full max-w-3xl">
		{@render children()}
	</main>
</div>
