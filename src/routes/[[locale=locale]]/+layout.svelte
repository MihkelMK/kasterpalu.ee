<script lang="ts">
  import '../../app.css';

  import '@fontsource-variable/kode-mono/index.css';
  import '@fontsource-variable/smooch-sans/index.css';

  import { resolve } from '$app/paths';
  import { site } from '$lib/config';
  import { mode, ModeWatcher, setMode } from 'mode-watcher';
  import { onMount } from 'svelte';

  import { m } from '$lib/paraglide/messages';
  import { getLocale, setLocale } from '$lib/paraglide/runtime';
  import LaptopMinimal from '@lucide/svelte/icons/laptop-minimal';

  import { Button } from '$lib/components/ui/button/index.js';
  import Moon from '@lucide/svelte/icons/moon';
  import Sun from '@lucide/svelte/icons/sun';

  let { children } = $props();
  let email: string | undefined = $state(undefined);
  let otherLocale: 'en' | 'et' = $derived(getLocale() === 'en' ? 'et' : 'en');

  const cycleTheme = () => {
    if (mode.current === 'dark') {
      setMode('light');
    } else if (mode.current === 'light') {
      setMode('system');
    } else {
      setMode('dark');
    }
  };

  onMount(() => {
    email = site.email;
  });
</script>

<svelte:head>
  <meta name="author" content={site.author} />
</svelte:head>

<ModeWatcher />

<div class="grid min-h-screen grid-rows-[auto_1fr_auto]">
  <header class="container grid w-full grid-cols-[1fr_auto_1fr] items-center px-8 py-6">
    <a href={resolve('/[[locale=locale]]', { locale: getLocale() })}>
      <img src="/favicon.svg" alt="Mihkel Martin Kasterpalu logo" class="h-9" />
    </a>

    <a
      class="font-mono font-medium underline underline-offset-4"
      href={resolve('/[[locale=locale]]/vinge', { locale: getLocale() })}>
      {m.nav_vinge()}
    </a>

    <div class="flex justify-self-end">
      <Button onclick={() => setLocale(otherLocale)} variant="ghost" size="icon" class="h-12 w-12">
        <p>{getLocale()}</p>

        <span class="sr-only">{m.change_locale({ locale: otherLocale })}</span>
      </Button>
      <Button onclick={() => cycleTheme()} variant="ghost" size="icon" class="h-12 w-12">
        {#if mode.current === 'dark'}
          <Moon class="h-6! w-6!" />
        {:else if mode.current === 'light'}
          <Sun class="h-6! w-6!" />
        {:else}
          <LaptopMinimal class="h-6! w-6!" />
        {/if}

        <span class="sr-only">{m.change_theme()}</span>
      </Button>
    </div>
  </header>

  <div class="relative container mt-16 flex flex-col items-center">
    {@render children()}
  </div>

  <footer class="container flex w-full justify-between px-9 py-6">
    <a
      href="https://github.com/MihkelMK/kasterpalu.ee"
      target="_blank"
      rel="external"
      class="text-sm text-muted-foreground underline underline-offset-4">
      {m.nav_source()}
    </a>

    {#if email}
      <a
        href="mailto://{email}"
        rel="external"
        target="_blank"
        class="text-right text-sm text-muted-foreground underline underline-offset-4">
        {email}
      </a>
    {:else}
      <p class="text-sm text-muted-foreground">&lt;email_protected&gt;</p>
    {/if}
  </footer>
</div>
