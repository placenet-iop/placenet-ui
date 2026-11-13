<script>
	/**
	 * Nothing here yet, said plainly, with the one thing to do about it.
	 *
	 * @type {{ title: string, text?: string, actionLabel?: string, actionHref?: string, onaction?: () => void }}
	 */
	let { title, text = '', actionLabel = '', actionHref = '', onaction } = $props();
</script>

<div class="pn-empty">
	<strong>{title}</strong>
	{#if text}<span>{text}</span>{/if}
	{#if actionLabel}
		{#if actionHref}<a href={actionHref}>{actionLabel}</a>{:else}<button type="button" onclick={onaction}>{actionLabel}</button>{/if}
	{/if}
</div>

<style>
	.pn-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 28px 20px;
		border: 1px dashed var(--pn-line-strong);
		border-radius: var(--pn-radius);
		text-align: center;
		font: 400 var(--pn-text-sm) / 1.45 var(--pn-font);
		color: var(--pn-ink-muted);
	}
	strong {
		color: var(--pn-ink-strong);
		font-weight: 600;
	}
	a,
	button {
		margin-top: 6px;
		border: 0;
		background: none;
		padding: 0;
		color: var(--pn-accent-text);
		font: 600 var(--pn-text-sm) var(--pn-font);
		cursor: pointer;
	}
</style>
