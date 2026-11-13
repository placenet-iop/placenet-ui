<script>
	/**
	 * The ONE way an admin page says "this follows the organisation unless
	 * you change it here": replaces tri-state selects ("Igual que la
	 * organización (X)"), "sobrescribe", "anulación", "configuración propia".
	 *
	 *   inherited   [label]  value in grey   [Como la organización]  Personalizar
	 *   custom      [label]  editor (children) [Personalizado]        Restablecer
	 *
	 * The app decides what Personalizar / Restablecer do (show the editor,
	 * post a clear action). Restablecer can be a form button: pass
	 * `resetAction` (a form action URL) and it posts there.
	 *
	 * @type {{ label: string, description?: string, inheritedValue?: string, custom: boolean,
	 *   inheritedLabel?: string, customLabel?: string, customizeLabel?: string, resetLabel?: string,
	 *   oncustomize?: () => void, onreset?: () => void, resetAction?: string,
	 *   disabled?: boolean, children?: import('svelte').Snippet }}
	 */
	let {
		label,
		description = '',
		inheritedValue = '',
		custom,
		inheritedLabel = 'Como la organización',
		customLabel = 'Personalizado',
		customizeLabel = 'Personalizar',
		resetLabel = 'Restablecer',
		oncustomize,
		onreset,
		resetAction = '',
		disabled = false,
		children
	} = $props();
</script>

<div class="pn-inherit" class:custom>
	<div class="row">
		<div class="text">
			<span class="label">{label}</span>
			{#if description}<span class="description">{description}</span>{/if}
			{#if !custom && inheritedValue}<span class="value">{inheritedValue}</span>{/if}
		</div>
		<span class="badge">{custom ? customLabel : inheritedLabel}</span>
		{#if custom}
			{#if resetAction}
				<button type="submit" class="link muted" formaction={resetAction} formnovalidate data-no-autosave {disabled}>{resetLabel}</button>
			{:else}
				<button type="button" class="link muted" onclick={onreset} {disabled}>{resetLabel}</button>
			{/if}
		{:else}
			<button type="button" class="link" onclick={oncustomize} {disabled}>{customizeLabel}</button>
		{/if}
	</div>
	{#if custom && children}<div class="editor">{@render children()}</div>{/if}
</div>

<style>
	.pn-inherit {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 14px 0;
		border-top: 1px solid var(--pn-line);
		font-family: var(--pn-font);
	}
	.pn-inherit:first-child {
		border-top: 0;
		padding-top: 0;
	}
	.row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px 12px;
	}
	.text {
		flex: 1;
		min-width: 200px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.label {
		font-size: var(--pn-text-sm);
		font-weight: 500;
		color: var(--pn-ink-strong);
	}
	.description,
	.value {
		font-size: 13px;
		color: var(--pn-ink-muted);
	}
	.badge {
		display: inline-flex;
		align-items: center;
		height: 24px;
		padding: 0 10px;
		border-radius: 999px;
		font-size: var(--pn-text-xs);
		font-weight: 600;
		white-space: nowrap;
		background: var(--pn-surface-muted);
		color: var(--pn-ink-muted);
	}
	.custom .badge {
		background: var(--pn-accent-soft);
		color: var(--pn-accent-text);
	}
	.link {
		min-height: 32px;
		border: 0;
		background: none;
		padding: 0 2px;
		color: var(--pn-accent-text);
		font: 600 var(--pn-text-sm) var(--pn-font);
		cursor: pointer;
	}
	.link.muted {
		color: var(--pn-ink-muted);
		font-weight: 500;
	}
	.link:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.link:focus-visible {
		outline: 2px solid var(--pn-focus);
		outline-offset: 2px;
		border-radius: 4px;
	}
	.editor {
		padding: 12px 14px;
		border-radius: var(--pn-radius);
		background: var(--pn-accent-soft);
	}
</style>
