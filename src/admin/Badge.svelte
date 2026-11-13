<script>
	/**
	 * A short state word on a row or a title: "Como la organización",
	 * "Personalizado", "Principal", "App no instalada", "Activo".
	 * tone: neutral (inherited, plain fact), accent (customised here),
	 * ok / warn / danger (states; text, never colour alone).
	 *
	 * @type {{ tone?: 'neutral'|'accent'|'ok'|'warn'|'danger', children: import('svelte').Snippet }}
	 */
	let { tone = 'neutral', children } = $props();
</script>

<span class="pn-badge tone-{tone}">{@render children()}</span>

<style>
	.pn-badge {
		display: inline-flex;
		align-items: center;
		height: 24px;
		padding: 0 10px;
		border-radius: 999px;
		font: 600 var(--pn-text-xs) var(--pn-font);
		white-space: nowrap;
		vertical-align: middle;
	}
	.tone-neutral {
		background: var(--pn-surface-muted);
		color: var(--pn-ink-muted);
	}
	.tone-accent {
		background: var(--pn-accent-soft);
		color: var(--pn-accent-text);
	}
	.tone-ok {
		background: var(--pn-ok-soft);
		color: var(--pn-ok);
	}
	.tone-warn {
		background: var(--pn-warn-soft);
		color: var(--pn-warn);
	}
	.tone-danger {
		background: var(--pn-danger-soft);
		color: var(--pn-danger);
	}
</style>
