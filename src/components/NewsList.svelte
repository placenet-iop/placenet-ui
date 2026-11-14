<script>
	/**
	 * A news page: filters on top, the first item featured, the rest as rows.
	 * Empty and filtered-empty states are the app's words (`empty`).
	 *
	 * Items: { id, title, href?, image?, meta?, source?, unread?, badge?, placeholder?, onimageerror? }.
	 * With `filters`, items are filtered by `item.source === filter` (the
	 * value 'all' shows everything).
	 *
	 * @type {{ items: Array<{ id: string, title: string, href?: string, image?: string, meta?: string,
	 *     source?: string, unread?: boolean, badge?: string }>,
	 *   filters?: Array<{ value: string, label: string }>, filter?: string, filtersLabel?: string,
	 *   featured?: boolean, empty?: string, unreadLabel?: string,
	 *   onopen?: (item: any, event: MouseEvent) => void }}
	 */
	import FilterPills from './FilterPills.svelte';
	import NewsCard from './NewsCard.svelte';

	let {
		items,
		filters = [],
		filter = $bindable('all'),
		filtersLabel = 'Filtrar',
		featured = true,
		empty = '',
		unreadLabel = 'Sin leer',
		onopen
	} = $props();

	const shown = $derived(filter === 'all' || !filters.length ? items : items.filter((item) => item.source === filter));
	const top = $derived(featured ? shown[0] : null);
	const rest = $derived(featured ? shown.slice(1) : shown);
	const open = (item) => (onopen ? (event) => onopen(item, event) : undefined);
</script>

<div class="pn-news">
	{#if filters.length > 1}
		<FilterPills items={filters} bind:value={filter} ariaLabel={filtersLabel} />
	{/if}
	{#if !shown.length}
		{#if empty}<p class="empty">{empty}</p>{/if}
	{:else}
		{#if top}
			<NewsCard variant="featured" title={top.title} href={top.href} image={top.image} meta={top.meta} badge={top.badge} onimageerror={top.onimageerror} onclick={open(top)} />
		{/if}
		{#if rest.length}
			<ul>
				{#each rest as item (item.id)}
					<li>
						<NewsCard
							title={item.title}
							href={item.href}
							image={item.image}
							meta={item.meta}
							unread={item.unread}
							placeholder={item.placeholder}
							onimageerror={item.onimageerror}
							{unreadLabel}
							onclick={open(item)}
						/>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</div>

<style>
	.pn-news {
		display: flex;
		flex-direction: column;
		gap: 14px;
		font-family: var(--pn-font);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li + li {
		border-top: 1px solid var(--pn-line);
	}
	.empty {
		margin: 24px 0;
		text-align: center;
		color: var(--pn-ink-muted);
		font-size: var(--pn-text-sm);
	}
</style>
