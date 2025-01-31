<script lang="ts">
	import type { EnhancedImage, Project, Tag } from '$lib/types';
	import { site, baseURL, badges } from '$lib/config';

	import SquareArrowOutUpRight from 'lucide-svelte/icons/square-arrow-out-up-right';

	import { Button } from '$lib/components/ui/button/index.js';
	import Image from '$lib/components/Image.svelte';

	import skpImg from '$lib/assets/skp.jpg?enhanced';
	import dysasterImg from '$lib/assets/dysaster.jpg?enhanced';
	import monospaceeImg from '$lib/assets/monospacee.jpg?enhanced';
	import saueauguImg from '$lib/assets/saueaugu.jpg?enhanced';

	export const projects: Project[] = [
		{
			name: 'SUPIKÖÖGIPOSID',
			image: {
				src: skpImg,
				credit: {
					type: 'instagram',
					author: 'Mimmu',
					href: 'https://www.instagram.com/musamimmu/'
				},
				alt: 'Pilt neljaliikmeliseslt räpibändist SUPIKÖÖGIPOISID. Pilt on tehtud pilves ilmaga õues. Pildil on 4 mees valgete triiksärkide, mustade lipsude ja mustade tagidega.'
			},
			description: 'Räpikollektiiv. Alustasime 2019.',
			link: 'https://skpoisid.bandcamp.com/',
			tags: [badges['muusika']]
		},
		{
			name: 'Dysaster Collective',
			image: {
				src: dysasterImg,
				credit: {
					type: 'instagram',
					author: 'Mattias Mägi',
					href: 'https://www.instagram.com/mattias.mix/'
				},
				alt: 'Sinakas digitaalne kollaž Dysaster Collective liigetest.'
			},
			description: '2022 asutatud mitmekülgne loomekollektiiv.',
			link: 'https://dysaster.ee',
			tags: [badges['asutaja'], badges['veeb']]
		},
		{
			name: 'monospac.ee',
			image: {
				src: monospaceeImg,
				credit: {
					type: 'instagram',
					author: 'Liisa Jõhvik',
					href: 'https://www.instagram.com/liisajohvik.photo/'
				},
				alt: 'DJ duo monospacee nende Silent Disco setil Tartu Uus Teater saalis aastal 2024. Pilt on külje pealt, esiplaanil DJ Mimmu ja ta tagant paistab DJ Rx. Nad on valgustatud punasesega, taustal häguselt näha siniselt valgustatud kolmandat DJd.'
			},
			description: 'DJ duo kaasliikmega Rx.',
			link: 'https://monospac.ee',
			tags: [badges['muusika'], badges['veeb']]
		},
		{
			name: 'Saueagu Teatritalu',
			image: {
				src: saueauguImg,
				alt: 'Suvine Saueaugu teatrihoone. All paistab roheline muru ja katuse tagant paistab paari pilvega sinine taevas.'
			},
			description: 'Taluteater Läänemaal. Tegin veebilehe.',
			link: 'https://saueaugu.ee',
			tags: [badges['veeb']]
		},
		{
			name: 'Tartu Häkkerikoda',
			image: {
				src: '/assets/hakkerikoda.svg',
				credit: {
					type: 'web',
					author: 'treierxyz',
					href: 'https://treier.xyz'
				},
				alt: 'Tartu Häkkerikoda logo'
			},
			description: 'Makerspace Tartus. Liige ning osa veebilehe loojatest.',
			link: 'https://hakkerikoda.ee',
			tags: [badges['veeb']]
		}
	];
</script>

{#snippet projectCard(
	name: string,
	description: string,
	image: EnhancedImage,
	tags: Tag[],
	link: string
)}
	<div class="mb-16 w-80 space-y-3 md:w-64">
		<Image {image} {tags} class="aspect-[4/5] object-cover" />
		<div class="grid grid-cols-[1fr_auto] items-center text-sm">
			<div class="mt-2 pr-4">
				<h3 class="font-medium leading-none">{name}</h3>
				<p class="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
			</div>
			<Button target="_blank" href={link} variant="secondary" size="icon">
				<SquareArrowOutUpRight />
			</Button>
		</div>
	</div>
{/snippet}

<svelte:head>
	<title>Projektid | {site.name}</title>
	<meta property="og:title" content={'Projektid | ' + site.name} />

	<meta
		name="description"
		content="Projektid millega tegelenud, asjad mida teinud - tule uudista."
	/>
	<meta
		property="og:description"
		content="Projektid millega tegelenud, asjad mida teinud - tule uudista."
	/>

	<meta property="og:image" content={baseURL + site.image} />
</svelte:head>

<header class="mb-24 flex flex-col items-center text-center font-title">
	<h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
		Muud projektid
	</h1>
	<p class="text-xl font-semibold text-muted-foreground">
		Peale selle toreda saidi on mul veel palju hobisid
	</p>
</header>

<main class="flex w-full max-w-4xl flex-wrap justify-center gap-x-8">
	{#each projects as { name, description, image, tags, link }}
		{@render projectCard(name, description, image, tags, link)}
	{/each}
</main>
