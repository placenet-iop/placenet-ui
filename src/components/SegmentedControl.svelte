<script>
	/**
	 * 2-4 mutually exclusive views of the same thing (Nóminas · Horarios ·
	 * Otros; Chat | Guía; Agenda · Día · Semana · Mes). A radio group: arrow
	 * keys move, the selection follows. For filters over a list use FilterPills.
	 *
	 * Origin: assist/src/lib/guide/GuideSwitch.svelte.
	 *
	 * @type {{ options: Array<{ value: string, label: string }>, value: string,
	 *   ariaLabel: string, onchange?: (value: string) => void }}
	 */
	let { options, value = $bindable(), ariaLabel, onchange } = $props();

	let buttons = $state([]);

	function choose(next) {
		if (next === value) return;
		value = next;
		onchange?.(next);
	}
	function key(event, index) {
		const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = (index + step + options.length) % options.length;
		choose(options[next].value);
		buttons[next]?.focus();
	}
</script>

<div class="pn-seg" role="radiogroup" aria-label={ariaLabel} style="--n: {options.length}">
	{#each options as option, i (option.value)}
		<button
			type="button"
			role="radio"
			aria-checked={value === option.value}
			tabindex={value === option.value ? 0 : -1}
			class:on={value === option.value}
			bind:this={buttons[i]}
			onclick={() => choose(option.value)}
			onkeydown={(e) => key(e, i)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style>
	.pn-seg {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 2px;
		padding: 4px;
		border-radius: 14px;
		background: var(--pn-surface-muted);
		font-family: var(--pn-font);
	}
	button {
		min-height: 38px;
		padding: 0 10px;
		border: 0;
		border-radius: 11px;
		background: transparent;
		color: var(--pn-ink-muted);
		font: 500 var(--pn-text-sm) var(--pn-font);
		cursor: pointer;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	button.on {
		background: var(--pn-surface);
		color: var(--pn-ink);
		font-weight: 600;
		box-shadow: 0 1px 2px rgba(15, 18, 51, 0.1);
	}
	button:focus-visible {
		outline: 2px solid var(--pn-accent);
		outline-offset: 1px;
	}
</style>
