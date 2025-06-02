<script lang="ts">
	import type { PageData } from './$types.js';

	import { MediaQuery } from 'svelte/reactivity';

	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	import { goto } from '$app/navigation';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';

	let { data }: { data: PageData } = $props();

	const isDesktop = new MediaQuery('(min-width: 768px)');
	const siblingCount = $derived(isDesktop.current ? 1 : 0);
</script>

<header class="font-title mt-24 mb-12 flex flex-col items-center text-center">
	<h1 class="mb-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Mida rahvas teab?
	</h1>
</header>

<div class="h-full w-full max-w-prose">
	{#await data.streamed.archive}
		<div class="space-y-6">
			{#each { length: 5 }}
				<Skeleton class="h-13 w-full rounded-lg" />
			{/each}
			<Skeleton class="mx-auto mt-8! h-12 w-2/3 rounded-lg" />
		</div>
	{:then archive}
		<Accordion.Root type="multiple" class="space-y-6">
			{#each archive.data as question (question.id)}
				<Accordion.Item disabled={!(question.answers?.length > 0)} value={question.id}>
					<Accordion.Trigger>{question.content}?</Accordion.Trigger>
					<Accordion.Content>
						{#each question.answers as answer (answer.id)}
							<blockquote class="bg-muted/25 border-l-2 pl-4 leading-7 italic not-first:mt-3">
								{answer.content}
							</blockquote>
						{/each}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
		<Pagination.Root
			onPageChange={(value: number) => {
				goto(`?leht=${value}`);
			}}
			count={archive.meta.total}
			perPage={data.pageSize}
			page={data.page}
			{siblingCount}
			class="my-8"
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content class="flex items-center">
					<Pagination.Item>
						<Pagination.PrevButton
							class="hover:bg-dark-10 disabled:text-muted-foreground inline-flex size-6 items-center justify-center rounded-lg bg-transparent active:scale-98 disabled:cursor-not-allowed hover:disabled:bg-transparent sm:size-10 md:mr-4"
						>
							<ChevronLeft class="size-4 sm:size-6" />
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
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
					</div>
					<Pagination.Item>
						<Pagination.NextButton
							class="hover:bg-dark-10 disabled:text-muted-foreground inline-flex size-6 items-center justify-center rounded-lg bg-transparent active:scale-98 disabled:cursor-not-allowed hover:disabled:bg-transparent sm:size-10 md:ml-4"
						>
							<ChevronRight class="size-4 sm:size-6" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/await}
</div>
