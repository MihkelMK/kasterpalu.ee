<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { expoOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Image from '$lib/components/Image.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import ArrowUpToLine from '@lucide/svelte/icons/arrow-up-to-line';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';

	import { Previous, watch } from 'runed';
	import { getTimeRemaining } from '$lib/utils';

	import SevenSegmentDigit from './SevenSegmentDigit.svelte';
	import { soundCheckpoints } from './checkpoints';
	import { m } from '$lib/paraglide/messages';

	// Source: Claude 3.5 Sonnet
	function scrollToDecibels(scroll: number) {
		return Math.min(150, Math.log10(scroll / scrollScale + 1) * 40);
	}

	// Source: Claude 3.5 Sonnet
	function decibelsToScroll(db: number) {
		return (Math.pow(10, db / 40) - 1) * scrollScale;
	}

	// Source: Claude 3.5 Sonnet
	function getCurrentCheckpoint(arr: number[], current: number) {
		return (
			arr.reduce(
				(prev: number | undefined, item) =>
					item <= current && (!prev || item > prev) ? item : prev,
				undefined
			) || arr.at(0)
		);
	}

	function getElapsedTime(start: Date | undefined, end: Date | undefined) {
		if (!start || !end) {
			return '00:00.000';
		}

		const remaining = getTimeRemaining(start, end);
		const remMinutes = String(remaining.minutes).padStart(2, '0');
		const remSeconds = String(remaining.seconds).padStart(2, '0');
		const remMilliseconds = String(remaining.milliseconds).padStart(3, '0');

		return `${remMinutes}:${remSeconds}.${remMilliseconds}`;
	}

	let innerHeight = $state(0);
	let innerWidth = $state(0);

	let startTime: Date | undefined = $state();
	let firstScroll: Date | undefined = $state();

	let scrollScale = $derived(innerHeight * 0.1);
	let containerHeight = $derived(decibelsToScroll(150) + innerHeight + innerHeight);
	let displayDecimals = $derived(innerWidth > 1000);

	let scrollY = new Tween(0, { duration: 150, easing: expoOut });
	let lastScroll = new Previous(() => scrollY.current);
	let lastScrollWasUp = $derived(lastScroll?.current && scrollY.current <= lastScroll.current);

	let currentDecibel = $derived(scrollToDecibels(scrollY.target));
	let currentDecibelTweened = $derived(scrollToDecibels(scrollY.current));

	let checkpointDecibels = $derived(Object.keys(soundCheckpoints).map((value) => Number(value)));
	let currentCheckpoint = $derived(getCurrentCheckpoint(checkpointDecibels, currentDecibel));
	let checkpointTimes: Record<number, Date> = $state({});

	let decibelMeter = $derived.by(() => {
		const clampedValue = Math.min(999.99, Math.max(0, currentDecibel));
		const integerPart = Math.floor(clampedValue);

		if (!displayDecimals) {
			return String(integerPart).padStart(3, '0').split('').map(Number);
		}

		const decimalPart = Math.floor((clampedValue - integerPart) * 10);

		return String(integerPart).padStart(3, '0').concat(String(decimalPart)).split('').map(Number);
	});

	function disableHomeAndEnd(e: KeyboardEvent & { currentTarget: EventTarget & Window }) {
		if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
		}
	}

	watch.pre(
		() => currentCheckpoint,
		(curr, prev) => {
			if (!curr || curr === prev) return;

			if (checkpointTimes[curr]) return;

			checkpointTimes[curr] = new Date();

			// We reached the end
			// Fill out any checkpoint times we missed with crude predictions
			if (curr === checkpointDecibels.at(-1) && checkpointDecibels.length > 1) {
				for (let i = 0; i < checkpointDecibels.length; i++) {
					const db = checkpointDecibels[i];
					const capturedTime = checkpointTimes[db];

					if (!capturedTime) {
						// If the next closest previous time is page load
						// use first scroll for a more accurate prediction (if possible)
						const prevDb = checkpointDecibels[Math.max(i - 1, 0)];
						const prevTime = prevDb === 0 && firstScroll ? firstScroll : checkpointTimes[prevDb];

						if (!prevTime) {
							checkpointTimes[db] = firstScroll ? firstScroll : checkpointTimes[0];
							continue;
						}

						const nextDb = checkpointDecibels[Math.min(i + 1, checkpointDecibels.length - 1)];
						const nextTime = checkpointTimes[nextDb];

						if (!nextTime) {
							checkpointTimes[db] = prevTime;
							continue;
						}

						checkpointTimes[db] = new Date((prevTime.getTime() + nextTime.getTime()) / 2);
					}
				}
			}
		}
	);

	// Get the time of first scroll
	watch.pre(
		() => scrollY.current,
		() => {
			if (!startTime) return;
			if (firstScroll) return;

			firstScroll = new Date();
			checkpointTimes[checkpointDecibels[0]] = firstScroll;
		}
	);

	onMount(() => {
		scrollY.set(0, { duration: 0 });

		startTime = new Date();
	});
</script>

{#snippet scrollUpArrow()}
	<Button
		onclick={() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}}
		size="default"
		variant="secondary"
		class="h-10 w-10">
		<ArrowUpToLine class="h-6! w-6!" />
	</Button>
{/snippet}

{#snippet checkpoint(db: number, passed: boolean)}
	<div
		class="rounded-r-lg transition-colors {passed
			? 'bg-primary text-primary-foreground'
			: 'bg-muted-foreground text-muted'} py-1 text-center {displayDecimals
			? 'w-16 text-sm'
			: 'w-14 text-xs'}">
		{db}dBA
	</div>
{/snippet}

