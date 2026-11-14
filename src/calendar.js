// Date maths of <Calendar>, PURE and unit-tested. Days are 'YYYY-MM-DD'
// strings (wall-clock dates, never instants), so no time zone can move a day.

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export const isIsoDate = (value) => typeof value === 'string' && ISO.test(value);

/** 'YYYY-MM-DD' for a year, month (1-12) and day, normalising overflow (Jan 32 -> Feb 1). */
export function isoDate(year, month, day) {
	const d = new Date(Date.UTC(year, month - 1, day));
	return d.toISOString().slice(0, 10);
}

/** { year, month } of a 'YYYY-MM-DD' or 'YYYY-MM'. */
export function parseMonth(value) {
	const [y, m] = String(value).split('-').map(Number);
	return { year: y, month: m };
}

/** 'YYYY-MM' moved by `delta` months. */
export function addMonths(month, delta) {
	const { year, month: m } = parseMonth(month);
	return isoDate(year, m + delta, 1).slice(0, 7);
}

/** ISO weekday 1 (Monday) .. 7 (Sunday) of a 'YYYY-MM-DD'. */
export function weekday(date) {
	const { year, month } = parseMonth(date);
	const day = Number(date.slice(8, 10));
	const w = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
	return w === 0 ? 7 : w;
}

/**
 * The cells of a month view: whole weeks starting on `weekStart` (1 = Monday,
 * 7 = Sunday). Each cell is { date, inMonth }.
 */
export function monthGrid(month, weekStart = 1) {
	const { year, month: m } = parseMonth(month);
	const first = isoDate(year, m, 1);
	const lead = (weekday(first) - weekStart + 7) % 7;
	const daysInMonth = Number(isoDate(year, m + 1, 0).slice(8, 10));
	const total = Math.ceil((lead + daysInMonth) / 7) * 7;
	const cells = [];
	for (let i = 0; i < total; i++) {
		const date = isoDate(year, m, 1 - lead + i);
		cells.push({ date, inMonth: date.slice(0, 7) === first.slice(0, 7) });
	}
	return cells;
}

/** Weekday names (narrow) in `locale`, in grid order. */
export function weekdayNames(locale = 'es', weekStart = 1, style = 'narrow') {
	const fmt = new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' });
	// 2024-01-01 was a Monday.
	return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2024, 0, 1 + ((weekStart - 1 + i) % 7)))));
}

/** "diciembre de 2026" in `locale`. */
export function monthTitle(month, locale = 'es') {
	const { year, month: m } = parseMonth(month);
	const text = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, m - 1, 1)));
	// First letter only: CSS capitalize gave "Noviembre De 2026".
	return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}

/**
 * Range selection: the next { from, to } after tapping `date`.
 * First tap starts a range; a second tap on/after `from` closes it; a tap
 * before `from`, or once the range is complete, starts again.
 */
export function nextRange(range, date) {
	const from = range?.from || null;
	const to = range?.to || null;
	if (!from || to) return { from: date, to: null };
	if (date < from) return { from: date, to: null };
	return { from, to: date };
}

/** Where `date` sits in `range`: 'start' | 'end' | 'single' | 'inside' | null. */
export function rangePart(range, date) {
	const from = range?.from;
	if (!from) return null;
	const to = range.to || from;
	if (date < from || date > to) return null;
	if (from === to) return 'single';
	if (date === from) return 'start';
	if (date === to) return 'end';
	return 'inside';
}

/** The days of a range, both ends included ([] when incomplete or reversed). */
export function rangeDays(range) {
	if (!range?.from) return [];
	const to = range.to || range.from;
	const days = [];
	for (let d = range.from; d <= to; ) {
		days.push(d);
		const { year, month } = parseMonth(d);
		d = isoDate(year, month, Number(d.slice(8, 10)) + 1);
	}
	return days;
}
