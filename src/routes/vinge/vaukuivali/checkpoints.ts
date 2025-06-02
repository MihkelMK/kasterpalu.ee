import { ImageCreditType, type SoundCheckpoint } from '$lib/types';

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
import { m } from '$lib/paraglide/messages';

export const soundCheckpoints: Record<number, SoundCheckpoint> = {
	0: {
		title: m['games.vaukuivali.checkpoints.0.title'](),
		description: m['games.vaukuivali.checkpoints.0.description'](),
		image: undefined
	},
	30: {
		title: m['games.vaukuivali.checkpoints.30.title'](),
		description: m['games.vaukuivali.checkpoints.30.description'](),
		image: {
			src: roomImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Kam Idris',
				href: 'https://unsplash.com/@ka_idris'
			},
			alt: m['games.vaukuivali.checkpoints.30.alt']()
		}
	},
	40: {
		title: m['games.vaukuivali.checkpoints.40.title'](),
		description: m['games.vaukuivali.checkpoints.40.description'](),
		image: {
			src: watchImg,
			credit: {
				type: ImageCreditType.web,
				author: 'János Venczák',
				href: 'https://unsplash.com/@venczakjanos'
			},
			alt: m['games.vaukuivali.checkpoints.40.alt']()
		}
	},
	50: {
		title: m['games.vaukuivali.checkpoints.50.title'](),
		description: m['games.vaukuivali.checkpoints.50.description'](),
		image: {
			src: convoImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Toa Heftiba',
				href: 'https://unsplash.com/@heftiba'
			},
			alt: m['games.vaukuivali.checkpoints.50.alt']()
		}
	},
	60: {
		title: m['games.vaukuivali.checkpoints.60.title'](),
		description: m['games.vaukuivali.checkpoints.60.description'](),
		image: {
			src: gennImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Laila Kaasik',
				href: 'https://tartu.postimees.ee/8154041/lallavad-pidutsejad-panid-tartu-otsima-tasakaalu-ooelu-ja-oorahu-vahel'
			},
			alt: m['games.vaukuivali.checkpoints.60.alt']()
		}
	},
	70: {
		title: m['games.vaukuivali.checkpoints.70.title'](),
		description: m['games.vaukuivali.checkpoints.70.description'](),
		image: {
			src: tvImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Jonas Leupe',
				href: 'https://unsplash.com/@jonasleupe'
			},
			alt: m['games.vaukuivali.checkpoints.70.alt']()
		}
	},
	80: {
		title: m['games.vaukuivali.checkpoints.80.title'](),
		description: m['games.vaukuivali.checkpoints.80.description'](),
		image: {
			src: trafficImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Google Street View',
				href: 'https://maps.app.goo.gl/ZfADP4LnUid7d571A'
			},
			alt: m['games.vaukuivali.checkpoints.80.alt']()
		}
	},
	90: {
		title: m['games.vaukuivali.checkpoints.90.title'](),
		description: m['games.vaukuivali.checkpoints.90.description'](),
		image: {
			src: harleyImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Harley-Davidson',
				href: 'https://unsplash.com/@harleydavidson'
			},
			alt: m['games.vaukuivali.checkpoints.90.alt']()
		}
	},
	100: {
		title: m['games.vaukuivali.checkpoints.100.title'](),
		description: m['games.vaukuivali.checkpoints.100.description'](),
		image: {
			src: landingImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Scott Fillmer',
				href: 'https://unsplash.com/@scottfillmer'
			},
			alt: m['games.vaukuivali.checkpoints.100.alt']()
		}
	},
	110: {
		title: m['games.vaukuivali.checkpoints.110.title'](),
		description: m['games.vaukuivali.checkpoints.110.description'](),
		image: {
			src: carCrashImg,
			credit: {
				type: ImageCreditType.instagram,
				author: 'Jordan Besson',
				href: 'https://www.instagram.com/mr.blue.photographie'
			},
			alt: m['games.vaukuivali.checkpoints.110.alt']()
		}
	},
	120: {
		title: m['games.vaukuivali.checkpoints.120.title'](),
		description: m['games.vaukuivali.checkpoints.120.description'](),
		image: {
			src: chainsawImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Benjamin Jopen',
				href: 'https://unsplash.com/@benjopen'
			},
			alt: m['games.vaukuivali.checkpoints.120.alt']()
		}
	},
	130: {
		title: m['games.vaukuivali.checkpoints.130.title'](),
		description: m['games.vaukuivali.checkpoints.130.description'](),
		image: {
			src: jetImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Colin Lloyd',
				href: 'https://unsplash.com/@onthesearchforpineapples'
			},
			alt: m['games.vaukuivali.checkpoints.130.alt']()
		}
	},
	150: {
		title: m['games.vaukuivali.checkpoints.150.title'](),
		description: m['games.vaukuivali.checkpoints.150.description'](),
		image: {
			src: hearingaidImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Mark Paton',
				href: 'https://unsplash.com/@heftiba'
			},
			alt: m['games.vaukuivali.checkpoints.150.alt']()
		}
	}
};
