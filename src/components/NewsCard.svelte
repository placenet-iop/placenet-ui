<script>
	/**
	 * One news item, as the big featured card or as a list row. Same look for
	 * SharePoint news, Factorial's Community, Assist's Guide and anything else
	 * that is "a post with a title, a source and a date".
	 *
	 * `meta` is already formatted by the app ("GOfit Home · Hoy"). Without an
	 * image the row keeps the same-size slot (a soft accent tile) so titles
	 * line up.
	 *
	 * @type {{ variant?: 'featured' | 'row', title: string, href?: string, onclick?: (e: MouseEvent) => void,
	 *   image?: string, meta?: string, badge?: string, unread?: boolean, unreadLabel?: string,
	 *   placeholder?: string, onimageerror?: () => void }}
	 *
	 * `placeholder`: what the thumb shows without an image (e.g. the source's
	 * initials); `onimageerror`: an image that fails to load (an expired link),
	 * so the app can drop it and draw the placeholder instead.
	 */
	let {
		variant = 'row',
		title,
		href = '#',
		onclick,
		image = '',
		meta = '',
		badge = '',
		unread = false,
		unreadLabel = 'Sin leer',
		placeholder = '',
		onimageerror
	} = $props();
</script>

{#if variant === 'featured'}
	<a class="pn-news-featured" {href} {onclick}>
		<div class="hero">
			{#if image}<img src={image} alt="" loading="lazy" decoding="async" onerror={onimageerror} />{/if}
			{#if badge}<span class="badge">{badge}</span>{/if}
		</div>
		<div class="body">
			{#if meta}<span class="meta">{meta}</span>{/if}
			<span class="title">{title}</span>
		</div>
	</a>
{:else}
	<a class="pn-news-row" {href} {onclick}>
		<span class="thumb">
			{#if image}<img src={image} alt="" loading="lazy" decoding="async" onerror={onimageerror} />{:else if placeholder}<span class="ph" aria-hidden="true">{placeholder}</span>{/if}
		</span>
		<span class="text">
			{#if meta}<span class="meta">{meta}</span>{/if}
			<span class="title">{title}</span>
		</span>
		{#if unread}<span class="dot" role="img" aria-label={unreadLabel}></span>{/if}
	</a>
{/if}

<style>
	a {
		color: var(--pn-ink);
		text-decoration: none;
		font-family: var(--pn-font);
		-webkit-tap-highlight-color: transparent;
	}
	a:focus-visible {
		outline: 2px solid var(--pn-accent);
		outline-offset: 2px;
	}
	.meta {
		font-size: var(--pn-text-xs);
		font-weight: 600;
		color: var(--pn-ink-muted);
	}
	.pn-news-featured {
		display: flex;
		flex-direction: column;
		border-radius: 20px;
		overflow: hidden;
		background: var(--pn-surface);
		box-shadow: var(--pn-shadow-card);
	}
	.hero {
		position: relative;
		aspect-ratio: 16 / 9;
		background: var(--pn-accent-soft);
	}
	.hero img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.badge {
		position: absolute;
		left: 12px;
		top: 12px;
		height: 24px;
		padding: 0 10px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--pn-surface) 92%, transparent);
		color: var(--pn-ink);
		font-size: var(--pn-text-xs);
		font-weight: 600;
		display: inline-flex;
		align-items: center;
	}
	.body {
		padding: 14px 16px 16px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.pn-news-featured .title {
		font: 700 var(--pn-text-lg) / 1.3 var(--pn-font-heading);
	}
	.pn-news-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
		min-height: var(--pn-touch);
	}
	.thumb {
		width: 72px;
		height: 72px;
		flex-shrink: 0;
		border-radius: 14px;
		overflow: hidden;
		background: var(--pn-accent-soft);
	}
	.ph {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--pn-accent);
		color: var(--pn-on-accent);
		font: 700 var(--pn-text-md) var(--pn-font-heading);
	}
	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.pn-news-row .title {
		font-size: 15px;
		font-weight: 600;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.dot {
		width: 8px;
		height: 8px;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--pn-accent);
	}
</style>
