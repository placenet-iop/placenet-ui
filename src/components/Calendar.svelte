<script>
	/**
	 * The ONE month calendar of every app: pick a day (`mode="single"`), a
	 * range (`mode="range"`), or just show days with markers (`mode="view"`,
	 * e.g. the wall's events).
	 *
	 * Days are 'YYYY-MM-DD' strings. The app tells the calendar about its days:
	 *   isDisabled(date)  cannot be picked (closed, blocked, past…)
	 *   isStruck(date)    shown struck through (holiday) — still pickable,
	 *                     the app decides whether it counts
	 *   markers(date)     up to 3 colours drawn as dots under the day
	 * `today` is passed by the app (its time zone), never guessed here.
	 *
	 * Keyboard: Tab reaches the month buttons and the chosen (or today's) day;
	 * arrows move by day/week, PageUp/PageDown by month, Enter/Space picks.
	 *
	 * @type {{
	 *   mode?: 'single' | 'range' | 'view', value?: string | null,
	 *   range?: { from: string | null, to: string | null },
	 *   month?: string, today?: string, locale?: string, weekStart?: number,
	 *   isDisabled?: (date: string) => boolean, isStruck?: (date: string) => boolean,
	 *   markers?: (date: string) => string[],
	 *   prevLabel?: string, nextLabel?: string,
	 *   onpick?: (date: string) => void
	 * }}
	 */
	import { addMonths, monthGrid, monthTitle, nextRange, rangePart, weekdayNames, isoDate, parseMonth } from '../calendar.js';

	let {
		mode = 'single',
		value = $bindable(null),
		range = $bindable({ from: null, to: null }),
		month = $bindable(''),
		today = '',
		locale = 'es',
		weekStart = 1,
		isDisabled = () => false,
		isStruck = () => false,
		markers = () => [],
		prevLabel = 'Mes anterior',
		nextLabel = 'Mes siguiente',
		onpick
	} = $props();

	const shownMonth = $derived(month || (mode === 'range' ? range?.from : value)?.slice(0, 7) || today.slice(0, 7) || new Date().toISOString().slice(0, 7));
	const cells = $derived(monthGrid(shownMonth, weekStart));
	const names = $derived(weekdayNames(locale, weekStart));
	const title = $derived(monthTitle(shownMonth, locale));
	const dayFmt = $derived(new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }));
	let focusDate = $state('');
	const tabDate = $derived(
		[focusDate, mode === 'range' ? range?.from : value, today].find((d) => d && d.slice(0, 7) === shownMonth) || `${shownMonth}-01`
	);
	let grid = $state(null);

	function go(delta) {
		month = addMonths(shownMonth, delta);
	}
	function pick(date) {
		if (mode === 'view' || isDisabled(date)) {
			onpick?.(date);
			return;
		}
		if (mode === 'range') range = nextRange(range, date);
		else value = date;
		onpick?.(date);
	}
	function selected(date) {
		return mode === 'range' ? rangePart(range, date) : value === date ? 'single' : null;
	}
	function label(date) {
		const { year, month: m } = parseMonth(date);
		return dayFmt.format(new Date(Date.UTC(year, m - 1, Number(date.slice(8, 10)))));
	}
	function move(event, date) {
		const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
		let next = null;
		if (event.key in steps) {
			const { year, month: m } = parseMonth(date);
			next = isoDate(year, m, Number(date.slice(8, 10)) + steps[event.key]);
		} else if (event.key === 'PageUp' || event.key === 'PageDown') {
			const target = addMonths(date.slice(0, 7), event.key === 'PageUp' ? -1 : 1);
			next = `${target}-${date.slice(8, 10)}`;
			if (next.slice(0, 7) !== target) next = `${target}-01`;
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			pick(date);
			return;
		}
		if (!next) return;
		event.preventDefault();
		focusDate = next;
		if (next.slice(0, 7) !== shownMonth) month = next.slice(0, 7);
		queueMicrotask(() => grid?.querySelector(`[data-date="${next}"]`)?.focus());
	}
