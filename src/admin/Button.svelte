<script>
	/**
	 * The dashboard's Button (theme.tsx: radius 12, size lg, filled in the
	 * primary colour; disabled gray.2; the label wraps instead of being cut).
	 * Here the primary colour is the organisation's accent.
	 *
	 * variant: filled (primary action), light (secondary), subtle (in-line,
	 * text-like), danger (destructive, after a confirmation).
	 * A link when `href` is set.
	 *
	 * @type {{ variant?: 'filled'|'light'|'subtle'|'danger', size?: 'sm'|'md'|'lg',
	 *   type?: 'button'|'submit', href?: string, disabled?: boolean, loading?: boolean,
	 *   loadingLabel?: string, formaction?: string, name?: string, value?: string,
	 *   onclick?: (e: MouseEvent) => void, children: import('svelte').Snippet, [key: string]: any }}
	 */
	let {
		variant = 'filled',
		size = 'lg',
		type = 'button',
		href = '',
		disabled = false,
		loading = false,
		loadingLabel = '',
		children,
		...rest
	} = $props();
</script>

{#if href}
	<a class="pn-btn v-{variant} s-{size}" {href} aria-disabled={disabled || undefined} {...rest}>{@render children()}</a>
{:else}
	<button class="pn-btn v-{variant} s-{size}" {type} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
		{#if loading}<span class="spin" aria-hidden="true"></span>{loadingLabel}{#if !loadingLabel}{@render children()}{/if}{:else}{@render children()}{/if}
	</button>
{/if}

<style>
	.pn-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		min-height: var(--h);
		padding: 6px var(--px);
		box-sizing: border-box;
		border: 1px solid transparent;
		border-radius: var(--pn-radius);
		font: 600 var(--fs) / 1.25 var(--pn-font);
		text-align: center;
		text-decoration: none;
		white-space: normal;
		cursor: pointer;
		transition: background-color 0.12s ease;
	}
	.s-sm {
		--h: 36px;
		--px: 14px;
		--fs: var(--pn-text-sm);
	}
	.s-md {
		--h: 42px;
		--px: 18px;
		--fs: var(--pn-text-sm);
	}
	.s-lg {
		--h: 50px;
		--px: 26px;
		--fs: var(--pn-text-md);
	}
	.v-filled {
		background: var(--pn-accent);
		color: var(--pn-on-accent);
	}
	.v-filled:hover:not(:disabled) {
		background: var(--pn-accent-press);
	}
	.v-light {
		background: var(--pn-accent-soft);
		color: var(--pn-accent-text);
	}
	.v-light:hover:not(:disabled) {
		background: color-mix(in srgb, var(--pn-accent) 14%, var(--pn-surface));
	}
	.v-subtle {
		background: transparent;
		color: var(--pn-accent-text);
	}
	.v-subtle:hover:not(:disabled) {
		background: var(--pn-accent-soft);
	}
	.v-danger {
		background: var(--pn-danger);
		color: var(--pn-on-strong);
	}
	.pn-btn:disabled,
	.pn-btn[aria-disabled='true'] {
		background: var(--pn-surface-muted);
		color: var(--pn-ink-muted);
		cursor: not-allowed;
	}
	.pn-btn:focus-visible {
		outline: 2px solid var(--pn-focus);
		outline-offset: 2px;
	}
	.spin {
		width: 14px;
		height: 14px;
		margin-right: 4px;
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
