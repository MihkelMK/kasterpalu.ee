import { ImageCreditType, type Project } from '$lib/types';
import badges from './badges';

import skpImg from '$lib/assets/skp.jpg?enhanced';
import dysasterImg from '$lib/assets/dysaster.jpg?enhanced';
import monospaceeImg from '$lib/assets/monospacee.jpg?enhanced';
import saueauguImg from '$lib/assets/saueaugu.jpg?enhanced';
import { m } from '$lib/paraglide/messages';

const projects: Project[] = [
	{
		name: 'SUPIKÖÖGIPOISID',
		image: {
			src: skpImg,
			credit: {
				type: ImageCreditType.instagram,
				author: m['projects.SUPIKÖÖGIPOISID.image.credit.author'](),
				href: m['projects.SUPIKÖÖGIPOISID.image.credit.href']()
			},
			alt: m['projects.SUPIKÖÖGIPOISID.image.alt']()
		},
		description: m['projects.SUPIKÖÖGIPOISID.description'](),
		link: m['projects.SUPIKÖÖGIPOISID.link'](),
		tags: [badges['muusika']]
	},
	{
		name: 'Dysaster Collective',
		image: {
			src: dysasterImg,
			credit: {
				type: ImageCreditType.instagram,
				author: m['projects.Dysaster Collective.image.credit.author'](),
				href: m['projects.Dysaster Collective.image.credit.href']()
			},
			alt: m['projects.Dysaster Collective.image.alt']()
		},
		description: m['projects.Dysaster Collective.description'](),
		link: m['projects.Dysaster Collective.link'](),
		tags: [badges['asutaja'], badges['veeb']]
	},
	{
		name: 'monospac.ee',
		image: {
			src: monospaceeImg,
			credit: {
				type: ImageCreditType.instagram,
				author: m['projects.monospac.ee.image.credit.author'](),
				href: m['projects.monospac.ee.image.credit.href']()
			},
			alt: m['projects.monospac.ee.image.alt']()
		},
		description: m['projects.monospac.ee.description'](),
		link: m['projects.monospac.ee.link'](),
		tags: [badges['muusika'], badges['veeb']]
	},
	{
		name: 'Saueaugu Teatritalu',
		image: {
			src: saueauguImg,
			alt: m['projects.Saueaugu Teatritalu.image.alt']()
		},
		description: m['projects.Saueaugu Teatritalu.description'](),
		link: m['projects.Saueaugu Teatritalu.link'](),
		tags: [badges['veeb']]
	},
	{
		name: 'Tartu Häkkerikoda',
		image: {
			src: '/assets/hakkerikoda.svg',
			credit: {
				type: ImageCreditType.web,
				author: m['projects.Tartu Häkkerikoda.image.credit.author'](),
				href: m['projects.Tartu Häkkerikoda.image.credit.href']()
			},
			alt: m['projects.Tartu Häkkerikoda.image.alt']()
		},
		description: m['projects.Tartu Häkkerikoda.description'](),
		link: m['projects.Tartu Häkkerikoda.link'](),
		tags: [badges['veeb']]
	}
];

export default projects;
