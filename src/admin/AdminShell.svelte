<script>
	import { untrack } from 'svelte';
	/**
	 * The frame of an app's admin view, as the dashboard draws its own tabs
	 * (dashboard/theme/css/tabs.module.css): 14px labels, 16px tab padding,
	 * the active tab in the accent with a 2px underline, the list 24px in.
	 * No big title: the dashboard drawer already says "Configuración: {app}".
	 *
	 * - `tabs`: [{ id, label, badge?, alert? }]; `alert` (text) draws a dot and
	 *   is read by screen readers ("Requiere atención").
	 * - The active tab lives in the address (?tab=) so a reload or a shared
	 *   link keeps it (replaceState, no navigation). Off with `syncUrl={false}`.
	 * - `header` snippet: a domain name + StatusSummary above the tabs.
	 * - `children(active)` renders the active tab's content.
	 *
	 * - `initial`: the ?tab= value as the APP reads it (SvelteKit's page.url),
	 *   so the server already renders that tab's content: without it nothing
	 *   showed until the page's JavaScript ran.
	 *
	 * @type {{ tabs: Array<{ id: string, label: string, badge?: string | number, alert?: string }>,
	 *   active?: string, initial?: string | null, label: string, syncUrl?: boolean,
	 *   header?: import('svelte').Snippet, children: import('svelte').Snippet<[string]> }}
	 */
	let { tabs, active = $bindable(''), initial = null, label, syncUrl = true, header, children } = $props();

	// Server and first client render agree: the asked tab when it is one, else
	// the first. Read once, on purpose (untrack): later changes come from clicks.
	untrack(() => {
		if (!active || !tabs.some((t) => t.id === active)) {
			active = tabs.some((t) => t.id === initial) ? initial : tabs[0]?.id || '';
		}
	});

	const uid = $props.id();
	let buttons = $state([]);

	// Start from ?tab= when it names a tab; else the first one.
	$effect.pre(() => {
		if (active && tabs.some((t) => t.id === active)) return;
		let asked = '';
		try {
			asked = new URL(window.location.href).searchParams.get('tab') || '';
		} catch {
			asked = '';
		}
		active = tabs.some((t) => t.id === asked) ? asked : tabs[0]?.id || '';
	});

	function choose(id) {
		active = id;
		if (!syncUrl) return;
		try {
			const url = new URL(window.location.href);
			url.searchParams.set('tab', id);
			history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
		} catch (err) {
			console.warn(`[pn.admin] the tab could not be kept in the address tab=${id}`, err);
		}
	}
	function key(event, index) {
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = (index + step + tabs.length) % tabs.length;
		choose(tabs[next].id);
		buttons[next]?.focus();
	}
</script>

<div class="pn-admin">
	{#if header}<div class="header">{@render header()}</div>{/if}
	<div class="tabs" role="tablist" aria-label={label}>
		{#each tabs as tab, i (tab.id)}
			<button
				type="button"
				role="tab"
				id="pn-tab-{uid}-{tab.id}"
				aria-selected={active === tab.id}
				aria-controls="pn-panel-{uid}"
				tabindex={active === tab.id ? 0 : -1}
				class:active={active === tab.id}
				bind:this={buttons[i]}
				onclick={() => choose(tab.id)}
				onkeydown={(e) => key(e, i)}
			>
				{tab.label}
				{#if tab.alert}
					<span class="dot" aria-hidden="true"></span><span class="pn-sr-only">{tab.alert}</span>
				{:else if tab.badge !== undefined && tab.badge !== '' && tab.badge !== 0}
					<span class="badge">{tab.badge}</span>
				{/if}
			</button>
		{/each}
	</div>
	<div class="panel" role="tabpanel" id="pn-panel-{uid}" aria-labelledby="pn-tab-{uid}-{active}">
		{@render children(active)}
	</div>
</div>

<style>
	.pn-admin {
		min-height: 100%;
		background: var(--pn-bg);
		color: var(--pn-ink);
		font: 400 var(--pn-text-sm) / 1.45 var(--pn-font);
	}
	.header {
		padding: 20px 24px 8px;
	}
	.tabs {
		display: flex;
		gap: 0;
		padding: 0 24px;
		border-bottom: 1px solid var(--pn-line);
		overflow-x: auto;
		scrollbar-width: none;
	}
	.tabs::-webkit-scrollbar {
		display: none;
	}
	[role='tab'] {
		position: relative;
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 16px;
		border: 0;
		background: none;
		color: var(--pn-ink);
		font: 400 var(--pn-text-sm) var(--pn-font);
		white-space: nowrap;
		cursor: pointer;
	}
	[role='tab']:hover {
		background: var(--pn-surface-muted);
	}
	[role='tab'].active {
		color: var(--pn-accent-text);
	}
	[role='tab'].active::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -1px;
		height: 2px;
		background: var(--pn-accent);
	}
	[role='tab']:focus-visible {
		outline: 2px solid var(--pn-focus);
		outline-offset: -2px;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--pn-warn);
	}
	.badge {
		min-width: 20px;
		height: 20px;
		padding: 0 6px;
		box-sizing: border-box;
		border-radius: 999px;
		background: var(--pn-surface-muted);
		color: var(--pn-ink-muted);
		font-size: var(--pn-text-xs);
		line-height: 20px;
		text-align: center;
	}
	.panel {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	@media (max-width: 600px) {
		.header,
		.panel {
			padding-left: 16px;
			padding-right: 16px;
		}
		.tabs {
			padding: 0 8px;
		}
	}
</style>
