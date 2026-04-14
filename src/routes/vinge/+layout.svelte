<script lang="ts">
  import { baseURL, site, stuffSite } from '$lib/config.js';

  import { Toaster } from '$lib/components/ui/sonner/index.js';

  let { children, data } = $props();

  const title = $derived(`${data.name || stuffSite.name} | ${site.name}`);
  const description = $derived(data?.description || stuffSite.description);
  const ogImage = $derived(data?.image || stuffSite.image);
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />

  <meta name="description" content={description} />
  <meta property="og:description" content={description} />

  <meta property="og:image" content={baseURL + ogImage} />
</svelte:head>

<Toaster position="top-center" />

{@render children()}

{#if data?.name === 'Vau kui vali'}
  <style global>
    html {
      --scrollbar-color-thumb: transparent;
      --scrollbar-color-track: transparent;
      --scrollbar-width: none;
      --scrollbar-width-legacy: 0px;

      -ms-overflow-style: none; /* Internet Explorer 10+ */
    }
  </style>
{/if}
