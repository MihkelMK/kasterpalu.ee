<script lang="ts">
	import type { PageData } from './$types.js';

	import { MediaQuery } from 'svelte/reactivity';

	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';

	import { goto } from '$app/navigation';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';

	let { data }: { data: PageData } = $props();

	const isDesktop = new MediaQuery('(min-width: 768px)');
	const siblingCount = $derived(isDesktop.current ? 1 : 0);
</script>

<header class="mb-12 mt-24 flex flex-col items-center text-center font-title">
	<h1 class="mb-1 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Mida rahvas teab?
	</h1>
</header>

<div class="h-full w-full max-w-prose">
	{#await data.streamed.archive}
		<p>loading</p>
	{:then archive}
		<Accordion.Root type="multiple" class="space-y-6">
			{#each archive.data as question}
				<Accordion.Item disabled={!(question.answers?.length > 0)} value={question.id}>
					<Accordion.Trigger>{question.content}?</Accordion.Trigger>
					<Accordion.Content>
						{#each question.answers as answer}
							<blockquote
								class="border-l-2 bg-muted/25 pl-4 italic leading-7 [&:not(:first-child)]:mt-3"
							>
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
							class="hover:bg-dark-10 active:scale-98 inline-flex size-6 items-center justify-center rounded-lg bg-transparent disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent sm:size-10 md:mr-4"
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
								<Pagination.Item isVisible={currentPage === page.value}>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
					</div>
					<Pagination.Item>
						<Pagination.NextButton
							class="hover:bg-dark-10 active:scale-98 inline-flex size-6 items-center justify-center rounded-lg bg-transparent disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent sm:size-10 md:ml-4"
						>
							<ChevronRight class="size-4 sm:size-6" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/await}
</div>
