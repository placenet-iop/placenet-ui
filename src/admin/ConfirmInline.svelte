<script>
	/**
	 * Remove / unlink / reset that asks first, in place: "¿Desvincular a X?
	 * Sí, desvincular · Cancelar". Never window.confirm (a WebView may not show
	 * it). The confirm button posts `action` with `fields` as hidden inputs
	 * (SvelteKit form action), or calls `onconfirm`.
	 *
	 * @type {{ label: string, question: string, confirmLabel: string, cancelLabel?: string,
	 *   action?: string, fields?: Record<string, string>, onconfirm?: () => void | Promise<void>,
	 *   enhance?: (form: HTMLFormElement, submit?: any) => any, busy?: boolean, tone?: 'danger'|'neutral' }}
	 */
	let {
		label,
		question,
		confirmLabel,
		cancelLabel = 'Cancelar',
		action = '',
		fields = {},
		onconfirm,
		enhance = () => {},
		busy = false,
		tone = 'danger'
	} = $props();
	let asking = $state(false);
	let working = $state(false);

	async function run() {
		working = true;
		try {
			await onconfirm?.();
		} finally {
			working = false;
			asking = false;
		}
	}
</script>

{#if !asking}
	<button type="button" class="trigger tone-{tone}" onclick={() => (asking = true)} data-no-autosave>{label}</button>
{:else if action}
	<form class="ask" method="POST" {action} use:enhance data-no-autosave>
		{#each Object.entries(fields) as [name, value] (name)}<input type="hidden" {name} {value} />{/each}
		<span>{question}</span>
		<button type="submit" class="yes tone-{tone}" disabled={busy}>{confirmLabel}</button>
		<button type="button" class="no" onclick={() => (asking = false)}>{cancelLabel}</button>
	</form>
{:else}
	<span class="ask" role="group">
		<span>{question}</span>
		<button type="button" class="yes tone-{tone}" disabled={busy || working} onclick={run}>{confirmLabel}</button>
		<button type="button" class="no" onclick={() => (asking = false)}>{cancelLabel}</button>
	</span>
{/if}

<style>
	.trigger,
	.yes,
	.no {
		min-height: 32px;
		padding: 0 12px;
		border: 0;
		border-radius: var(--pn-radius-sm);
		font: 600 var(--pn-text-sm) var(--pn-font);
		cursor: pointer;
	}
	.trigger {
		background: none;
		padding: 0 4px;
	}
	.trigger.tone-danger {
		color: var(--pn-danger);
	}
	.trigger.tone-neutral {
		color: var(--pn-ink-muted);
	}
	.ask {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		font: 400 var(--pn-text-sm) var(--pn-font);
		color: var(--pn-ink);
	}
	.yes.tone-danger {
		background: var(--pn-danger);
		color: var(--pn-on-strong);
	}
	.yes.tone-neutral {
		background: var(--pn-accent);
		color: var(--pn-on-accent);
	}
	.yes:disabled {
		opacity: 0.6;
		cursor: progress;
	}
	.no {
		background: var(--pn-surface-muted);
		color: var(--pn-ink);
		font-weight: 500;
	}
	button:focus-visible {
		outline: 2px solid var(--pn-focus);
		outline-offset: 2px;
	}
</style>
