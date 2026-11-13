<script>
	/**
	 * A labelled input like the dashboard's (Mantine size md: 40px tall,
	 * radius 4, gray.4 border, 12px label above, gap 4). One component for the
	 * common kinds, so every admin form has the same fields:
	 *   kind 'text' | 'url' | 'email' | 'search' | 'number'   an <input>
	 *   kind 'textarea'                                         a <textarea>
	 *   kind 'select'                                           a <select> with `options`
	 *   kind 'secret'    a password that is never sent back: "•••• guardado ·
	 *                    Cambiar" until the admin chooses to replace it
	 *   kind 'copy'      read-only value with a Copy button (return address)
	 * Everything else (name, required, maxlength, rows…) goes to the control.
	 *
	 * @type {{ kind?: 'text'|'url'|'email'|'search'|'number'|'textarea'|'select'|'secret'|'copy',
	 *   label: string, description?: string, error?: string, value?: any,
	 *   options?: Array<{ value: string, label: string }>, hasValue?: boolean,
	 *   savedLabel?: string, changeLabel?: string, copyLabel?: string, copiedLabel?: string,
	 *   [key: string]: any }}
	 */
	let {
		kind = 'text',
		label,
		description = '',
		error = '',
		value = $bindable(''),
		options = [],
		hasValue = false,
		savedLabel = 'Guardado',
		changeLabel = 'Cambiar',
		copyLabel = 'Copiar',
		copiedLabel = 'Copiado',
		...rest
	} = $props();

	const uid = $props.id();
	const id = `pn-f-${uid}`;
	const describedBy = $derived([description && `${id}-d`, error && `${id}-e`].filter(Boolean).join(' ') || undefined);
	let replacing = $state(false);
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(String(value));
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			document.getElementById(id)?.select?.();
		}
	}
</script>

<div class="pn-field" class:has-error={!!error}>
	<label for={id}>{label}</label>
	{#if kind === 'textarea'}
		<textarea {id} bind:value aria-describedby={describedBy} aria-invalid={!!error || undefined} {...rest}></textarea>
	{:else if kind === 'select'}
		<div class="select">
			<select {id} bind:value aria-describedby={describedBy} aria-invalid={!!error || undefined} {...rest}>
				{#each options as option (option.value)}<option value={option.value}>{option.label}</option>{/each}
			</select>
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
		</div>
	{:else if kind === 'secret' && hasValue && !replacing}
		<div class="row">
			<span class="saved" {id}>•••• {savedLabel}</span>
			<button type="button" class="inline" onclick={() => (replacing = true)} data-no-autosave>{changeLabel}</button>
		</div>
	{:else if kind === 'secret'}
		<input {id} type="password" autocomplete="off" bind:value aria-describedby={describedBy} aria-invalid={!!error || undefined} {...rest} />
	{:else if kind === 'copy'}
		<div class="row">
			<input {id} type="text" readonly {value} aria-describedby={describedBy} class="mono" {...rest} />
			<button type="button" class="inline" onclick={copy} data-no-autosave>{copied ? copiedLabel : copyLabel}</button>
		</div>
	{:else}
		<input {id} type={kind} bind:value aria-describedby={describedBy} aria-invalid={!!error || undefined} {...rest} />
	{/if}
	{#if description}<span class="description" id="{id}-d">{description}</span>{/if}
	{#if error}<span class="error" id="{id}-e">{error}</span>{/if}
</div>

<style>
	.pn-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		font-family: var(--pn-font);
	}
	label {
		font-size: var(--pn-text-xs);
		font-weight: 400;
		color: var(--pn-ink);
	}
	input,
	select,
	textarea {
		width: 100%;
		box-sizing: border-box;
		min-height: var(--pn-input-h);
		padding: 0 12px;
		border: 1px solid var(--pn-line-strong);
		border-radius: var(--pn-radius-xs);
		background: var(--pn-surface);
		color: var(--pn-ink);
		font: 400 var(--pn-text-sm) var(--pn-font);
	}
	textarea {
		padding: 10px 12px;
		min-height: 96px;
		resize: vertical;
		line-height: 1.45;
	}
	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--pn-accent);
		box-shadow: 0 0 0 3px var(--pn-focus);
	}
	input[readonly] {
		background: var(--pn-surface-muted);
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
	}
	.has-error input,
	.has-error select,
	.has-error textarea {
		border-color: var(--pn-danger);
	}
	.select {
		position: relative;
	}
	select {
		appearance: none;
		padding-right: 40px;
		cursor: pointer;
	}
	.select svg {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: var(--pn-ink-muted);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.saved {
		flex: 1;
		min-height: var(--pn-input-h);
		display: flex;
		align-items: center;
		padding: 0 12px;
		border: 1px dashed var(--pn-line-strong);
		border-radius: var(--pn-radius-xs);
		color: var(--pn-ink-muted);
		font-size: var(--pn-text-sm);
	}
	.inline {
		flex-shrink: 0;
		min-height: var(--pn-input-h);
		padding: 0 12px;
		border: 0;
		border-radius: var(--pn-radius);
		background: var(--pn-accent-soft);
		color: var(--pn-accent-text);
		font: 600 var(--pn-text-sm) var(--pn-font);
		cursor: pointer;
	}
	.description {
		font-size: var(--pn-text-xs);
		color: var(--pn-ink-muted);
	}
	.error {
		font-size: var(--pn-text-xs);
		color: var(--pn-danger);
	}
</style>
