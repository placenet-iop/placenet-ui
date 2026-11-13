<script>
	/**
	 * Edit one row without leaving the page (a domain, a site, a rule), drawn
	 * like the dashboard's Drawer (theme/css/drawer.module.css): from the right,
	 * title in h4 (20/28, Rethink Sans), the page behind blurred at half
	 * opacity, the big soft shadow. Full screen under 720px.
	 * Focus, Tab trap, Escape and scroll lock: src/dialog.js.
	 *
	 * @type {{ open: boolean, title: string, subtitle?: string, closeLabel?: string, width?: number,
	 *   dismissible?: boolean, onclose: () => void,
	 *   children: import('svelte').Snippet, footer?: import('svelte').Snippet }}
	 */
	import { modal } from '../dialog.js';

	let { open, title, subtitle = '', closeLabel = 'Cerrar', width = 480, dismissible = true, onclose, children, footer } = $props();
	const uid = $props.id();
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="pn-panel-overlay" onclick={() => dismissible && onclose()}></div>
	<div
		class="pn-panel"
		style="--w: {width}px"
		role="dialog"
		aria-modal="true"
		aria-labelledby="pn-panel-{uid}"
		tabindex="-1"
		use:modal={{ onclose, dismissible }}
	>
		<header class="head">
			<div class="titles">
				{#if subtitle}<span class="subtitle">{subtitle}</span>{/if}
				<h2 id="pn-panel-{uid}">{title}</h2>
			</div>
			<button type="button" class="close" aria-label={closeLabel} onclick={onclose} disabled={!dismissible}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
			</button>
		</header>
		<div class="body">{@render children()}</div>
		{#if footer}<footer class="foot">{@render footer()}</footer>{/if}
	</div>
{/if}

<style>
	.pn-panel-overlay {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: color-mix(in srgb, var(--pn-bg) 50%, transparent);
		backdrop-filter: blur(2px);
		animation: pn-fade 0.2s ease-out;
	}
	.pn-panel {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 201;
		width: min(var(--w), 100vw);
		display: flex;
		flex-direction: column;
		background: var(--pn-surface);
		color: var(--pn-ink);
		box-shadow: 0 -13px 79px 0 rgba(0, 1, 34, 0.15);
		font-family: var(--pn-font);
		outline: none;
		animation: pn-slide 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		padding: 20px 24px 12px;
	}
	.titles {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.subtitle {
		font-size: var(--pn-text-xs);
		font-weight: 500;
		color: var(--pn-ink-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	h2 {
		margin: 0;
		font: 600 var(--pn-text-title) / 28px var(--pn-font-heading);
		color: var(--pn-ink-strong);
		overflow-wrap: anywhere;
	}
	.close {
		width: 36px;
		height: 36px;
		flex-shrink: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--pn-ink);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.close:hover {
		background: var(--pn-surface-muted);
	}
	.body {
		flex: 1;
		overflow-y: auto;
		padding: 8px 24px 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.foot {
		padding: 14px 24px calc(14px + env(safe-area-inset-bottom));
		border-top: 1px solid var(--pn-line);
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		align-items: center;
		justify-content: space-between;
	}
	@media (max-width: 720px) {
		.pn-panel {
			width: 100vw;
		}
	}
	@keyframes pn-slide {
		from {
			transform: translateX(32px);
			opacity: 0;
		}
	}
	@keyframes pn-fade {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pn-panel,
		.pn-panel-overlay {
			animation: none;
		}
	}
</style>
