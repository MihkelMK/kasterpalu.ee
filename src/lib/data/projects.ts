import { ImageCreditType, type Project } from '$lib/types';
import badges from './badges';

import skpImg from '$lib/assets/skp.jpg?enhanced';
import dysasterImg from '$lib/assets/dysaster.jpg?enhanced';
import monospaceeImg from '$lib/assets/monospacee.jpg?enhanced';
import saueauguImg from '$lib/assets/saueaugu.jpg?enhanced';

const projects: Project[] = [
	{
		name: 'SUPIKÖÖGIPOSID',
		image: {
			src: skpImg,
			credit: {
				type: ImageCreditType.instagram,
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
				type: ImageCreditType.instagram,
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
				type: ImageCreditType.instagram,
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
				type: ImageCreditType.web,
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

export default projects;
