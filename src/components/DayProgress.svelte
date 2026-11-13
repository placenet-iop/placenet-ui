<script>
	/**
	 * "How much is left today": one bar instead of a list of today's segments.
	 * The kit has no words of its own: the app passes them already formatted in
	 * its language (`summary` = "3 h 41 min de 8 h", `detail` = "Te quedan…").
	 *
	 * - worked / expected in minutes; over 100% the extra shows in the ok tone
	 *   (overtime) and the bar is full.
	 * - expected 0 (day off, holiday): no bar, just `summary` / `detail`.
	 * - `state` 'paused' greys the fill (on a break).
	 *
	 * @type {{ title: string, summary: string, detail?: string, worked: number,
	 *   expected: number, state?: 'running' | 'paused' | 'idle' }}
	 */
	let { title, summary, detail = '', worked, expected, state = 'idle' } = $props();

	const pct = $derived(expected > 0 ? Math.min(100, Math.max(0, (worked / expected) * 100)) : 0);
	const over = $derived(expected > 0 && worked > expected);
</script>

<section class="pn-day" aria-label={title}>
	<div class="head">
		<span class="title">{title}</span>
		<span class="summary">{summary}</span>
	</div>
	{#if expected > 0}
		<div
			class="bar"
			role="progressbar"
			aria-valuemin="0"
			aria-valuemax={expected}
			aria-valuenow={Math.min(worked, expected)}
			aria-valuetext={summary}
		>
			<div class="fill" class:paused={state === 'paused'} class:over style="width: {pct}%"></div>
		</div>
	{/if}
	{#if detail}<p class="detail">{detail}</p>{/if}
</section>

<style>
	.pn-day {
		background: var(--pn-surface);
		border-radius: var(--pn-radius-card);
		box-shadow: var(--pn-shadow-card);
		padding: 18px 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-family: var(--pn-font);
		color: var(--pn-ink);
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		font-size: var(--pn-text-sm);
	}
	.title {
		font-weight: 600;
	}
	.summary {
		color: var(--pn-ink-muted);
		text-align: right;
	}
	.bar {
		height: 10px;
		border-radius: 999px;
		background: var(--pn-surface-muted);
		overflow: hidden;
	}
	.fill {
		height: 100%;
		border-radius: 999px;
		background: var(--pn-accent);
		transition: width 0.4s ease;
	}
	.fill.paused {
		background: var(--pn-line-strong);
	}
	.fill.over {
		background: var(--pn-ok);
	}
	.detail {
		margin: 0;
		font-size: 13px;
		color: var(--pn-ink-muted);
	}
	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
		}
	}
</style>
