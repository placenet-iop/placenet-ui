<script>
	/**
	 * The dashboard's Switch (track 48x24, theme/css/switch.module.css) over a
	 * real checkbox, so it posts with its form like one. Label and one line of
	 * description beside it, clickable.
	 *
	 * @type {{ name?: string, checked?: boolean, value?: string, label: string, description?: string,
	 *   disabled?: boolean, onchange?: (e: Event) => void }}
	 */
	let { name = undefined, checked = $bindable(false), value = 'on', label, description = '', disabled = false, onchange } = $props();
	const uid = $props.id();
</script>

<label class="pn-switch" class:disabled for="pn-sw-{uid}">
	<input id="pn-sw-{uid}" type="checkbox" role="switch" {name} {value} bind:checked {disabled} {onchange} aria-describedby={description ? `pn-sw-d-${uid}` : undefined} />
	<span class="track" aria-hidden="true"><span class="thumb"></span></span>
	<span class="text">
		<span class="label">{label}</span>
		{#if description}<span class="description" id="pn-sw-d-{uid}">{description}</span>{/if}
	</span>
</label>

<style>
	.pn-switch {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 12px;
		cursor: pointer;
		font-family: var(--pn-font);
	}
	.pn-switch.disabled {
		cursor: not-allowed;
	}
	input {
		position: absolute;
		opacity: 0;
		width: 48px;
		height: 24px;
		margin: 0;
	}
	.track {
		flex-shrink: 0;
		position: relative;
		width: 48px;
		height: 24px;
		border-radius: 999px;
		background: var(--pn-line);
		border: 1px solid var(--pn-line-strong);
		box-sizing: border-box;
		transition: background-color 0.15s ease;
	}
	.thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--pn-surface);
		box-shadow: 0 1px 2px rgba(0, 1, 34, 0.25);
		transition: transform 0.15s ease;
	}
	input:checked + .track {
		background: var(--pn-accent);
		border-color: var(--pn-accent);
	}
	input:checked + .track .thumb {
		transform: translateX(24px);
	}
	input:disabled + .track {
		opacity: 0.55;
	}
	input:focus-visible + .track {
		outline: 2px solid var(--pn-focus);
		outline-offset: 2px;
	}
	.text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-top: 2px;
	}
	.label {
		font-size: var(--pn-text-sm);
		font-weight: 500;
		color: var(--pn-ink-strong);
	}
	.description {
		font-size: 13px;
		color: var(--pn-ink-muted);
	}
	@media (prefers-reduced-motion: reduce) {
		.track,
		.thumb {
			transition: none;
		}
	}
</style>
