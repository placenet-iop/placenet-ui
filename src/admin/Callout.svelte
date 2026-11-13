<script>
	/**
	 * A notice inside a section ("Afecta a todos los dominios de la
	 * organización", "Factorial no deja leer los centros"), like the
	 * dashboard's Alert: one or two lines, optional action.
	 *
	 * @type {{ tone?: 'info'|'warn'|'danger'|'ok', title?: string,
	 *   actionLabel?: string, onaction?: () => void, actionHref?: string,
	 *   children: import('svelte').Snippet }}
	 */
	let { tone = 'info', title = '', actionLabel = '', onaction, actionHref = '', children } = $props();
</script>

<div class="pn-callout tone-{tone}" role={tone === 'danger' ? 'alert' : 'note'}>
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
		{#if tone === 'ok'}<path d="M20 6 9 17l-5-5" />{:else}<circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />{/if}
	</svg>
	<div class="text">
		{#if title}<strong>{title}</strong>{/if}
		<span>{@render children()}</span>
		{#if actionLabel}
			{#if actionHref}<a href={actionHref}>{actionLabel}</a>{:else}<button type="button" onclick={onaction}>{actionLabel}</button>{/if}
		{/if}
	</div>
</div>

<style>
	.pn-callout {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		padding: 12px 14px;
		border-radius: var(--pn-radius-sm);
		font: 400 var(--pn-text-sm) / 1.45 var(--pn-font);
		color: var(--pn-ink);
	}
	svg {
		flex-shrink: 0;
		margin-top: 1px;
	}
	.text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		align-items: flex-start;
	}
	strong {
		font-weight: 600;
	}
	.tone-info {
		background: var(--pn-info-soft);
	}
	.tone-info svg {
		color: var(--pn-info);
	}
	.tone-warn {
		background: var(--pn-warn-soft);
	}
	.tone-warn svg {
		color: var(--pn-warn);
	}
	.tone-danger {
		background: var(--pn-danger-soft);
	}
	.tone-danger svg {
		color: var(--pn-danger);
	}
	.tone-ok {
		background: var(--pn-ok-soft);
	}
	.tone-ok svg {
		color: var(--pn-ok);
	}
	a,
	button {
		margin-top: 4px;
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
