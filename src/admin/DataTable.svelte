<script>
	/**
	 * A list an admin works through (domains, sites, people, rules), drawn like
	 * the dashboard's tables (theme/css/table.module.css): headers 14px/500 in
	 * gray.7, cells padded 16 (24 on the outer edges), the hovered row white
	 * with its text in the accent. Click a row to edit it in a SidePanel.
	 *
	 * - `columns`: [{ key, label, width?, align?, hideBelow? }]. `cell` snippet
	 *   renders a cell: cell(row, column); without it, row[column.key].
	 * - `search` filters with `matches(row, query)` (default: every column's
	 *   text). The count says "n de total".
	 * - `selectable`: a checkbox per row, `selected` (bindable Set of keys),
	 *   Shift+click selects a span; `bulk` snippet shows while some are ticked.
	 * - Under 600px the rows become stacked cards, each value with its label.
	 *
	 * @type {{ rows: any[], columns: Array<{ key: string, label: string, width?: string, align?: 'left'|'right'|'center', hideBelow?: number }>,
	 *   rowKey?: (row: any) => string, cell?: import('svelte').Snippet<[any, any]>,
	 *   onrowclick?: (row: any) => void, rowLabel?: (row: any) => string,
	 *   search?: boolean, searchLabel?: string, matches?: (row: any, query: string) => boolean,
	 *   countLabel?: (shown: number, total: number) => string,
	 *   selectable?: boolean, selected?: Set<string>, selectLabel?: (row: any) => string, selectAllLabel?: string,
	 *   bulk?: import('svelte').Snippet<[Set<string>]>, toolbar?: import('svelte').Snippet,
	 *   empty?: string, emptyFiltered?: string }}
	 */
	let {
		rows,
		columns,
		rowKey = (row) => String(row.id),
		cell,
		onrowclick,
		rowLabel = () => '',
		search = false,
		searchLabel = 'Buscar…',
		matches,
		countLabel = (shown, total) => `${shown} de ${total}`,
		selectable = false,
		selected = $bindable(new Set()),
		selectLabel = (row) => rowKey(row),
		selectAllLabel = 'Seleccionar todos',
		bulk,
		toolbar,
		empty = '',
		emptyFiltered = ''
	} = $props();

	let query = $state('');
	let lastTicked = null;

	const defaultMatch = (row, q) => columns.some((c) => String(row[c.key] ?? '').toLowerCase().includes(q));
	const shown = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter((row) => (matches || defaultMatch)(row, q));
	});
	const shownTicked = $derived(shown.filter((row) => selected.has(rowKey(row))).length);

	function tick(row, event) {
		const key = rowKey(row);
		const next = new Set(selected);
		const on = !next.has(key);
		if (event?.shiftKey && lastTicked) {
			const keys = shown.map(rowKey);
			const [a, b] = [keys.indexOf(lastTicked), keys.indexOf(key)].sort((x, y) => x - y);
			if (a >= 0) for (const k of keys.slice(a, b + 1)) on ? next.add(k) : next.delete(k);
		} else if (on) next.add(key);
		else next.delete(key);
		lastTicked = key;
		selected = next;
	}
	function tickAll() {
		const next = new Set(selected);
		const all = shownTicked === shown.length;
		for (const row of shown) all ? next.delete(rowKey(row)) : next.add(rowKey(row));
		selected = next;
	}
	function rowKeydown(event, row) {
		if (onrowclick && (event.key === 'Enter' || event.key === ' ') && event.target === event.currentTarget) {
			event.preventDefault();
			onrowclick(row);
		}
	}
	function indeterminate(node, value) {
		node.indeterminate = value;
		return { update: (v) => (node.indeterminate = v) };
	}
</script>

