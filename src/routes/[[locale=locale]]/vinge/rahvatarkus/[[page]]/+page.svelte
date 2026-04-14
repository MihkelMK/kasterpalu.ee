<script lang="ts">
  import type { PageData } from './$types.js';

  import * as Accordion from '$lib/components/ui/accordion/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Pagination from '$lib/components/ui/pagination/index.js';
  import ChevronLeft from '@lucide/svelte/icons/chevron-left';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';

  import { resolve } from '$app/paths';
  import { m } from '$lib/paraglide/messages.js';
  import { MediaQuery } from 'svelte/reactivity';
  import { getLocale } from '$lib/paraglide/runtime.js';

  let { data }: { data: PageData } = $props();

  const isDesktop = new MediaQuery('(min-width: 768px)');
  const siblingCount = $derived(isDesktop.current ? 1 : 0);
</script>

<div class="h-full w-full max-w-prose">
  <Accordion.Root type="multiple" class="space-y-6">
    {#each data.answers as question (question.id)}
      <Accordion.Item disabled={!(question.answers?.length > 0)} value={question.id}>
        <Accordion.Trigger>{question.content}?</Accordion.Trigger>
        <Accordion.Content>
          {#each question.answers as answer (answer.id)}
            <blockquote class="border-l-2 bg-muted/25 pl-4 leading-7 italic not-first:mt-3">
              {answer.content}
            </blockquote>
          {/each}
        </Accordion.Content>
      </Accordion.Item>
    {/each}
  </Accordion.Root>
  <Pagination.Root count={data.meta.total} perPage={data.pageSize} page={data.page} {siblingCount} class="my-8">
    {#snippet children({ pages, currentPage })}
      <Pagination.Content class="flex items-center">
        <Pagination.Item>
          <Pagination.PrevButton>
            {#snippet child({ props })}
              <Button
                {...props}
                variant="ghost"
                disabled={data.page === 1}
                aria-disabled={data.page === 1}
                aria-label={m.goto_previous()}
                data-sveltekit-noscroll
                class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                href={resolve('/[[locale=locale]]/vinge/rahvatarkus/[[page]]', {
                  page: String(data.page - 1),
                  locale: getLocale(),
                })}>
                <ChevronLeft />
                <span class="xs:block hidden">{m.previous()}</span>
              </Button>
            {/snippet}
          </Pagination.PrevButton>
        </Pagination.Item>
        <div class="flex items-center sm:gap-2.5">
          {#each pages as page (page.key)}
            {#if page.type === 'ellipsis'}
              <Pagination.Item>
                <Pagination.Ellipsis />
              </Pagination.Item>
            {:else}
              <Pagination.Item>
                <Pagination.Link {page} isActive={currentPage === page.value}>
                  {#snippet child({ props })}
                    <Button
                      {...props}
                      variant={props.isActive ? 'outline' : 'ghost'}
                      aria-current={props.isActive ? 'page' : undefined}
                      aria-label={m.goto_n({ amount: page.value })}
                      data-sveltekit-noscroll
                      href={resolve('/[[locale=locale]]/vinge/rahvatarkus/[[page]]', {
                        page: String(page.value),
                        locale: getLocale(),
                      })}>
                      {page.value}
                    </Button>
                  {/snippet}
                </Pagination.Link>
              </Pagination.Item>
            {/if}
          {/each}
        </div>
        <Pagination.Item>
          <Pagination.NextButton>
            {#snippet child({ props })}
              <Button
                {...props}
                variant="ghost"
                disabled={data.page === Math.ceil(data.meta.total / data.meta.limit)}
                aria-disabled={data.page === Math.ceil(data.meta.total / data.meta.limit)}
                aria-label={m.goto_next()}
                data-sveltekit-noscroll
                class="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                href={resolve('/[[locale=locale]]/vinge/rahvatarkus/[[page]]', {
                  page: String(data.page + 1),
                  locale: getLocale(),
                })}>
                <ChevronRight />
                <span class="xs:block hidden">{m.next()}</span>
              </Button>
            {/snippet}
          </Pagination.NextButton>
        </Pagination.Item>
      </Pagination.Content>
    {/snippet}
  </Pagination.Root>
</div>
