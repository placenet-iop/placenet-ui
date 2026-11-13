<script>
	/**
	 * What an admin needs to know on arrival, before reading any section:
	 * 3-4 cards (label, value, one line) and, under them, the problems that
	 * need a look, each linking to where it is fixed. Never colour alone: a
	 * tone also changes the icon.
	 *
	 * @type {{ items: Array<{ label: string, value: string, detail?: string, tone?: 'neutral'|'ok'|'warn'|'danger' }>,
	 *   problems?: Array<{ text: string, actionLabel?: string, onaction?: () => void, href?: string }>,
	 *   problemsLabel?: string }}
	 */
	let { items, problems = [], problemsLabel = 'Requiere atención' } = $props();
</script>

<div class="pn-status">
	<ul class="cards">
		{#each items as item (item.label)}
			<li class="card tone-{item.tone || 'neutral'}">
				<span class="label">{item.label}</span>
				<span class="value">{item.value}</span>
				{#if item.detail}
					<span class="detail">
						{#if item.tone === 'ok'}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>{/if}
						{#if item.tone === 'warn' || item.tone === 'danger'}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>{/if}
						{item.detail}
					</span>
				{/if}
			</li>
		{/each}
	</ul>
	{#if problems.length}
		<section class="problems" aria-label={problemsLabel}>
			<span class="problems-title">{problemsLabel}</span>
			<ul>
				{#each problems as problem, i (i)}
					<li>
						<span>{problem.text}</span>
						{#if problem.actionLabel}
							{#if problem.href}
								<a href={problem.href}>{problem.actionLabel}</a>
							{:else}
								<button type="button" onclick={problem.onaction}>{problem.actionLabel}</button>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style>
	.pn-status {
		display: flex;
		flex-direction: column;
		gap: 12px;
		font-family: var(--pn-font);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 12px;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 16px;
		border-radius: var(--pn-radius);
		background: var(--pn-surface);
		border: 1px solid var(--pn-line);
	}
	.label {
		font-size: var(--pn-text-xs);
		font-weight: 500;
		color: var(--pn-ink-muted);
	}
	.value {
		font: 600 var(--pn-text-md) var(--pn-font-heading);
		color: var(--pn-ink-strong);
	}
	.detail {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--pn-ink-muted);
	}
	.tone-ok .detail {
		color: var(--pn-ok);
	}
	.tone-warn .detail {
		color: var(--pn-warn);
	}
	.tone-danger .detail {
		color: var(--pn-danger);
	}
	.tone-warn {
		border-color: color-mix(in srgb, var(--pn-warn) 35%, var(--pn-line));
	}
	.tone-danger {
		border-color: color-mix(in srgb, var(--pn-danger) 35%, var(--pn-line));
	}
	.problems {
		padding: 12px 16px;
		border-radius: var(--pn-radius);
		background: var(--pn-warn-soft);
		color: var(--pn-warn);
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.problems-title {
		font-weight: 600;
		font-size: var(--pn-text-sm);
	}
	.problems li {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		align-items: baseline;
		font-size: var(--pn-text-sm);
		color: var(--pn-ink);
	}
	.problems a,
	.problems button {
		border: 0;
		background: none;
		padding: 0;
		color: var(--pn-accent-text);
		font: 600 var(--pn-text-sm) var(--pn-font);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
</style>
