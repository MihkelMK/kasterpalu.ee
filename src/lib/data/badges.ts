import { m } from '$lib/paraglide/messages';
import type { TagsObj } from '$lib/types';

const badges: TagsObj = {
  muusika: { name: m.badge_music_name(), description: m.badge_music_desc() },
  veeb: { name: m.badge_web_name(), description: m.badge_web_desc() },
  asutaja: { name: m.badge_founder_name(), description: m.badge_founder_desc() },
};

export default badges;
