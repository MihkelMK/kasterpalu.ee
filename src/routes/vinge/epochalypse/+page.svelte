<script lang="ts">
	import { onMount } from 'svelte';

	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { getTimeRemaining } from '$lib/utils';
	import { m } from '$lib/paraglide/messages';

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
			class="card bg-muted ring-foreground/25 h-11 overflow-hidden rounded-xl font-mono text-xl ring drop-shadow-md">
			<div
				style="translate: 0 calc({index} * -2rem); transition-timing-function: cubic-bezier(.65,.01,.04,.97); transition-duration: {index ===
				count - 1
					? '600ms'
					: '300ms'};"
				class="flex flex-col gap-1 px-4 py-2 transition-all">
				{#each { length: count }, i}
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
			class="text-muted-foreground invisible hidden text-center text-lg font-semibold md:visible md:block">
		</p>
	{/if}
{/snippet}

<header class="font-title mb-24 flex flex-col items-center text-center">
	<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
		{m['games.epochalypse.title']()}
	</h1>
	<p class="text-muted-foreground text-xl leading-7 font-semibold">
		{m['games.epochalypse.subtitle']()}
	</p>
</header>
<main class="w-full max-w-4xl">
	<div
		class="bg-muted mx-auto grid w-full grid-cols-[auto_auto_auto] items-center justify-center gap-4 rounded-md p-12 md:flex">
		{@render clockStage(13, timeUntil.years, m['time.year.multiple']())}
		{@render clockStage(13, timeUntil.months, m['time.month.multiple'](), false)}
		{@render clockStage(31, timeUntil.days, m['time.day.multiple']())}
		{@render clockStage(24, timeUntil.hours, m['time.hour.multiple'](), false)}
		{@render clockStage(60, timeUntil.minutes, m['time.minute.multiple']())}
		{@render clockStage(60, timeUntil.seconds, m['time.second.multiple'](), false)}
	</div>

	<Accordion.Root type="single" class="mx-auto mt-12 max-w-prose pb-4">
		<Accordion.Item value="item-1">
			<Accordion.Trigger>{m['games.epochalypse.explainer.title']()}</Accordion.Trigger>
			<Accordion.Content class="text-md">
				<p class="leading-7 not-first:mt-6">
					{m['games.epochalypse.explainer.y2k.intro']()}
					<a
						href="https://en.wikipedia.org/wiki/Year_2000_problem"
						class="text-primary font-medium underline underline-offset-4">
						{m['games.epochalypse.explainer.y2k.linkText']()}
					</a>
					.
					<br />
					{m['games.epochalypse.explainer.y2k.outro']()}
					<strong>
						{m['games.epochalypse.explainer.y2k.emphasis']()}
					</strong>
				</p>
				<p class="leading-7 not-first:mt-6">
					{m['games.epochalypse.explainer.unix.intro']()}
					<a
						href="https://en.wikipedia.org/wiki/Unix_time"
						class="text-primary font-medium underline underline-offset-4">
						{m['games.epochalypse.explainer.unix.linkText']()}
					</a>
					- {m['games.epochalypse.explainer.unix.outro']()}
					<i>{m['games.epochalypse.explainer.unix.epoch']()}</i>
					{m['general.at']()}
					00:00:00 19.01.1970 UTC.
				</p>
				<p class="leading-7 not-first:mt-6">
					{m['games.epochalypse.explainer.integer.intro.part1']()}
					<i>{m['games.epochalypse.explainer.integer.intro.32bit']()}</i>
					{m['games.epochalypse.explainer.integer.intro.part2']()}
					<code
						class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
						2
						<sup>31</sup>
						-1
					</code>
					.
					<br />
					{m['games.epochalypse.explainer.integer.lastDate']()}
					{m['general.is']()} 03:14:07 19.01.2038 UTC (
					<code
						class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
						UNIX epoch + 2
						<sup>31</sup>
						-1
					</code>
					).
				</p>
				<p class="leading-7 not-first:mt-6">
					{m['games.epochalypse.explainer.overflow.intro']()}
					<a
						href="https://en.wikipedia.org/wiki/Integer_overflow"
						class="text-primary font-medium underline underline-offset-4">
						{m['games.epochalypse.explainer.overflow.linkText']()}
					</a>
					{m['games.epochalypse.explainer.overflow.middle']()}
					<code
						class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
						-2
						<sup>31</sup>
					</code>
					-
					{m['games.epochalypse.explainer.overflow.outro.part1']()}
					<a
						href="https://en.wikipedia.org/wiki/Unix_time"
						class="text-primary font-medium underline underline-offset-4">
						{m['games.epochalypse.explainer.overflow.outro.linkText']()}
					</a>
					{m['games.epochalypse.explainer.overflow.outro.part2']()}

					<br />
					{m['games.epochalypse.explainer.aftermath.intro']()} 20:45:52 13.12.1901 UTC {m[
						'games.epochalypse.explainer.aftermath.outro'
					]()}
				</p>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</main>
