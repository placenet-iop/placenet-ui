import { describe, expect, it } from 'vitest';
import { addMonths, isoDate, monthGrid, nextRange, rangeDays, rangePart, weekday, weekdayNames } from '../src/calendar.js';

describe('dates', () => {
	it('normalises overflow and moves months across years', () => {
		expect(isoDate(2026, 1, 32)).toBe('2026-02-01');
		expect(isoDate(2026, 3, 0)).toBe('2026-02-28');
		expect(addMonths('2026-12', 1)).toBe('2027-01');
		expect(addMonths('2026-01', -1)).toBe('2025-12');
	});
	it('knows the ISO weekday', () => {
		expect(weekday('2026-12-01')).toBe(2); // Tuesday
		expect(weekday('2026-12-06')).toBe(7); // Sunday
	});
});

describe('monthGrid', () => {
	it('starts on Monday and fills whole weeks', () => {
		const cells = monthGrid('2026-12', 1);
		expect(cells[0]).toEqual({ date: '2026-11-30', inMonth: false });
		expect(cells[1]).toEqual({ date: '2026-12-01', inMonth: true });
		expect(cells.length % 7).toBe(0);
		expect(cells.filter((c) => c.inMonth)).toHaveLength(31);
	});
	it('can start on Sunday', () => {
		expect(monthGrid('2026-12', 7)[0].date).toBe('2026-11-29');
	});
	it('names weekdays in the given language and order', () => {
		expect(weekdayNames('es', 1, 'short')[0].toLowerCase()).toMatch(/^lun/);
		expect(weekdayNames('en', 7, 'short')[0]).toMatch(/^Sun/);
	});
});

describe('range selection', () => {
	it('opens, closes and restarts a range', () => {
		let r = nextRange({ from: null, to: null }, '2026-12-22');
		expect(r).toEqual({ from: '2026-12-22', to: null });
		r = nextRange(r, '2026-12-24');
		expect(r).toEqual({ from: '2026-12-22', to: '2026-12-24' });
		expect(nextRange(r, '2026-12-28')).toEqual({ from: '2026-12-28', to: null });
		expect(nextRange({ from: '2026-12-22', to: null }, '2026-12-20')).toEqual({ from: '2026-12-20', to: null });
	});
	it('places a day in the range', () => {
		const r = { from: '2026-12-22', to: '2026-12-24' };
		expect(rangePart(r, '2026-12-22')).toBe('start');
		expect(rangePart(r, '2026-12-23')).toBe('inside');
		expect(rangePart(r, '2026-12-24')).toBe('end');
		expect(rangePart(r, '2026-12-25')).toBeNull();
		expect(rangePart({ from: '2026-12-22', to: null }, '2026-12-22')).toBe('single');
	});
	it('lists the days of a range across months', () => {
		expect(rangeDays({ from: '2026-12-30', to: '2027-01-02' })).toEqual(['2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02']);
		expect(rangeDays({ from: null, to: null })).toEqual([]);
	});
});
