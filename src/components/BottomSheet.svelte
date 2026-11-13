<script>
	/**
	 * The one "window" of the user views: a sheet from the bottom (a centred
	 * card on wide screens). Forms, menus ("Más"), details. If it does not fit
	 * in a sheet it is a page, not a modal. Admin views use SidePanel.
	 *
	 * - `footer` stays fixed at thumb height; the body scrolls above it.
	 * - Focus, Tab trap, Escape and scroll lock: src/dialog.js. A tap outside
	 *   closes unless `dismissible` is false (while sending).
	 *
	 * Origin: shift/src/lib/ui/Sheet.svelte.
	 *
	 * @type {{ open: boolean, title?: string, ariaLabel?: string, closeLabel?: string,
	 *   dismissible?: boolean, onclose: () => void,
	 *   children: import('svelte').Snippet, footer?: import('svelte').Snippet }}
	 */
	import { modal } from '../dialog.js';

	let { open, title = '', ariaLabel = '', closeLabel = '', dismissible = true, onclose, children, footer } = $props();
	const uid = $props.id();
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="pn-sheet-backdrop" onclick={() => dismissible && onclose()}></div>
	<div
		class="pn-sheet"
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? `pn-sheet-${uid}` : undefined}
		aria-label={title ? undefined : ariaLabel || undefined}
		tabindex="-1"
		use:modal={{ onclose, dismissible }}
	>
		<span class="grip" aria-hidden="true"></span>
		{#if title || closeLabel}
			<header class="head">
				{#if title}<h2 id="pn-sheet-{uid}" class="title">{title}</h2>{/if}
				{#if closeLabel}
					<button type="button" class="close" aria-label={closeLabel} onclick={onclose} disabled={!dismissible}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
					</button>
				{/if}
			</header>
		{/if}
		<div class="body">{@render children()}</div>
		{#if footer}<footer class="foot">{@render footer()}</footer>{/if}
	</div>
{/if}

<style>
	.pn-sheet-backdrop {
		position: fixed;
		inset: 0;
		z-index: 80;
		background: var(--pn-overlay);
		animation: pn-fade 0.2s ease-out;
	}
	.pn-sheet {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 81;
		max-height: 92dvh;
		display: flex;
		flex-direction: column;
		background: var(--pn-bg);
		color: var(--pn-ink);
		border-radius: var(--pn-radius-sheet) var(--pn-radius-sheet) 0 0;
		box-shadow: var(--pn-shadow-float);
		font-family: var(--pn-font);
		outline: none;
		animation: pn-rise 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.grip {
		align-self: center;
		width: 40px;
		height: 5px;
		margin: 10px 0 4px;
		border-radius: 999px;
		background: var(--pn-line-strong);
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 6px var(--pn-gutter) 4px;
	}
	.title {
		margin: 0;
		font: 700 var(--pn-text-title) / 1.3 var(--pn-font-heading);
	}
	.close {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 0;
		background: var(--pn-surface-muted);
		color: var(--pn-ink);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.body {
		overflow-y: auto;
		padding: 12px var(--pn-gutter) 20px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.pn-sheet:not(:has(.foot)) .body {
		padding-bottom: calc(20px + env(safe-area-inset-bottom));
	}
	.foot {
		padding: 12px var(--pn-gutter) calc(16px + env(safe-area-inset-bottom));
		border-top: 1px solid var(--pn-line);
	}
	@media (min-width: 640px) {
		.pn-sheet {
			left: 50%;
			right: auto;
			bottom: auto;
			top: 50%;
			width: min(480px, 92vw);
			transform: translate(-50%, -50%);
			border-radius: var(--pn-radius-sheet);
			animation: pn-fade 0.2s ease-out;
		}
		.grip {
			display: none;
		}
	}
	@keyframes pn-rise {
		from {
			transform: translateY(24px);
			opacity: 0;
		}
	}
	@keyframes pn-fade {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pn-sheet,
		.pn-sheet-backdrop {
			animation: none;
		}
	}
</style>
