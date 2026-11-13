<script>
	/**
	 * Slide to confirm, for actions that must not happen by accident (clock in
	 * or out, accept an invoice, resolve an alert). Sliding IS the confirmation:
	 * no dialog after it.
	 *
	 * - tone 'forward': accent, slides right (start, accept).
	 *   tone 'back': dark, slides left (stop, close).
	 * - The check appears only when `onConfirm` resolves: a spinner while it
	 *   waits, a shake and `failedLabel` if it returns false. In a legal record
	 *   a tick before the server agreed would be a lie.
	 * - Accessible: a real button (visually hidden) confirms with Enter, Space,
	 *   VoiceOver/TalkBack double tap; holding the thumb `longPressMs` also
	 *   confirms, for people who cannot drag.
	 *
	 * Origin: shift/src/lib/components/SlideToConfirm.svelte.
	 *
	 * @type {{
	 *   label: string, confirmLabel?: string, pendingLabel?: string, failedLabel?: string,
	 *   hint?: string,
	 *   onConfirm: () => boolean | null | void | Promise<boolean | null | void>,
	 *   disabled?: boolean, tone?: 'forward' | 'back', longPressMs?: number
	 * }}
	 */
	let {
		label,
		confirmLabel = '',
		pendingLabel = '',
		failedLabel = '',
		hint = '',
		onConfirm,
		disabled = false,
		tone = 'forward',
		longPressMs = 600
	} = $props();

	let track = $state(null);
	let dragging = $state(false);
	let progress = $state(0);
	/** @type {'idle' | 'pending' | 'done' | 'failed'} */
	let phase = $state('idle');
	let startX = 0;
	let maxX = 1;
	let moved = false;
	let holdTimer = null;
	let resetTimer = null;
	const THRESHOLD = 0.9;

	const busy = $derived(phase !== 'idle');
	const shown = $derived(
		phase === 'pending'
			? pendingLabel || label
			: phase === 'done'
				? confirmLabel || label
				: phase === 'failed'
					? failedLabel || label
					: label
	);

	function later(fn, ms) {
		clearTimeout(resetTimer);
		resetTimer = setTimeout(fn, ms);
	}
	$effect(() => () => {
		clearTimeout(resetTimer);
		clearTimeout(holdTimer);
	});

	async function fire() {
		if (disabled || busy) return;
		clearTimeout(holdTimer);
		dragging = false;
		phase = 'pending';
		progress = 1;
		let result;
		try {
			result = await onConfirm();
		} catch (err) {
			console.error('[pn.swipe] onConfirm threw', err);
			result = false;
		}
		if (result === false) {
			phase = 'failed';
			progress = 0;
			later(() => (phase = 'idle'), 2500);
		} else if (result === null) {
			phase = 'idle';
			progress = 0;
		} else {
			phase = 'done';
			later(() => {
				phase = 'idle';
				progress = 0;
			}, 900);
		}
	}

	function down(event) {
		if (disabled || busy) return;
		const rect = track?.getBoundingClientRect();
		if (!rect) return;
		maxX = Math.max(1, rect.width - 60);
		startX = event.clientX;
		moved = false;
		dragging = true;
		event.currentTarget.setPointerCapture?.(event.pointerId);
		clearTimeout(holdTimer);
		holdTimer = setTimeout(() => {
			if (dragging && !moved) void fire();
		}, longPressMs);
	}
	function move(event) {
		if (!dragging) return;
		const delta = tone === 'back' ? startX - event.clientX : event.clientX - startX;
		if (Math.abs(delta) > 6) {
			moved = true;
			clearTimeout(holdTimer);
		}
		progress = Math.max(0, Math.min(maxX, delta)) / maxX;
	}
	function up() {
		clearTimeout(holdTimer);
		if (!dragging) return;
		dragging = false;
		if (progress >= THRESHOLD) void fire();
		else progress = 0;
	}
</script>

<div class="pn-swipe-wrap">
	<div
		class="pn-swipe tone-{tone}"
		class:disabled
		class:dragging
		class:done={phase === 'done'}
		class:pending={phase === 'pending'}
		class:failed={phase === 'failed'}
		style="--p: {progress}"
		bind:this={track}
	>
		<div class="fill"></div>
		<span class="text" aria-hidden="true">{shown}</span>
		<button type="button" class="pn-sr-only" disabled={disabled || busy} aria-busy={phase === 'pending'} onclick={() => void fire()}>
			{confirmLabel || label}
		</button>
		<span class="pn-sr-only" role="status" aria-live="polite">{phase === 'idle' ? '' : shown}</span>
		<div class="thumb" aria-hidden="true" onpointerdown={down} onpointermove={move} onpointerup={up} onpointercancel={up}>
			{#if phase === 'pending'}
				<span class="spinner"></span>
			{:else if phase === 'done'}
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
			{:else}
				<svg class="arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
			{/if}
		</div>
	</div>
	{#if hint}<p class="hint">{hint}</p>{/if}
</div>

<style>
	.pn-swipe-wrap {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
		width: 100%;
	}
	.pn-swipe {
		position: relative;
		width: 100%;
		height: 60px;
		border-radius: 999px;
		background: var(--pn-accent-soft);
		overflow: hidden;
		user-select: none;
		touch-action: none;
		font-family: var(--pn-font);
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		width: calc(30px + var(--p) * (100% - 30px));
		background: var(--pn-accent);
		opacity: 0.18;
	}
	.text {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 64px;
		font-size: var(--pn-text-md);
		font-weight: 600;
		color: var(--pn-accent-text);
		pointer-events: none;
		opacity: calc(1 - var(--p) * 0.9);
		text-align: center;
	}
	.thumb {
		position: absolute;
		top: 6px;
		left: calc(6px + var(--p) * (100% - 60px));
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: var(--pn-accent);
		color: var(--pn-on-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: grab;
		box-shadow: 0 2px 8px rgba(15, 18, 51, 0.2);
		touch-action: none;
	}
	.tone-back {
		background: var(--pn-ink);
	}
	.tone-back .fill {
		inset: 0 0 0 auto;
		background: var(--pn-surface);
		opacity: 0.12;
	}
	.tone-back .text {
		color: var(--pn-bg);
		opacity: calc(0.9 - var(--p) * 0.8);
	}
	.tone-back .thumb {
		left: calc(6px + (1 - var(--p)) * (100% - 60px));
		background: var(--pn-surface);
		color: var(--pn-ink);
	}
	.tone-back .arrow {
		transform: scaleX(-1);
	}
	.dragging .thumb {
		cursor: grabbing;
	}
	.pn-swipe:not(.dragging) .thumb {
		transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.pn-swipe:focus-within {
		outline: 2px solid var(--pn-accent);
		outline-offset: 3px;
	}
	.disabled {
		opacity: 0.5;
		filter: grayscale(0.4);
	}
	.disabled .thumb,
	.pending .thumb {
		cursor: not-allowed;
	}
	.failed {
		animation: pn-shake 0.35s ease;
	}
	.spinner {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2.5px solid currentColor;
		border-right-color: transparent;
		animation: pn-spin 0.8s linear infinite;
	}
	.hint {
		margin: 0;
		font-size: var(--pn-text-xs);
		color: var(--pn-ink-muted);
		font-family: var(--pn-font);
	}
	@keyframes pn-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes pn-shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.failed {
			animation: none;
		}
		.pn-swipe:not(.dragging) .thumb {
			transition: none;
		}
	}
</style>
