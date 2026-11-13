<script>
	/**
	 * One news item read in full: image on top with a floating back button,
	 * source pill and date, the title, the body (the app renders it: SharePoint
	 * blocks, Guide blocks, Community HTML), and at most ONE secondary action at
	 * the end ("Abrir en SharePoint", "Preguntar sobre esto").
	 *
	 * @type {{ title: string, image?: string, source?: string, meta?: string,
	 *   backHref?: string, onback?: () => void, backLabel?: string,
	 *   action?: { label: string, href?: string, onclick?: () => void, external?: boolean },
	 *   children: import('svelte').Snippet }}
	 */
	let { title, image = '', source = '', meta = '', backHref = '', onback, backLabel = 'Volver', action, children } = $props();
</script>

<article class="pn-article">
	<div class="hero" class:empty={!image}>
		{#if image}<img src={image} alt="" decoding="async" />{/if}
		{#if backHref || onback}
			<a class="back" href={backHref || '#'} aria-label={backLabel} onclick={(e) => { if (onback) { e.preventDefault(); onback(); } }}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
			</a>
		{/if}
	</div>
	<div class="sheet">
		{#if source || meta}
			<div class="meta">
				{#if source}<span class="source">{source}</span>{/if}
				{#if meta}<span>{meta}</span>{/if}
			</div>
		{/if}
		<h1>{title}</h1>
		<div class="content">{@render children()}</div>
		{#if action}
			<a
				class="action"
				href={action.href || '#'}
				target={action.external ? '_blank' : undefined}
				rel={action.external ? 'noopener noreferrer' : undefined}
				onclick={(e) => { if (action.onclick) { e.preventDefault(); action.onclick(); } }}
			>
				{action.label}
				{#if action.external}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
				{/if}
			</a>
		{/if}
	</div>
</article>

<style>
	.pn-article {
		font-family: var(--pn-font);
		color: var(--pn-ink);
	}
	.hero {
		position: relative;
		aspect-ratio: 16 / 10;
		max-height: 320px;
		width: 100%;
		background: var(--pn-accent-soft);
	}
	.hero.empty {
		aspect-ratio: auto;
		height: 72px;
		background: none;
	}
	.hero img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.back {
		position: absolute;
		left: 16px;
		top: 16px;
		width: var(--pn-touch);
		height: var(--pn-touch);
		border-radius: 50%;
		background: color-mix(in srgb, var(--pn-surface) 92%, transparent);
		color: var(--pn-ink);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--pn-shadow-card);
	}
	.sheet {
		position: relative;
		margin-top: -24px;
		padding: 20px var(--pn-gutter) 28px;
		background: var(--pn-bg);
		border-radius: var(--pn-radius-sheet) var(--pn-radius-sheet) 0 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.hero.empty + .sheet {
		margin-top: 0;
	}
	.meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		font-size: 13px;
		color: var(--pn-ink-muted);
	}
	.source {
		height: 24px;
		padding: 0 10px;
		border-radius: 999px;
		background: var(--pn-accent-soft);
		color: var(--pn-accent-text);
		font-weight: 600;
		display: inline-flex;
		align-items: center;
	}
	h1 {
		margin: 0;
		font-size: 24px;
		font-weight: 700;
		line-height: 1.25;
	}
	.content {
		font-size: var(--pn-text-md);
		line-height: 1.6;
	}
	.action {
		margin-top: 8px;
		min-height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 14px;
		border: 1px solid var(--pn-line);
		background: var(--pn-surface);
		color: var(--pn-ink);
		font-size: 15px;
		font-weight: 600;
		text-decoration: none;
	}
	.back:focus-visible,
	.action:focus-visible {
		outline: 2px solid var(--pn-accent);
		outline-offset: 2px;
	}
</style>
