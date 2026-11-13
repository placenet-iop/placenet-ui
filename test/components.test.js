import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import BottomSheet from '../src/components/BottomSheet.svelte';
import Calendar from '../src/components/Calendar.svelte';
import DayProgress from '../src/components/DayProgress.svelte';
import FilterPills from '../src/components/FilterPills.svelte';
import Icon from '../src/components/Icon.svelte';
import NewsDetail from '../src/components/NewsDetail.svelte';
import NewsList from '../src/components/NewsList.svelte';
import SegmentedControl from '../src/components/SegmentedControl.svelte';
import SwipeConfirm from '../src/components/SwipeConfirm.svelte';
import TabBar from '../src/components/TabBar.svelte';

const html = (Component, props) => render(Component, { props }).body;
const text = (s) => createRawSnippet(() => ({ render: () => `<p>${s}</p>` }));

describe('no colour outside the tokens', () => {
	it('components use custom properties, not hex', () => {
		const dir = new URL('../src/components/', import.meta.url);
		for (const file of readdirSync(dir)) {
			const src = readFileSync(new URL(file, dir), 'utf8');
			expect(src.match(/#[0-9a-f]{3,6}\b(?![^<]*>)/gi) || [], file).toEqual([]);
		}
	});
});

describe('DayProgress', () => {
	it('draws one bar at the worked share', () => {
		const out = html(DayProgress, { title: 'Hoy', summary: '3 h 41 min de 8 h', worked: 221, expected: 480 });
		expect(out).toContain('role="progressbar"');
		expect(out).toMatch(/width: 46\.0\d*%/);
		expect(out).toContain('3 h 41 min de 8 h');
	});
	it('has no bar on a day off', () => {
		expect(html(DayProgress, { title: 'Hoy', summary: 'Día libre', worked: 0, expected: 0 })).not.toContain('progressbar');
	});
	it('fills and turns to the overtime tone past the expected time', () => {
		const out = html(DayProgress, { title: 'Hoy', summary: '9 h de 8 h', worked: 540, expected: 480 });
		expect(out).toContain('width: 100%');
		expect(out).toMatch(/class="fill[^"]*over/);
	});
});

describe('SwipeConfirm', () => {
	it('offers a real button for keyboard and screen readers', () => {
		const out = html(SwipeConfirm, { label: 'Desliza para fichar salida', confirmLabel: 'Fichar salida', tone: 'back', onConfirm: () => true });
		expect(out).toMatch(/<button[^>]*class="pn-sr-only[^"]*"[^>]*>\s*Fichar salida/);
		expect(out).toContain('tone-back');
	});
});

describe('TabBar', () => {
	it('shows four tabs and moves the rest behind Más', () => {
		const tabs = ['clock', 'shifts', 'timeoff', 'documents', 'news'].map((key) => ({ key, label: key, icon: key === 'clock' ? 'clock' : 'folder', href: `/${key}` }));
		const out = html(TabBar, { tabs, active: 'clock' });
		expect(out.match(/class="item/g)).toHaveLength(5);
		expect(out).toContain('Más');
		expect(out).toContain('aria-current="page"');
		expect(out).not.toContain('href="/news"'); // in the sheet, which is closed
	});
});

describe('Calendar', () => {
	it('marks a picked range and struck holidays', () => {
		const out = html(Calendar, {
			mode: 'range',
			range: { from: '2026-12-22', to: '2026-12-24' },
			today: '2026-12-14',
			isStruck: (d) => d === '2026-12-25'
		});
		expect(out).toMatch(/data-date="2026-12-22" class="day part-start/);
		expect(out).toMatch(/data-date="2026-12-23" class="day part-inside/);
		expect(out).toMatch(/data-date="2026-12-25" class="day part-none[^"]*struck/);
		expect(out).toMatch(/diciembre/i);
	});
});

describe('Segmented control and pills', () => {
	it('are a radio group and toggle buttons', () => {
		const seg = html(SegmentedControl, { ariaLabel: 'Ver', value: 'b', options: [{ value: 'a', label: 'Nóminas' }, { value: 'b', label: 'Horarios' }] });
		expect(seg).toContain('role="radiogroup"');
		expect(seg).toMatch(/aria-checked="true"[^>]*>\s*Horarios/);
		const pills = html(FilterPills, { ariaLabel: 'Filtrar', value: 'all', items: [{ value: 'all', label: 'Todas' }, { value: 'x', label: 'Personas' }] });
		expect(pills).toMatch(/aria-pressed="true"[^>]*>\s*Todas/);
	});
});

describe('News', () => {
	const items = [
		{ id: '1', title: 'Abrimos Valdebebas', source: 'home', meta: 'GOfit Home · Hoy' },
		{ id: '2', title: 'Calendario de formación', source: 'people', unread: true },
		{ id: '3', title: 'Turnos de fin de semana', source: 'home' }
	];
	it('features the first item and lists the rest', () => {
		const out = html(NewsList, { items });
		expect(out).toMatch(/pn-news-featured[\s\S]*Abrimos Valdebebas/);
		expect(out.match(/pn-news-row/g)).toHaveLength(2);
		expect(out).toContain('aria-label="Sin leer"');
	});
	it('filters by source', () => {
		const out = html(NewsList, { items, filter: 'people', filters: [{ value: 'all', label: 'Todas' }, { value: 'people', label: 'Personas' }] });
		expect(out).toContain('Calendario de formación');
		expect(out).not.toContain('Abrimos Valdebebas');
	});
	it('reads one item with a single action', () => {
		const out = html(NewsDetail, { title: 'Abrimos', source: 'GOfit Home', backHref: '/news', action: { label: 'Abrir en SharePoint', href: 'https://x', external: true }, children: text('Cuerpo') });
		expect(out).toMatch(/<h1[^>]*>Abrimos<\/h1>/);
		expect(out).toContain('<p>Cuerpo</p>');
		expect(out).toContain('target="_blank"');
	});
});

describe('BottomSheet and Icon', () => {
	it('renders nothing while closed', () => {
		expect(html(BottomSheet, { open: false, onclose() {}, children: text('x') })).not.toContain('role="dialog"');
	});
	it('is a labelled modal dialog when open', () => {
		const out = html(BottomSheet, { open: true, title: 'Solicitar ausencia', closeLabel: 'Cerrar', onclose() {}, children: text('x') });
		expect(out).toContain('role="dialog"');
		expect(out).toContain('aria-modal="true"');
		expect(out).toContain('Solicitar ausencia');
	});
	it('draws named icons, decorative by default', () => {
		const out = html(Icon, { name: 'clock' });
		expect(out).toContain('<svg');
		expect(out).toContain('aria-hidden="true"');
	});
});
