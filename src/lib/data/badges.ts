import { m } from '$lib/paraglide/messages';
import type { TagsObj } from '$lib/types';

const badges: TagsObj = {
  muusika: { name: m.music(), description: m.badge_music() },
  veeb: { name: m.web(), description: m.badge_web() },
  asutaja: { name: m.founder(), description: m.badge_founder() },
};

export default badges;
