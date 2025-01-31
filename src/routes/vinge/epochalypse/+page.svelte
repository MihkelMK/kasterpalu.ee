<script lang="ts">
	import { getTimeRemaining } from '$lib/utils';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { onMount } from 'svelte';

	const epochalypse = new Date(2038, 0, 19, 3, 14, 7);
	let currentTime = $state(new Date());

	let timeUntil = $derived(getTimeRemaining(currentTime, epochalypse));

	onMount(() => {
		setInterval(() => {
			currentTime = new Date();
		}, 1000);
	});
</script>

{#snippet clockDigit(nr: number)}
	<div>{String(nr).padStart(2, '0')}</div>
{/snippet}

{#snippet clockStage(count: number, index: number, title: string, divider = true)}
	<div class="flex flex-col items-center gap-2">
		<div
			class="card bg-muted ring-foreground/25 h-[2.75rem] overflow-hidden rounded-xl font-mono text-xl ring-3 drop-shadow-md"
		>
			<div
				style="translate: 0 calc({index} * -2rem); transition-duration: {index === count - 1
					? '600ms'
					: '300ms'};"
				class="ease-bouncy flex flex-col gap-1 px-4 py-2 transition-transform"
			>
				{#each { length: count } as _, i}
					{@render clockDigit(i)}
				{/each}
			</div>
		</div>

		<p class="text-muted-foreground text-sm">{title}</p>
	</div>
	{#if divider}
		<p class="text-muted-foreground mb-7 block text-center text-lg font-semibold">:</p>
	{:else}
		<p
			class="text-muted-foreground invisible hidden text-center text-lg font-semibold md:visible md:block"
		></p>
	{/if}
{/snippet}

<header class="font-title mb-24 flex flex-col items-center text-center">
	<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">Epochalypse</h1>
	<p class="text-muted-foreground text-xl font-semibold">Ära muretse! Sul on veel aega:</p>
</header>
<main class="w-full max-w-4xl">
	<div
		class="bg-muted mx-auto grid w-full grid-cols-[auto_auto_auto] items-center justify-center gap-4 rounded-md p-12 md:flex"
	>
		{@render clockStage(13, timeUntil.years, 'aastat')}
		{@render clockStage(13, timeUntil.months, 'kuud', false)}
		{@render clockStage(31, timeUntil.days, 'päeva')}
		{@render clockStage(24, timeUntil.hours, 'tundi', false)}
		{@render clockStage(60, timeUntil.minutes, 'minutit')}
		{@render clockStage(60, timeUntil.seconds, 'sekundit', false)}
	</div>

	<Accordion.Root type="single" class="mx-auto mt-12 max-w-prose pb-4">
		<Accordion.Item value="item-1">
			<Accordion.Trigger>Mis asi see on??</Accordion.Trigger>
			<Accordion.Content class="text-md">
				<p class="leading-7 not-first:mt-6">
					Epochalypse nimeline probleem on sarnane 1990 lõpus toimunud <a
						href="https://en.wikipedia.org/wiki/Year_2000_problem"
						class="text-primary font-medium underline underline-offset-4">Y2K</a
					>-le <br />
					Laialdaselt kasutatud süsteem aja ja kuupäeva märkimiseks <strong>saab otsa.</strong>
				</p>
				<p class="leading-7 not-first:mt-6">
					Enamus Linuxi baasiga Operatsioonisüsteeme kasutab aja märkimiseks <a
						href="https://en.wikipedia.org/wiki/Unix_time"
						class="text-primary font-medium underline underline-offset-4">UNIX aega</a
					>
					- mitu sekundit on möödunud UNIX <i>epoch</i>-ist 00:00:00 19.01.1970 UTC.
				</p>
				<p class="leading-7 not-first:mt-6">
					Neid sekundeid hoitaks <i>signed 32-bit</i> täisarvuna. Selle andmetüübi maksimaalne
					väärtus on
					<code
						class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
						>2<sup>31</sup>-1</code
					>. Viimane kuupäev (<code
						class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
						>UNIX epoch + 2<sup>31</sup>-1</code
					>) on 03:14:07 19.01.2038 UTC.
				</p>
				<p class="leading-7 not-first:mt-6">
					Sekund pärast seda, kui arvutid lisavad ajale sekundi juurde, juhtub <a
						href="https://en.wikipedia.org/wiki/Integer_overflow"
						class="text-primary font-medium underline underline-offset-4">täisarvu ületäitumine</a
					>
					ja aja väärtuseks saab
					<code
						class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
						>-2<sup>31</sup></code
					>. <br />
					Arvutid loevad seda kui 20:45:52 13.12.1901 UTC, ehk varaseim võimalik aeg
					<a
						href="https://en.wikipedia.org/wiki/Unix_time"
						class="text-primary font-medium underline underline-offset-4">UNIX aja</a
					> järgi.
				</p>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</main>
