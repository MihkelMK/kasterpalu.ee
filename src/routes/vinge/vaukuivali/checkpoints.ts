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

export const soundCheckpoints: Record<number, SoundCheckpoint> = {
	0: {
		title: '',
		description: 'Kesket metsa mingis koopas, kedagi pole ümber',
		image: undefined
	},
	30: {
		title: '"Vaikus"',
		description: 'ehk elutoa pasiivne müra',
		image: {
			src: roomImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Kam Idris',
				href: 'https://unsplash.com/@ka_idris'
			},
			alt: 'Modernse ja minimalistliku disainiga siseruum.'
		}
	},
	40: {
		title: 'Tikk takk',
		description: 'Mehaanilise kella tiksumine (va täistundidel)',
		image: {
			src: watchImg,
			credit: {
				type: ImageCreditType.web,
				author: 'János Venczák',
				href: 'https://unsplash.com/@venczakjanos'
			},
			alt: 'Lahti võetud vanamoodne käekell. Näha on kella sisemust, hammasrattaid.'
		}
	},
	50: {
		title: 'Tava jutt',
		description: 'Rahulik vestlus kodus',
		image: {
			src: convoImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Toa Heftiba',
				href: 'https://unsplash.com/@heftiba'
			},
			alt: 'Noor paar köögis. Mees lõikab taldriku peal pannkooki, naine istub ta kõrval pliidi peal ja vaatab.'
		}
	},
	60: {
		title: 'Ma sain nurgad täis',
		description: 'Bingo õhtu Gennis (keset mängu)',
		image: {
			src: gennImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Laila Kaasik',
				href: 'https://tartu.postimees.ee/8154041/lallavad-pidutsejad-panid-tartu-otsima-tasakaalu-ooelu-ja-oorahu-vahel'
			},
			alt: 'Genialistide klubi tegutseb Tartus Magasini tänavas. Pilt on õhtusest ajast, rohkelt inimesti klubi välialal.'
		}
	},
	70: {
		title: 'Pult on kadunud',
		description: 'Telekas, mis mängib natuke liiga valjult',
		image: {
			src: tvImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Jonas Leupe',
				href: 'https://unsplash.com/@jonasleupe'
			},
			alt: 'Keegi vaatab televiisorist filmi. Esiplaanil fookuses teleka pult, tagaplaanil udune tuba, mille seina vastas on telekas.'
		}
	},
	80: {
		title: 'USAs oleks hullem',
		description: 'Riia mäe liiklus (ootad bussi Kaubamaja ees)',
		image: {
			src: trafficImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Google Street View',
				href: 'https://maps.app.goo.gl/ZfADP4LnUid7d571A'
			},
			alt: 'Aastal 2012 tehtud Google Street View pilt. Näha on Tartu Kaubamaja ning selle Riia tänava küljel olevat bussipeatust.'
		}
	},
	90: {
		title: 'USAs oleks rohkem',
		description: 'Harley sõidab sinust mööda',
		image: {
			src: harleyImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Harley-Davidson',
				href: 'https://unsplash.com/@harleydavidson'
			},
			alt: 'Uue välimusega Harley-Davidson mootorrattas sõidab kiiresti mööda sirget maanteed.'
		}
	},
	100: {
		title: 'Põgenesid terminalist',
		description: 'Boeing 707 1 meremiil enne maandumist',
		image: {
			src: landingImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Scott Fillmer',
				href: 'https://unsplash.com/@scottfillmer'
			},
			alt: 'Continental Airlines Boeing 777 maandub uduses Houston IAH lennujaamas.'
		}
	},
	110: {
		title: 'Maanteeraev',
		description: 'Autosignaal 1m kauguselt',
		image: {
			src: carCrashImg,
			credit: {
				type: ImageCreditType.instagram,
				author: 'Jordan Besson',
				href: 'https://www.instagram.com/mr.blue.photographie'
			},
			alt: 'Dramaatiline auto trikk filmi jaoks. Kahe auto kokkupõrge.'
		}
	},
	120: {
		title: 'Mootorsaag',
		description: 'Nüüd on juba valus. Soovitan kanda kõrvatroppe.',
		image: {
			src: chainsawImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Benjamin Jopen',
				href: 'https://unsplash.com/@benjopen'
			},
			alt: 'Oranži ja musta värvi mootorsega lõigatakse langenud puud väiksemateks tükkideks.'
		}
	},
	130: {
		title: 'Kuidas sa nii lähedale said?',
		description: 'Turboreaktiivmootoriga hävitaja lendutõus 15m kauguselt',
		image: {
			src: jetImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Colin Lloyd',
				href: 'https://unsplash.com/@onthesearchforpineapples'
			},
			alt: 'Kaheksa F-16 hävitajat lendavad koos formatsioonis taevas.'
		}
	},
	150: {
		title: 'Aia mu kõrvad',
		description: 'Tubli töö! Su trummikile rebenes!',
		image: {
			src: hearingaidImg,
			credit: {
				type: ImageCreditType.web,
				author: 'Mark Paton',
				href: 'https://unsplash.com/@heftiba'
			},
			alt: 'Lähivõte inimesest sisestamas oma kõrva kuuldeaparaati.'
		}
	}
};