{#snippet timeCard(db: number | undefined)}
	<div class="rounded-md border px-4 py-3 font-mono text-sm">
		<p class="leading-7">
			<strong>{db}dBA</strong>
			-
			<span>{getElapsedTime(firstScroll, db ? checkpointTimes[db] : firstScroll)}</span>
		</p>
	</div>
{/snippet}

<svelte:window
	onkeydowncapture={disableHomeAndEnd}
	bind:scrollY={scrollY.target}
	bind:innerWidth
	bind:innerHeight />

{#if innerWidth === 0 || innerHeight === 0}
	<div
		class="grid h-screen w-full items-center justify-center"
		out:fade={{ duration: 150, easing: expoOut }}>
		<LoaderCircle class="animate-spin" />
	</div>
{:else}
	<div
		style="height: {containerHeight}px;"
		class="relative mb-24 w-full"
		in:fade={{ duration: 300, easing: expoOut }}>
		<div class="sticky top-24 left-4 flex items-start rounded-xl">
			<div class="flex flex-col items-start">
				<div
					class="flex gap-2 rounded-md bg-stone-800 px-3 py-1 shadow ring-3 shadow-black/15 ring-stone-900 ring-inset {!displayDecimals
						? 'mb-4 -ml-1.5 scale-90'
						: 'mb-6'}">
					{#each decibelMeter as digit, i ('meterdigit-' + i)}
						<div class="py-2 shadow-sm">
							<SevenSegmentDigit {digit} decimal={displayDecimals && i == 2} />
						</div>
					{/each}
				</div>
				<div class="flex flex-col items-center gap-4">
					<div
						class="relative h-[70svh] w-4 bg-linear-to-b from-lime-300 via-yellow-400 to-red-500 dark:from-lime-500 dark:via-yellow-400 dark:to-red-500">
						{#each checkpointDecibels as db ('checkpoint-' + db)}
							<div
								transition:fade
								style="top: calc({(db / 150) * 70}svh - 0.5rem)"
								class="absolute flex items-center">
								{@render checkpoint(db, currentDecibel >= db)}
							</div>
						{/each}
						<div
							class="absolute bottom-0 w-full backdrop-grayscale"
							style="height: {100 - (currentDecibelTweened / 150) * 100}%">
						</div>
					</div>
				</div>
			</div>
			<div
				class="mx-auto flex w-full max-w-2xl flex-col-reverse items-center gap-8 self-center px-12 md:grid md:gap-0 md:*:[grid-area:1/1/2/2]">
				{#if typeof currentCheckpoint === 'number'}
					<Image
						image={soundCheckpoints[currentCheckpoint]?.image}
						class="aspect-square object-cover" />
					<header
						class="font-title md:bg-background/75 dark:md:bg-background/90 flex flex-col items-center py-4 text-center backdrop-blur-sm backdrop-grayscale">
						<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
							{#if currentCheckpoint === 0}
								{m['games.vaukuivali.title']()}
							{:else}
								{soundCheckpoints[currentCheckpoint]?.title}
							{/if}
						</h1>
						{#if currentCheckpoint === 0}
							<p class="text-muted-foreground max-w-prose text-2xl leading-7 font-semibold">
								{m['games.vaukuivali.intro.explainer.body']()}
								<br />
								{m['games.vaukuivali.intro.explainer.footer']()}
							</p>
							<p
								class="text-muted-foreground max-w-prose text-2xl leading-7 font-semibold not-first:mt-6">
								{m['games.vaukuivali.intro.problem.body']()}
								<br />
								{m['games.vaukuivali.intro.problem.footer']()}

								<br />
								<strong>{m['games.vaukuivali.intro.cta']()}</strong>
							</p>
						{:else}
							<p class="text-primary/80 max-w-prose text-2xl leading-7 font-semibold">
								{soundCheckpoints[currentCheckpoint]?.description}
							</p>
						{/if}
					</header>
				{/if}
			</div>
			{#if currentCheckpoint && currentCheckpoint > 1 && lastScrollWasUp}
				<div transition:fly={{ y: 200, easing: expoOut }} class="absolute right-8 -bottom-15">
					{@render scrollUpArrow()}
				</div>
			{/if}
		</div>
	</div>

	<Collapsible.Root class="w-full max-w-xs space-y-2">
		<div class="flex items-center justify-between px-4">
			<h4 class="text-sm font-semibold">{m['games.vaukuivali.speedrun']()}</h4>
			<Collapsible.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="sm" class="w-9 p-0" {...props}>
						<ChevronsUpDown />
						<span class="sr-only">Toggle</span>
					</Button>
				{/snippet}
			</Collapsible.Trigger>
		</div>
		{@render timeCard(checkpointDecibels.at(-1))}
		<Collapsible.Content class="space-y-2">
			{#each checkpointDecibels.slice(1, -1).reverse() as db ('timecard-' + db)}
				{@render timeCard(db)}
			{/each}
		</Collapsible.Content>
	</Collapsible.Root>

	<div class="mt-24 flex w-full justify-between">
		<div>
			<small class="text-sm leading-none font-medium">{m['games.vaukuivali.sources']()}</small>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li class="text-muted-foreground max-w-prose text-sm leading-4">
					Fastl, H., & Florentine, M. (2010). Loudness in Daily Environments. Springer Handbook of
					Auditory Research, 199–221. doi:10.1007/978-1-4419-6712-1_8
				</li>
				<li class="text-muted-foreground max-w-prose text-sm leading-4">
					<a
						href="https://www.chem.purdue.edu/chemsafety/Training/PPETrain/dblevels.htm"
						target="_blank"
						class="underline underline-offset-4">
						Purdue University PPE training materials
					</a>
				</li>
			</ul>
		</div>
		<div class="mr-8">
			{@render scrollUpArrow()}
		</div>
	</div>
{/if}
