import { isLocale } from '$lib/paraglide/runtime';

export function match(param: string) {
  return isLocale(param);
}