<div class="pn-table">
	{#if search || toolbar || (selectable && selected.size && bulk)}
		<div class="bar">
			{#if selectable && selected.size && bulk}
				<div class="bulk">{@render bulk(selected)}</div>
			{:else}
				{#if search}
					<input class="search" type="search" bind:value={query} placeholder={searchLabel} aria-label={searchLabel} />
				{/if}
				{#if toolbar}{@render toolbar()}{/if}
			{/if}
		</div>
	{/if}

	{#if !rows.length}
		{#if empty}<p class="empty">{empty}</p>{/if}
	{:else if !shown.length}
		<p class="empty">{emptyFiltered || empty}</p>
	{:else}
		<div class="scroll">
			<table>
				<thead>
					<tr>
						{#if selectable}
							<th class="check">
								<input type="checkbox" aria-label={selectAllLabel} checked={shownTicked === shown.length} use:indeterminate={shownTicked > 0 && shownTicked < shown.length} onclick={tickAll} />
							</th>
						{/if}
						{#each columns as column (column.key)}
							<th style:width={column.width} style:text-align={column.align} data-hide={column.hideBelow}>{column.label}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each shown as row (rowKey(row))}
						{@const key = rowKey(row)}
						<tr
							class:clickable={!!onrowclick}
							class:ticked={selected.has(key)}
							tabindex={onrowclick ? 0 : undefined}
							aria-label={onrowclick ? rowLabel(row) || undefined : undefined}
							onclick={(e) => {
								if (onrowclick && !e.target.closest('input, button, a, select, label')) onrowclick(row);
							}}
							onkeydown={(e) => rowKeydown(e, row)}
						>
							{#if selectable}
								<td class="check">
									<input type="checkbox" aria-label={selectLabel(row)} checked={selected.has(key)} onclick={(e) => tick(row, e)} />
								</td>
							{/if}
							{#each columns as column (column.key)}
								<td style:text-align={column.align} data-label={column.label} data-hide={column.hideBelow}>
									{#if cell}{@render cell(row, column)}{:else}{row[column.key] ?? ''}{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if search && query}<span class="count">{countLabel(shown.length, rows.length)}</span>{/if}
	{/if}
</div>

<style>
	.pn-table {
		display: flex;
		flex-direction: column;
		gap: 12px;
		font-family: var(--pn-font);
		color: var(--pn-ink);
	}
	.bar {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}
	.bulk {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
		padding: 8px 12px;
		border-radius: var(--pn-radius);
		background: var(--pn-accent-soft);
	}
	.search {
		flex: 1;
		min-width: 0;
		max-width: 320px;
		height: var(--pn-input-h);
		padding: 0 12px;
		border: 1px solid var(--pn-line-strong);
		border-radius: var(--pn-radius-xs);
		background: var(--pn-surface);
		color: var(--pn-ink);
		font: 400 var(--pn-text-sm) var(--pn-font);
	}
	.search:focus {
		outline: none;
		border-color: var(--pn-accent);
		box-shadow: 0 0 0 3px var(--pn-focus);
	}
	.scroll {
		overflow-x: auto;
		border: 1px solid var(--pn-line);
		border-radius: var(--pn-radius);
		background: var(--pn-bg);
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--pn-text-sm);
	}
	th {
		padding: 16px;
		text-align: left;
		font-weight: 500;
		color: var(--pn-ink-subtle);
		white-space: nowrap;
		border-bottom: 1px solid var(--pn-line);
	}
	td {
		padding: 16px;
		border-top: 1px solid var(--pn-line);
		vertical-align: middle;
	}
	tbody tr:first-child td {
		border-top: 0;
	}
	th:first-of-type,
	td:first-of-type {
		padding-left: 24px;
	}
	th:last-of-type,
	td:last-of-type {
		padding-right: 24px;
	}
	th.check,
	td.check {
		width: 20px;
		padding-right: 0;
	}
	tr.clickable {
		cursor: pointer;
	}
	tbody tr:hover,
	tbody tr:focus-visible {
		background: var(--pn-surface);
		color: var(--pn-accent-text);
		outline: none;
	}
	tbody tr.ticked {
		background: var(--pn-accent-soft);
	}
	input[type='checkbox'] {
		width: 18px;
		height: 18px;
		accent-color: var(--pn-accent);
		cursor: pointer;
	}
	.empty {
		margin: 0;
		padding: 24px;
		text-align: center;
		color: var(--pn-ink-muted);
		border: 1px dashed var(--pn-line-strong);
		border-radius: var(--pn-radius);
	}
	.count {
		font-size: 13px;
		color: var(--pn-ink-muted);
	}
	@media (max-width: 900px) {
		[data-hide='900'] {
			display: none;
		}
	}
	@media (max-width: 600px) {
		.scroll {
			border: 0;
			background: none;
		}
		thead {
			display: none;
		}
		table,
		tbody,
		tr,
		td {
			display: block;
		}
		tr {
			position: relative;
			margin-bottom: 8px;
			padding: 12px 14px;
			border: 1px solid var(--pn-line);
			border-radius: var(--pn-radius);
			background: var(--pn-surface);
		}
		td,
		td:first-of-type,
		td:last-of-type {
			padding: 2px 0;
			border: 0;
		}
		td:not(.check)::before {
			content: attr(data-label);
			display: block;
			font-size: var(--pn-text-xs);
			color: var(--pn-ink-muted);
		}
		td.check {
			position: absolute;
			right: 14px;
			top: 12px;
		}
		[data-hide] {
			display: none;
		}
	}
</style>
