import { m } from '$lib/paraglide/messages';
import type { TagsObj } from '$lib/types';

const badges: TagsObj = {
	muusika: { name: m['badges.music.name'](), description: m['badges.music.description']() },
	veeb: { name: m['badges.web.name'](), description: m['badges.web.description']() },
	asutaja: { name: m['badges.founder.name'](), description: m['badges.founder.description']() }
};

export default badges;