</script>

<div class="pn-cal">
	<div class="nav">
		<button type="button" class="arrow" aria-label={prevLabel} onclick={() => go(-1)}>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
		</button>
		<span class="title" aria-live="polite">{title}</span>
		<button type="button" class="arrow" aria-label={nextLabel} onclick={() => go(1)}>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
		</button>
	</div>
	<div class="names" aria-hidden="true">
		{#each names as name, i (i)}<span>{name}</span>{/each}
	</div>
	<div class="grid" role="grid" aria-label={title} bind:this={grid}>
		{#each cells as cell (cell.date)}
			{@const part = selected(cell.date)}
			{@const disabled = isDisabled(cell.date)}
			{@const dots = markers(cell.date).slice(0, 3)}
			<button
				type="button"
				role="gridcell"
				data-date={cell.date}
				class="day part-{part ?? 'none'}"
				class:out={!cell.inMonth}
				class:today={cell.date === today}
				class:struck={isStruck(cell.date)}
				aria-disabled={disabled || undefined}
				aria-selected={mode === 'view' ? undefined : !!part}
				aria-label={label(cell.date)}
				tabindex={cell.date === tabDate ? 0 : -1}
				onclick={() => pick(cell.date)}
				onkeydown={(e) => move(e, cell.date)}
				onfocus={() => (focusDate = cell.date)}
			>
				<span class="num">{Number(cell.date.slice(8, 10))}</span>
				{#if dots.length}
					<span class="dots" aria-hidden="true">
						{#each dots as color, i (i)}<span style="background: {color}"></span>{/each}
					</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.pn-cal {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: var(--pn-font);
		color: var(--pn-ink);
	}
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.title {
		font-size: var(--pn-text-sm);
		font-weight: 600;
		text-transform: capitalize;
	}
	.arrow {
		width: var(--pn-touch);
		height: var(--pn-touch);
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--pn-ink);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.arrow:hover {
		background: var(--pn-surface-muted);
	}
	.names,
	.grid {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}
	.names span {
		text-align: center;
		font-size: var(--pn-text-xs);
		color: var(--pn-ink-muted);
		text-transform: uppercase;
		padding: 4px 0;
	}
	.grid {
		row-gap: 2px;
	}
	.day {
		position: relative;
		height: 40px;
		border: 0;
		background: none;
		color: var(--pn-ink);
		font: 500 var(--pn-text-sm) var(--pn-font);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		cursor: pointer;
		border-radius: 12px;
	}
	.day.out {
		color: var(--pn-ink-muted);
		opacity: 0.55;
	}
	.day.today .num {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 4px;
		text-decoration-color: var(--pn-accent);
	}
	.day.struck .num {
		text-decoration: line-through;
		color: var(--pn-ink-muted);
	}
	.day[aria-disabled='true'] {
		color: var(--pn-ink-muted);
		opacity: 0.4;
		cursor: not-allowed;
	}
	.day.part-single,
	.day.part-start,
	.day.part-end {
		background: var(--pn-accent);
		color: var(--pn-on-accent);
		font-weight: 700;
	}
	.day.part-single .num,
	.day.part-start .num,
	.day.part-end .num {
		text-decoration-color: currentColor;
	}
	.day.part-start {
		border-radius: 12px 0 0 12px;
	}
	.day.part-end {
		border-radius: 0 12px 12px 0;
	}
	.day.part-inside {
		background: var(--pn-accent-soft);
		color: var(--pn-accent-text);
		font-weight: 600;
		border-radius: 0;
	}
	.day:focus-visible {
		outline: 2px solid var(--pn-accent);
		outline-offset: 1px;
		z-index: 1;
	}
	.dots {
		display: flex;
		gap: 3px;
		height: 5px;
	}
	.dots span {
		width: 5px;
		height: 5px;
		border-radius: 50%;
	}
</style>
