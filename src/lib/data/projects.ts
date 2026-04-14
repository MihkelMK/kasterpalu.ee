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
        author: 'Mimmu',
        href: 'https://www.instagram.com/musamimmu/',
      },
      alt: m['projects.SUPIKÖÖGIPOISID.image_alt'](),
    },
    description: m['projects.SUPIKÖÖGIPOISID.description'](),
    link: 'https://skpoisid.bandcamp.com/',
    tags: [badges['muusika']],
  },
  {
    name: 'Dysaster Collective',
    image: {
      src: dysasterImg,
      credit: {
        type: ImageCreditType.instagram,
        author: 'Mattias Mägi',
        href: 'https://www.instagram.com/mattias.mix/',
      },
      alt: m['projects.Dysaster Collective.image_alt'](),
    },
    description: m['projects.Dysaster Collective.description'](),
    link: 'https://dysaster.ee',
    tags: [badges['asutaja'], badges['veeb']],
  },
  {
    name: 'monospac.ee',
    image: {
      src: monospaceeImg,
      credit: {
        type: ImageCreditType.instagram,
        author: 'Liisa Jõhvik',
        href: 'https://www.instagram.com/liisajohvik.photo/',
      },
      alt: m['projects.monospac.ee.image_alt'](),
    },
    description: m['projects.monospac.ee.description'](),
    link: 'https://monospac.ee',
    tags: [badges['muusika'], badges['veeb']],
  },
  {
    name: 'Saueaugu Teatritalu',
    image: {
      src: saueauguImg,
      alt: m['projects.Saueaugu Teatritalu.image_alt'](),
    },
    description: m['projects.Saueaugu Teatritalu.description'](),
    link: 'https://saueaugu.ee',
    tags: [badges['veeb']],
  },
  {
    name: 'Tartu Häkkerikoda',
    image: {
      src: '/assets/hakkerikoda.svg',
      credit: {
        type: ImageCreditType.web,
        author: 'treierxyz',
        href: 'https://treier.xyz',
      },
      alt: m['projects.Tartu Häkkerikoda.image_alt'](),
    },
    description: m['projects.Tartu Häkkerikoda.description'](),
    link: 'https://hakkerikoda.ee',
    tags: [badges['veeb']],
  },
];

export default projects;
