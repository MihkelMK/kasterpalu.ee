<script lang="ts">
  import type { AlbumData } from '$lib/types';
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';

  import { enhance } from '$app/forms';
  import { expoIn, expoOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';

  import { m } from '$lib/paraglide/messages';
  import { ParaglideMessage } from '@inlang/paraglide-js-svelte';

  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';

  import LoaderCircle from '@lucide/svelte/icons/loader-circle';

  import { getAlbumClientState } from '$lib/client/pakubiiti/AlbumClientState.svelte';
  import DndGroup from '$lib/components/DNDGroup.svelte';

  let { data }: { data: PageData; form: FormData } = $props();

  let loading = $state(false);
  let submitting = $state(false);

  const clientState = getAlbumClientState();
</script>

{#snippet footer(loading: boolean)}
  <footer class="mt-8 flex items-center justify-evenly">
    <p class="font-title text-lg font-semibold">{m.score()}: {data.stage}</p>
    {#if loading || submitting}
      <Button disabled class="min-w-[4.4rem]">
        <LoaderCircle class="animate-spin" />
      </Button>
    {:else}
      <Button type="submit" class="min-w-[4.4rem]">{m.submit()}</Button>
    {/if}
    <p class="font-title text-lg font-semibold">{m.best()}: {data.highscore}</p>
  </footer>
{/snippet}

{#snippet playArea(albums: AlbumData | undefined, placeholder = false)}
  {#if placeholder}
    {#each { length: 3 }, i}
      <section class="grid grid-cols-3 gap-2 rounded-xl p-2 px-3 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-14">
        {#each { length: 3 }}
          {#if i < 2}
            <Skeleton class="h-20 w-full rounded-xl border border-primary/5" />
          {:else}
            <Skeleton class="aspect-square h-auto max-w-full rounded-xl object-cover" />
          {/if}
        {/each}
      </section>
      {#if i < 2}
        <Separator />
      {/if}
    {/each}
  {:else if albums}
    <DndGroup items={albums.names} type="names"></DndGroup>
    <Separator />
    <DndGroup items={albums.artists} type="artists"></DndGroup>
    <Separator />
    <DndGroup items={albums.images} image type="images"></DndGroup>
  {/if}
{/snippet}

<AlertDialog.Root open={data.playing === false || !!data.error}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>
        {#if data.error}
          {data.error.title}
        {:else if data?.highscore && data?.stage && data.highscore === data.stage}
          {m['pakubiiti.new_highscore']()}
        {:else}
          {m['pakubiiti.not_this_time']()}
        {/if}
      </AlertDialog.Title>
      <AlertDialog.Description>
        {#if data.error}
          {data.error.message}
        {:else if data.stage === 0}
          {m['pakubiiti.failed_on_first']()}
        {:else}
          <ParaglideMessage message={m['pakubiiti.correct_answers']} inputs={{ count: String(data.stage || 0) }}>
            {#snippet strong({ children }: { children?: Snippet })}
              <strong>{@render children?.()}</strong>
            {/snippet}
          </ParaglideMessage>
        {/if}
      </AlertDialog.Description>
    </AlertDialog.Header>
    {#if !data.error}
      <AlertDialog.Footer>
        <form action="?/restart" method="POST" use:enhance>
          <AlertDialog.Action type="submit">{m.try_again()}</AlertDialog.Action>
        </form>
      </AlertDialog.Footer>
    {/if}
  </AlertDialog.Content>
</AlertDialog.Root>

<header class="mb-16 flex flex-col items-center text-center font-title">
  <h1 class="mb-1 scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl">
    {m['pakubiiti.name']()}
  </h1>
  <p class="text-xl leading-7 font-semibold text-muted-foreground">
    {m['pakubiiti.instructions.main']()}
    <span class="text-[0px]">
      <span class="text-xl text-red-600 dark:text-red-400">
        {m['pakubiiti.instructions.names']()}
      </span>
      <span class="text-xl">,</span>
    </span>
    <span class="text-purple-600 dark:text-purple-400">
      {m['pakubiiti.instructions.artists']()}
    </span>
    {m.and()}
    <span class="text-[0px]">
      <span class="text-xl text-blue-600 dark:text-blue-400">
        {m['pakubiiti.instructions.pictures']()}
      </span>
      <span class="text-xl">.</span>
    </span>
  </p>
</header>
<main class="w-full max-w-4xl">
  <form
    action="?/submit"
    method="POST"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        await update();
        submitting = false;
      };
    }}
    class="grid w-full transition-all {loading || data?.playing === false ? 'grayscale' : ''} transition-colors">
    {#if data?.streamed?.albums}
      {#await data.streamed.albums}
        <div
          class="grid w-full gap-4"
          in:fade={{ duration: 150, easing: expoIn }}
          out:fade={{ duration: 150, easing: expoOut }}>
          {@render playArea(undefined, true)}
        </div>
        {@render footer(true)}
      {:then albums}
        {#if albums}
          <div class="grid w-full gap-4" in:fade={{ duration: 150, delay: 150, easing: expoOut }}>
            {@render playArea(albums as AlbumData)}
          </div>
          {@render footer(false)}
        {:else}
          <p class="mx-auto mt-16 max-w-prose text-center text-lg text-red-500">
            <ParaglideMessage message={m.error_server_title} inputs={{}}>
              {#snippet strong({ children }: { children?: Snippet })}
                <strong>{@render children?.()}</strong>
              {/snippet}
              {#snippet br()}
                <br />
              {/snippet}
            </ParaglideMessage>
          </p>
          <p class="mx-auto mt-6 max-w-prose text-center text-lg text-red-500">{m.error_server_body()}</p>
        {/if}
      {/await}
    {:else}
      <div class="grid w-full gap-4" out:fade={{ duration: 150, easing: expoOut }}>
        {@render playArea(clientState.albums)}
      </div>
      {@render footer(false)}
    {/if}
  </form>
</main>

<style>
  form > div {
    grid-area: 1/1;
  }
  form > footer {
    grid-area: 2/1;
  }
</style>
