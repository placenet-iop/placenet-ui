<script>
	// Where toasts appear: bottom centre, above the tab bar (--pn-tabbar-h).
	import { toasts, dismissToast } from '../toast.svelte.js';

	function act(toast) {
		dismissToast(toast.id);
		toast.action?.onAction();
	}
</script>

<div class="pn-toaster" role="status" aria-live="polite">
	{#each toasts.items as toast (toast.id)}
		<div class="toast tone-{toast.tone}">
			<span class="msg">{toast.message}</span>
			{#if toast.action}
				<button type="button" class="act" onclick={() => act(toast)}>{toast.action.label}</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	.pn-toaster {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(var(--pn-tabbar-h, 0px) + 16px + env(safe-area-inset-bottom));
		z-index: 300; /* above BottomSheet (81) and SidePanel (201): a save inside a panel says so */
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 0 16px;
		pointer-events: none;
		font-family: var(--pn-font);
	}
	.toast {
		pointer-events: auto;
		width: 100%;
		max-width: 440px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		min-height: 48px;
		padding: 10px 16px;
		border-radius: 14px;
		/* Inverted page colours: dark on a light domain, light on a dark one. */
		background: var(--pn-ink);
		color: var(--pn-bg);
		font-size: var(--pn-text-sm);
		box-shadow: var(--pn-shadow-float);
		animation: pn-toast-in 0.2s ease-out;
	}
	.tone-error {
		background: var(--pn-danger);
		color: var(--pn-on-strong);
	}
	.act {
		flex-shrink: 0;
		min-height: var(--pn-touch);
		padding: 0 4px;
		border: 0;
		background: none;
		color: inherit;
		font: 700 var(--pn-text-sm) var(--pn-font);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
	@keyframes pn-toast-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.toast {
			animation: none;
		}
	}
</style>
