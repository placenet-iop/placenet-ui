<script>
	/**
	 * Bottom navigation of the user views: at most 4 tabs + "Más".
	 * The rest go into a sheet behind "Más"; if something in there has
	 * pending items, "Más" carries a dot so a notice is never hidden.
	 *
	 * Tabs are links (`href`) or actions (`onselect(key)`), icons are kit
	 * <Icon> names. The active tab uses the accent.
	 *
	 * Origin: shift/src/lib/ui/TabBar.svelte.
	 *
	 * @typedef {{ key: string, label: string, icon: import('./Icon.svelte').IconName, href?: string, badge?: number }} Tab
	 * @typedef {Tab & { onselect?: () => void }} MoreItem
	 * @type {{ tabs: Tab[], active: string, onselect?: (key: string) => void,
	 *   more?: MoreItem[], moreLabel?: string, closeLabel?: string }}
	 */
	import Icon from './Icon.svelte';
	import BottomSheet from './BottomSheet.svelte';

	let { tabs, active, onselect, more = [], moreLabel = 'Más', closeLabel = 'Cerrar' } = $props();

	let moreOpen = $state(false);
	const shown = $derived(tabs.slice(0, 4));
	const overflow = $derived([...tabs.slice(4), ...more]);
	const moreActive = $derived(overflow.some((item) => item.key === active));
	const morePending = $derived(overflow.some((item) => (item.badge ?? 0) > 0));

	$effect(() => {
		document.documentElement.style.setProperty('--pn-tabbar-h', '72px');
		return () => document.documentElement.style.removeProperty('--pn-tabbar-h');
	});

	function pick(event, item) {
		if (item.onselect) {
			event.preventDefault();
			item.onselect();
		} else if (!item.href && onselect) {
			event.preventDefault();
			onselect(item.key);
		}
	}
	function pickMore(event, item) {
		moreOpen = false;
		pick(event, item);
	}
</script>

<nav class="pn-tabbar">
	{#each shown as tab (tab.key)}
		<a
			class="item"
			class:active={active === tab.key}
			href={tab.href ?? '#'}
			aria-current={active === tab.key ? 'page' : undefined}
			onclick={(e) => pick(e, tab)}
		>
			<span class="icon">
				<Icon name={tab.icon} />
				{#if (tab.badge ?? 0) > 0}<span class="badge">{tab.badge}</span>{/if}
			</span>
			<span class="label">{tab.label}</span>
		</a>
	{/each}
	{#if overflow.length}
		<button type="button" class="item" class:active={moreActive} aria-haspopup="dialog" aria-expanded={moreOpen} onclick={() => (moreOpen = true)}>
			<span class="icon">
				<Icon name="more" />
				{#if morePending}<span class="dot"></span>{/if}
			</span>
			<span class="label">{moreLabel}</span>
		</button>
	{/if}
</nav>

<BottomSheet open={moreOpen} ariaLabel={moreLabel} {closeLabel} onclose={() => (moreOpen = false)}>
	<ul class="more">
		{#each overflow as item (item.key)}
			<li>
				<a class="more-item" class:active={active === item.key} href={item.href ?? '#'} onclick={(e) => pickMore(e, item)}>
					<Icon name={item.icon} size={22} />
					<span class="more-label">{item.label}</span>
					{#if (item.badge ?? 0) > 0}<span class="badge static">{item.badge}</span>{/if}
				</a>
			</li>
		{/each}
	</ul>
</BottomSheet>

<style>
	.pn-tabbar {
		position: fixed;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		z-index: 50;
		box-sizing: border-box;
		width: 100%;
		max-width: 560px;
		display: flex;
		padding: 8px 4px calc(10px + env(safe-area-inset-bottom));
		background: var(--pn-surface);
		border-top: 1px solid var(--pn-line);
		font-family: var(--pn-font);
	}
	.item {
		flex: 1;
		min-width: 0;
		min-height: 52px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		border: 0;
		background: none;
		color: var(--pn-ink-muted);
		text-decoration: none;
		font: 500 11px var(--pn-font);
		cursor: pointer;
	}
	.item.active {
		color: var(--pn-accent-text);
		font-weight: 700;
	}
	.icon {
		position: relative;
		display: inline-flex;
	}
	.label {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.badge {
		position: absolute;
		top: -4px;
		right: -10px;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		box-sizing: border-box;
		border-radius: 999px;
		background: var(--pn-danger);
		color: var(--pn-on-strong);
		font-size: 11px;
		font-weight: 700;
		line-height: 18px;
		text-align: center;
	}
	.badge.static {
		position: static;
	}
	.dot {
		position: absolute;
		top: -1px;
		right: -3px;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--pn-danger);
		border: 2px solid var(--pn-surface);
	}
	.more {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}
	.more-item {
		display: flex;
		align-items: center;
		gap: 14px;
		min-height: 52px;
		padding: 0 4px;
		color: var(--pn-ink);
		text-decoration: none;
		font-size: var(--pn-text-md);
		border-bottom: 1px solid var(--pn-line);
	}
	.more-item.active {
		color: var(--pn-accent-text);
		font-weight: 600;
	}
	.more-label {
		flex: 1;
	}
</style>
