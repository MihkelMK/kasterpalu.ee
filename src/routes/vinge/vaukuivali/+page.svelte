<script lang="ts">
	import History from 'lucide-svelte/icons/history';
	import { expoOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import SevenSegmentDigit from './SevenSegmentDigit.svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import ArrowUpToLine from 'lucide-svelte/icons/arrow-up-to-line';
	import { onMount } from 'svelte';
	import { getTimeRemaining } from '$lib/utils';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import Button from '$lib/components/ui/button/button.svelte';

	import roomImg from '$lib/assets/vaukuivali/roomtone.jpg?enhanced';
	import watchImg from '$lib/assets/vaukuivali/oldwatch.jpg?enhanced';
	import convoImg from '$lib/assets/vaukuivali/conversation.jpg?enhanced';
	import gennImg from '$lib/assets/vaukuivali/genn.webp?enhanced';
	import tvImg from '$lib/assets/vaukuivali/tv.jpg?enhanced';
	import trafficImg from '$lib/assets/vaukuivali/kaubamaja.jpg?enhanced';
	import harleyImg from '$lib/assets/vaukuivali/harley.jpg?enhanced';
	import landingImg from '$lib/assets/vaukuivali/landing.jpg?enhanced';
	import carCrashImg from '$lib/assets/vaukuivali/carcrash.jpg?enhanced';
	import chainsawImg from '$lib/assets/vaukuivali/chainsaw.jpg?enhanced';
	import jetImg from '$lib/assets/vaukuivali/fighters.jpg?enhanced';
	import hearingaidImg from '$lib/assets/vaukuivali/eardamage.jpg?enhanced';
	import Image from '$lib/components/Image.svelte';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';

	interface SoundCheckpoint {
		db: number;
		title: string;
		description: string;
		crossedTime: undefined | Date;
	}

	const soundCheckpoints: SoundCheckpoint[] = $state([
		{
			db: 0,
			title: '',
			description: 'Kesket metsa mingis koopas, kedagi pole ümber',
			image: undefined,
			crossedTime: undefined
		},
		{
			db: 30,
			title: '"Vaikus"',
			description: 'ehk elutoa pasiivne müra',
			image: {
				src: roomImg,
				credit: {
					type: 'web',
					author: 'Kam Idris',
					href: 'https://unsplash.com/@ka_idris'
				},
				alt: 'Modernse ja minimalistliku disainiga siseruum.'
			},
			crossedTime: undefined
		},
		{
			db: 40,
			title: 'Tikk takk',
			description: 'Mehaanilise kella tiksumine (va täistundidel)',
			image: {
				src: watchImg,
				credit: {
					type: 'web',
					author: 'János Venczák',
					href: 'https://unsplash.com/@venczakjanos'
				},
				alt: 'Lahti võetud vanamoodne käekell. Näha on kella sisemust, hammasrattaid.'
			},
			crossedTime: undefined
		},
		{
			db: 50,
			title: 'Tava jutt',
			description: 'Rahulik vestlus kodus',
			image: {
				src: convoImg,
				credit: {
					type: 'web',
					author: 'Toa Heftiba',
					href: 'https://unsplash.com/@heftiba'
				},
				alt: 'Noor paar köögis. Mees lõikab taldriku peal pannkooki, naine istub ta kõrval pliidi peal ja vaatab.'
			},
			crossedTime: undefined
		},
		{
			db: 60,
			title: 'Ma sain nurgad täis',
			description: 'Bingo õhtu Gennis (keset mängu)',
			image: {
				src: gennImg,
				credit: {
					type: 'web',
					author: 'Laila Kaasik',
					href: 'https://tartu.postimees.ee/8154041/lallavad-pidutsejad-panid-tartu-otsima-tasakaalu-ooelu-ja-oorahu-vahel'
				},
				alt: 'Genialistide klubi tegutseb Tartus Magasini tänavas. Pilt on õhtusest ajast, rohkelt inimesti klubi välialal.'
			},
			crossedTime: undefined
		},
		{
			db: 70,
			title: 'Pult on kadunud',
			description: 'Telekas, mis mängib natuke liiga valjult',
			image: {
				src: tvImg,
				credit: {
					type: 'web',
					author: 'Jonas Leupe',
					href: 'https://unsplash.com/@jonasleupe'
				},
				alt: 'Keegi vaatab televiisorist filmi. Esiplaanil fookuses teleka pult, tagaplaanil udune tuba, mille seina vastas on telekas.'
			},
			crossedTime: undefined
		},
		{
			db: 80,
			title: 'USAs oleks hullem',
			description: 'Riia mäe liiklus (ootad bussi Kaubamaja ees)',
			image: {
				src: trafficImg,
				credit: {
					type: 'web',
					author: 'Google Street View',
					href: 'https://maps.app.goo.gl/ZfADP4LnUid7d571A'
				},
				alt: 'Aastal 2012 tehtud Google Street View pilt. Näha on Tartu Kaubamaja ning selle Riia tänava küljel olevat bussipeatust.'
			},
			crossedTime: undefined
		},
		{
			db: 90,
			title: 'USAs oleks rohkem',
			description: 'Harley sõidab sinust mööda',
			image: {
				src: harleyImg,
				credit: {
					type: 'web',
					author: 'Harley-Davidson',
					href: 'https://unsplash.com/@harleydavidson'
				},
				alt: 'Uue välimusega Harley-Davidson mootorrattas sõidab kiiresti mööda sirget maanteed.'
			},
			crossedTime: undefined
		},
		{
			db: 100,
			title: 'Põgenesid terminalist',
			description: 'Boeing 707 1 meremiil enne maandumist',
			image: {
				src: landingImg,
				credit: {
					type: 'web',
					author: 'Scott Fillmer',
					href: 'https://unsplash.com/@scottfillmer'
				},
				alt: 'Continental Airlines Boeing 777 maandub uduses Houston IAH lennujaamas.'
			},
			crossedTime: undefined
		},
		{
			db: 110,
			title: 'Maanteeraev',
			description: 'Autosignaal 1m kauguselt',
			image: {
				src: carCrashImg,
				credit: {
					type: 'instagram',
					author: 'Jordan Besson',
					href: 'https://www.instagram.com/mr.blue.photographie'
				},
				alt: 'Dramaatiline auto trikk filmi jaoks. Kahe auto kokkupõrge.'
			},
			crossedTime: undefined
		},
		{
			db: 120,
			title: 'Mootorsaag',
			description: 'Nüüd on juba valus. Soovitan kanda kõrvatroppe.',
			image: {
				src: chainsawImg,
				credit: {
					type: 'web',
					author: 'Benjamin Jopen',
					href: 'https://unsplash.com/@benjopen'
				},
				alt: 'Oranži ja musta värvi mootorsega lõigatakse langenud puud väiksemateks tükkideks.'
			},
			crossedTime: undefined
		},
		{
			db: 130,
			title: 'Kuidas sa nii lähedale said?',
			description: 'Turboreaktiivmootoriga hävitaja lendutõus 15m kauguselt',
			image: {
				src: jetImg,
				credit: {
					type: 'web',
					author: 'Colin Lloyd',
					href: 'https://unsplash.com/@onthesearchforpineapples'
				},
				alt: 'Kaheksa F-16 hävitajat lendavad koos formatsioonis taevas.'
			},
			crossedTime: undefined
		},
		{
			db: 150,
			title: 'Aia mu kõrvad',
			description: 'Tubli töö! Su trummikile rebenes!',
			image: {
				src: hearingaidImg,
				credit: {
					type: 'web',
					author: 'Mark Paton',
					href: 'https://unsplash.com/@heftiba'
				},
				alt: 'Lähivõte inimesest sisestamas oma kõrva kuuldeaparaati.'
			},
			crossedTime: undefined
		}
	]);

	// Source: Claude 3.5 Sonnet
	function scrollToDecibels(scroll: number) {
		return Math.min(150, Math.log10(scroll / scrollScale + 1) * 40);
	}

	// Source: Claude 3.5 Sonnet
	function decibelsToScroll(db: number) {
		return (Math.pow(10, db / 40) - 1) * scrollScale;
	}

	// Source: Claude 3.5 Sonnet
	function getCurrentCheckpoint(arr: SoundCheckpoint[], current: number) {
		return (
			arr.reduce(
				(prev: SoundCheckpoint | undefined, item) =>
					item.db <= current && (!prev || item.db > prev.db) ? item : prev,
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
	let prevCheckpoint: SoundCheckpoint | undefined = $state(undefined);

	let scrollScale = $derived(innerHeight * 0.1);
	let containerHeight = $derived(decibelsToScroll(150) + innerHeight + innerHeight);
	let displayDecimals = $derived(innerWidth > 1000);

	let scrollY = new Tween(0, { duration: 150, easing: expoOut });

	let currentDecibel = $derived(scrollToDecibels(scrollY.target));
	let currentDecibelTweened = $derived(scrollToDecibels(scrollY.current));
	let currentCheckpoint = $derived(getCurrentCheckpoint(soundCheckpoints, currentDecibel));

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

	$effect(() => {
		if (
			currentCheckpoint?.title &&
			currentCheckpoint != prevCheckpoint &&
			!currentCheckpoint?.crossedTime
		) {
			currentCheckpoint.crossedTime = new Date();
		}
	});

	onMount(() => {
		soundCheckpoints[0].crossedTime = new Date();
		scrollY.target = 0;
	});
</script>

{#snippet checkpoint(db: number, passed: boolean)}
	<div
		class="rounded-r-lg transition-colors {passed
			? 'bg-primary text-primary-foreground'
			: 'bg-muted-foreground text-muted'} py-1 text-center {displayDecimals
			? 'w-16 text-sm'
			: 'w-14 text-xs'}"
	>
		{db}dBA
	</div>
{/snippet}

{#snippet timeCard(point: SoundCheckpoint)}
	<div class="rounded-md border px-4 py-3 font-mono text-sm">
		<p class="leading-7">
			<strong>{point.db}dBA</strong> -
			<span>{getElapsedTime(soundCheckpoints.at(0)?.crossedTime, point.crossedTime)}</span>
		</p>
	</div>
{/snippet}

<svelte:window
	onkeydowncapture={disableHomeAndEnd}
	bind:scrollY={scrollY.target}
	bind:innerWidth
	bind:innerHeight
/>

{#if innerWidth === 0 || innerHeight === 0}
	<div
		class="grid h-screen w-full items-center justify-center"
		out:fade={{ duration: 150, easing: expoOut }}
	>
		<LoaderCircle class="animate-spin" />
	</div>
{:else}
	<div
		style="height: {containerHeight}px;"
		class="relative mb-24 w-full"
		in:fade={{ duration: 300, easing: expoOut }}
	>
		<div class="sticky left-4 top-24 flex items-start rounded-xl">
			<div class="flex flex-col items-start">
				<div
					class="ring-3 flex gap-2 rounded-md bg-stone-800 px-3 py-1 shadow shadow-black/15 ring-4 ring-inset ring-stone-900 {!displayDecimals
						? '-ml-1.5 mb-4 scale-90'
						: 'mb-6'}"
				>
					{#each decibelMeter as digit, i}
						<div class="py-2 shadow-sm">
							<SevenSegmentDigit {digit} decimal={displayDecimals && i == 2} />
						</div>
					{/each}
				</div>
				<div class="flex flex-col items-center gap-4">
					<div
						class="relative h-[70svh] w-4 bg-gradient-to-b from-lime-300 via-yellow-400 to-red-500 dark:from-lime-500 dark:via-yellow-400 dark:to-red-500"
					>
						{#each soundCheckpoints as { db }}
							<div
								transition:fade
								style="top: calc({(db / 150) * 70}svh - 0.5rem)"
								class="absolute flex items-center"
							>
								{@render checkpoint(db, currentDecibel >= db)}
							</div>
						{/each}
						<div
							class="absolute bottom-0 w-full backdrop-grayscale"
							style="height: {100 - (currentDecibelTweened / 150) * 100}%"
						></div>
					</div>
				</div>
			</div>
			<div
				class="mx-auto flex w-full max-w-2xl flex-col-reverse items-center gap-8 self-center px-12 md:grid md:gap-0 md:*:[grid-area:1/1/2/2]"
			>
				<Image image={currentCheckpoint?.image} class="aspect-square object-cover " />
				<header
					class="flex flex-col items-center py-4 text-center font-title backdrop-blur-sm backdrop-grayscale md:bg-background/75 dark:md:bg-background/90"
				>
					<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
						{#if currentCheckpoint?.db === 0}
							Vau kui vali!
						{:else}
							{currentCheckpoint?.title}
						{/if}
					</h1>
					{#if currentCheckpoint?.db === 0}
						<p class="max-w-prose text-2xl font-semibold leading-7 text-muted-foreground">
							Nagu paljud võivad teada, on detsibellide skaala logaritmiline.<br /> 60dB on 2x valjem,
							kui 50dB.
						</p>
						<p
							class="max-w-prose text-2xl font-semibold leading-7 text-muted-foreground [&:not(:first-child)]:mt-6"
						>
							See info ei jõudnud mulle eriti kohale. <br />Intuitiivsemaks arusaamiseks tegin selle
							lehe. <br /><strong>Proovi, keri alla.</strong>
						</p>
					{:else}
						<p class="max-w-prose text-2xl font-semibold leading-7 text-primary/80">
							{currentCheckpoint?.description}
						</p>
					{/if}
				</header>
			</div>
		</div>
	</div>

	<Collapsible.Root class="w-full max-w-xs space-y-2">
		<div class="flex items-center justify-between px-4">
			<h4 class="text-sm font-semibold">Sul läks ikka kaua...</h4>
			<Collapsible.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="sm" class="w-9 p-0" {...props}>
						<ChevronsUpDown />
						<span class="sr-only">Toggle</span>
					</Button>
				{/snippet}
			</Collapsible.Trigger>
		</div>
		{@render timeCard(soundCheckpoints.at(-1) as SoundCheckpoint)}
		<Collapsible.Content class="space-y-2">
			{#each soundCheckpoints.slice(1, -1).reverse() as point}
				{@render timeCard(point)}
			{/each}
		</Collapsible.Content>
	</Collapsible.Root>

	<div class="mt-24 flex w-full justify-between">
		<div>
			<small class="text-sm font-medium leading-none"> Helitugevuste allikad: </small>
			<ul class="my-4 ml-6 list-disc [&>li]:mt-2">
				<li class="max-w-prose text-sm leading-4 text-muted-foreground">
					Fastl, H., & Florentine, M. (2010). Loudness in Daily Environments. Springer Handbook of
					Auditory Research, 199–221. doi:10.1007/978-1-4419-6712-1_8
				</li>
				<li class="max-w-prose text-sm leading-4 text-muted-foreground">
					<a
						href="https://www.chem.purdue.edu/chemsafety/Training/PPETrain/dblevels.htm"
						target="_blank"
						class=" underline underline-offset-4">Purdue University PPE training materials</a
					>
				</li>
			</ul>
		</div>
		<Button
			onclick={() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
			size="default"
			variant="secondary"
			class="h-10 w-10"
		>
			<ArrowUpToLine class="!h-6 !w-6" />
		</Button>
	</div>
{/if}
