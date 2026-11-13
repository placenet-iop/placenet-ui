<script>
	/**
	 * A row of filters over a list (Todas · GOfit Home · Personas…). Scrolls
	 * sideways on a phone; the chosen pill takes the accent. Use it for "which
	 * subset", SegmentedControl for "which view".
	 *
	 * @type {{ items: Array<{ value: string, label: string, count?: number }>,
	 *   value: string, ariaLabel: string, onchange?: (value: string) => void }}
	 */
	let { items, value = $bindable(), ariaLabel, onchange } = $props();

	function choose(next) {
		if (next === value) return;
		value = next;
		onchange?.(next);
	}
</script>

<div class="pn-pills" role="group" aria-label={ariaLabel}>
	{#each items as item (item.value)}
		<button type="button" class:on={value === item.value} aria-pressed={value === item.value} onclick={() => choose(item.value)}>
			{item.label}
			{#if item.count !== undefined}<span class="count">{item.count}</span>{/if}
		</button>
	{/each}
</div>

<style>
	.pn-pills {
		display: flex;
		gap: 8px;
		overflow-x: auto;
		scrollbar-width: none;
		margin: 0 calc(-1 * var(--pn-gutter));
		padding: 2px var(--pn-gutter);
		font-family: var(--pn-font);
	}
	.pn-pills::-webkit-scrollbar {
		display: none;
	}
	button {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 36px;
		padding: 0 14px;
		border-radius: 999px;
		border: 1px solid var(--pn-line);
		background: var(--pn-surface);
		color: var(--pn-ink);
		font: 500 var(--pn-text-sm) var(--pn-font);
		white-space: nowrap;
		cursor: pointer;
	}
	button.on {
		background: var(--pn-accent);
		border-color: var(--pn-accent);
		color: var(--pn-on-accent);
		font-weight: 600;
	}
	.count {
		font-size: var(--pn-text-xs);
		opacity: 0.75;
	}
	button:focus-visible {
		outline: 2px solid var(--pn-accent);
		outline-offset: 2px;
	}
</style>
