<script>
	/**
	 * One question of an admin page ("Pestañas para todos", "Quién recibe los
	 * avisos"): a title, ONE line saying what it is for (+ an optional "Más
	 * información" link), the save state on the right, then the controls.
	 * White card on the dashboard background, like the dashboard's Papers.
	 * `collapsible` folds it (Avanzado, Conexión) behind its own title.
	 *
	 * @type {{ title: string, description?: string, helpHref?: string, helpLabel?: string,
	 *   collapsible?: boolean, open?: boolean, id?: string,
	 *   status?: import('svelte').Snippet, actions?: import('svelte').Snippet,
	 *   aside?: import('svelte').Snippet, children: import('svelte').Snippet }}
	 */
	let {
		title,
		description = '',
		helpHref = '',
		helpLabel = 'Más información',
		collapsible = false,
		open = $bindable(false),
		id = undefined,
		status,
		actions,
		aside,
		children
	} = $props();
</script>

{#snippet head()}
	<div class="text">
		<h2>{title}</h2>
		{#if description || helpHref}
			<p>
				{description}
				{#if helpHref}<a href={helpHref} target="_blank" rel="noopener noreferrer">{helpLabel}</a>{/if}
			</p>
		{/if}
	</div>
	<div class="side">
		{#if aside}{@render aside()}{/if}
		{#if status}{@render status()}{/if}
		{#if actions}{@render actions()}{/if}
	</div>
{/snippet}

{#if collapsible}
	<details class="pn-section" {id} bind:open>
		<summary class="head">
			{@render head()}
			<svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
		</summary>
		<div class="body">{@render children()}</div>
	</details>
{:else}
	<section class="pn-section" {id}>
		<div class="head">{@render head()}</div>
		<div class="body">{@render children()}</div>
	</section>
{/if}

<style>
	.pn-section {
		background: var(--pn-surface);
		border: 1px solid var(--pn-line);
		border-radius: var(--pn-radius-card);
		font-family: var(--pn-font);
		color: var(--pn-ink);
	}
	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 24px 0;
		list-style: none;
	}
	details > .head {
		padding-bottom: 20px;
		cursor: pointer;
	}
	details[open] > .head {
		padding-bottom: 0;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.text {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
	h2 {
		margin: 0;
		font: 600 var(--pn-text-md) / 1.25 var(--pn-font-heading);
		color: var(--pn-ink-strong);
	}
	p {
		margin: 0;
		font-size: var(--pn-text-sm);
		color: var(--pn-ink-muted);
		max-width: 72ch;
	}
	p a {
		color: var(--pn-accent-text);
		font-weight: 500;
	}
	.side {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-shrink: 0;
	}
	.chev {
		flex-shrink: 0;
		margin-top: 2px;
		color: var(--pn-ink-muted);
		transition: transform 0.15s ease;
	}
	details[open] .chev {
		transform: rotate(180deg);
	}
	.body {
		padding: 16px 24px 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	summary:focus-visible {
		outline: 2px solid var(--pn-focus);
		outline-offset: 2px;
		border-radius: var(--pn-radius-card);
	}
	@media (max-width: 600px) {
		.head {
			flex-wrap: wrap;
			padding: 16px 16px 0;
		}
		details > .head {
			padding-bottom: 16px;
		}
		.body {
			padding: 14px 16px 20px;
		}
	}
</style>
