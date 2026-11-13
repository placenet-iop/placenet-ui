<script>
	/**
	 * Where a section says its changes landed: "Guardando…", "Guardado"
	 * (fades after a few seconds), "No se guardó · Reintentar", or "Sin
	 * guardar: <why>" for a draft the app refuses to send (no tab ticked…).
	 * Drive it with a SaveState (src/admin/save.svelte.js).
	 *
	 * @type {{ state: { status: 'idle'|'saving'|'saved'|'error'|'invalid', message?: string, retry?: () => void },
	 *   labels?: { saving?: string, saved?: string, error?: string, retry?: string, invalid?: string } }}
	 */
	let { state, labels = {} } = $props();
	const l = $derived({ saving: 'Guardando…', saved: 'Guardado', error: 'No se guardó', retry: 'Reintentar', invalid: 'Sin guardar', ...labels });
</script>

<span class="pn-save status-{state.status}" role="status" aria-live="polite">
	{#if state.status === 'saving'}
		<span class="spin" aria-hidden="true"></span>{l.saving}
	{:else if state.status === 'saved'}
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>{l.saved}
	{:else if state.status === 'error'}
		{state.message || l.error}
		{#if state.retry}<button type="button" onclick={state.retry}>{l.retry}</button>{/if}
	{:else if state.status === 'invalid'}
		{l.invalid}{state.message ? `: ${state.message}` : ''}
	{/if}
</span>

<style>
	.pn-save {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 20px;
		font: 500 13px var(--pn-font);
		color: var(--pn-ink-muted);
		white-space: nowrap;
	}
	.status-saved {
		color: var(--pn-ok);
	}
	.status-error {
		color: var(--pn-danger);
		white-space: normal;
	}
	.status-invalid {
		color: var(--pn-warn);
		white-space: normal;
	}
	button {
		border: 0;
		background: none;
		padding: 0;
		color: inherit;
		font: 700 13px var(--pn-font);
		text-decoration: underline;
		cursor: pointer;
	}
	.spin {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid currentColor;
		border-right-color: transparent;
		animation: pn-spin 0.8s linear infinite;
	}
	@keyframes pn-spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
