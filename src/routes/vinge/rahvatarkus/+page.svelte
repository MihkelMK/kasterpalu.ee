<script lang="ts">
	import type { PageData } from './$types.js';

	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';

	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	$inspect(data);
</script>

{#await data.streamed.archive}
	<p>loading</p>
{:then archive}
	<Accordion.Root type="multiple" class="w-2/3 space-y-6">
		{#each archive.data as question}
			<Accordion.Item disabled={!(question.answers?.length > 0)} value={question.id}>
				<Accordion.Trigger>{question.content}?</Accordion.Trigger>
				<Accordion.Content>
					<ol class="ml-6 list-decimal [&>li]:mt-2">
						{#each question.answers as answer}
							<li>
								{answer.content}
							</li>
						{/each}
					</ol>
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
	>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
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
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/await}
