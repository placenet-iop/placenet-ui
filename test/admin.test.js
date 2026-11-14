import { describe, expect, it } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import AdminShell from '../src/admin/AdminShell.svelte';
import Badge from '../src/admin/Badge.svelte';
import Button from '../src/admin/Button.svelte';
import Callout from '../src/admin/Callout.svelte';
import ConfirmInline from '../src/admin/ConfirmInline.svelte';
import DataTable from '../src/admin/DataTable.svelte';
import Field from '../src/admin/Field.svelte';
import InheritField from '../src/admin/InheritField.svelte';
import SaveIndicator from '../src/admin/SaveIndicator.svelte';
import Section from '../src/admin/Section.svelte';
import SidePanel from '../src/admin/SidePanel.svelte';
import StatusSummary from '../src/admin/StatusSummary.svelte';
import Switch from '../src/admin/Switch.svelte';
import { adminThemeFromUi } from '../src/theme.js';

const html = (Component, props) => render(Component, { props }).body;
const text = (s) => createRawSnippet(() => ({ render: () => `<span>${s}</span>` }));

describe('admin theme', () => {
	it('takes only the organisation accent, never the domain colours', () => {
		const t = adminThemeFromUi({ color: '#0f7c7e', bg: '#14213d', fg: '#ffffff' });
		expect(t.bg).toBeNull();
		expect(t.ink).toBeNull();
		expect(t.accent).toBe('#0f7c7e');
	});
});

describe('AdminShell', () => {
	it('draws tabs with the active one selected, an alert dot read aloud, and the panel', () => {
		const out = html(AdminShell, {
			label: 'Ajustes',
			active: 'domains',
			syncUrl: false,
			tabs: [
				{ id: 'home', label: 'Inicio' },
				{ id: 'domains', label: 'Dominios', badge: 14 },
				{ id: 'connection', label: 'Conexión', alert: 'Requiere atención' }
			],
			children: createRawSnippet((active) => ({ render: () => `<p>panel ${active()}</p>` }))
		});
		expect(out).toContain('role="tablist"');
		expect(out).toMatch(/aria-selected="true"[^>]*>\s*Dominios/);
		expect(out).toContain('Requiere atención');
		expect(out).toContain('<p>panel domains</p>');
	});
});

describe('AdminShell first render', () => {
	const tabs = [
		{ id: 'home', label: 'Inicio' },
		{ id: 'domains', label: 'Dominios' }
	];
	const children = createRawSnippet((active) => ({ render: () => `<p>panel ${active()}</p>` }));
	it('renders the asked tab on the server, not an empty panel', () => {
		expect(html(AdminShell, { label: 'x', tabs, initial: 'domains', syncUrl: false, children })).toContain('<p>panel domains</p>');
	});
	it('falls back to the first tab', () => {
		expect(html(AdminShell, { label: 'x', tabs, initial: 'nope', syncUrl: false, children })).toContain('<p>panel home</p>');
		expect(html(AdminShell, { label: 'x', tabs, syncUrl: false, children })).toContain('<p>panel home</p>');
	});
});

describe('StatusSummary', () => {
	it('lists cards and the problems to fix', () => {
		const out = html(StatusSummary, {
			items: [{ label: 'Pestañas', value: '6 de 8', detail: 'Como la organización' }, { label: 'Conexión', value: 'GOfit España', detail: 'Falló', tone: 'danger' }],
			problems: [{ text: 'Falta el secreto', actionLabel: 'Arreglar', href: '?tab=connection' }]
		});
		expect(out).toContain('6 de 8');
		expect(out).toContain('tone-danger');
		expect(out).toContain('Requiere atención');
		expect(out).toContain('href="?tab=connection"');
	});
});

describe('Section and InheritField', () => {
	it('a section has its title, one line and its status', () => {
		const out = html(Section, { title: 'Pestañas para todos', description: 'Qué ve la gente.', status: text('Guardado'), children: text('campos') });
		expect(out).toMatch(/<h2[^>]*>Pestañas para todos<\/h2>/);
		expect(out).toContain('Guardado');
	});
	it('a collapsible section is a details element', () => {
		expect(html(Section, { title: 'Avanzado', collapsible: true, children: text('x') })).toContain('<details');
	});
	it('inherited shows the organisation value and Personalizar', () => {
		const out = html(InheritField, { label: 'Diseño', inheritedValue: 'Carrusel', custom: false });
		expect(out).toContain('Como la organización');
		expect(out).toContain('Carrusel');
		expect(out).toContain('Personalizar');
	});
	it('customised shows the editor and a reset that can post a clear action', () => {
		const out = html(InheritField, { label: 'Diseño', custom: true, resetAction: '?/clearViews', children: text('editor') });
		expect(out).toContain('Personalizado');
		expect(out).toContain('formaction="?/clearViews"');
		expect(out).toContain('editor');
	});
});

describe('SaveIndicator', () => {
	it('says each state in words', () => {
		expect(html(SaveIndicator, { state: { status: 'saving' } })).toContain('Guardando…');
		expect(html(SaveIndicator, { state: { status: 'saved' } })).toContain('Guardado');
		expect(html(SaveIndicator, { state: { status: 'error', retry: () => {} } })).toContain('Reintentar');
		expect(html(SaveIndicator, { state: { status: 'invalid', message: 'elige una pestaña' } })).toContain('Sin guardar: elige una pestaña');
	});
});

describe('DataTable', () => {
	const rows = [
		{ id: '1', name: 'GOfit Valdebebas', company: 'GOfit España' },
		{ id: '2', name: 'GOfit Olivais', company: 'GOfit Portugal' }
	];
	const columns = [{ key: 'name', label: 'Dominio' }, { key: 'company', label: 'Empresa' }];
	it('draws headers, rows and labels for the stacked phone layout', () => {
		const out = html(DataTable, { rows, columns, search: true });
		expect(out).toMatch(/<th[^>]*>Dominio<\/th>/);
		expect(out).toContain('data-label="Empresa"');
		expect(out).toContain('GOfit Olivais');
		expect(out).toContain('type="search"');
	});
	it('says so when there is nothing', () => {
		expect(html(DataTable, { rows: [], columns, empty: 'Ningún dominio todavía.' })).toContain('Ningún dominio todavía.');
	});
	it('shows the bulk bar while rows are ticked', () => {
		const out = html(DataTable, { rows, columns, selectable: true, selected: new Set(['2']), bulk: createRawSnippet((s) => ({ render: () => `<b>${s().size} seleccionados</b>` })) });
		expect(out).toContain('1 seleccionados');
		expect(out).toMatch(/class="[^"]*ticked/);
	});
});

describe('SidePanel', () => {
	it('is a labelled dialog only while open', () => {
		expect(html(SidePanel, { open: false, title: 'x', onclose() {}, children: text('x') })).not.toContain('role="dialog"');
		const out = html(SidePanel, { open: true, title: 'GOfit Olivais', subtitle: 'Dominio', onclose() {}, children: text('x') });
		expect(out).toContain('role="dialog"');
		expect(out).toMatch(/<h2[^>]*>GOfit Olivais<\/h2>/);
	});
});

describe('controls', () => {
	it('Button, Switch, Badge, Callout', () => {
		expect(html(Button, { type: 'submit', children: text('Guardar y probar') })).toMatch(/<button[^>]*type="submit"/);
		expect(html(Button, { href: '/x', children: text('Abrir') })).toContain('<a');
		const sw = html(Switch, { name: 'notify', checked: true, label: 'Avisar de las noticias', description: 'En el móvil' });
		expect(sw).toContain('role="switch"');
		expect(sw).toContain('checked');
		expect(html(Badge, { tone: 'accent', children: text('Personalizado') })).toContain('tone-accent');
		expect(html(Callout, { tone: 'warn', children: text('Afecta a todos los dominios') })).toContain('role="note"');
	});
	it('Field kinds', () => {
		expect(html(Field, { label: 'ID de la aplicación', name: 'client_id', value: 'abc' })).toMatch(/<label[^>]*>ID de la aplicación<\/label>/);
		const secret = html(Field, { kind: 'secret', label: 'Secreto', name: 'secret', hasValue: true });
		expect(secret).toContain('•••• Guardado');
		expect(secret).not.toContain('type="password"');
		expect(html(Field, { kind: 'secret', label: 'Secreto', name: 'secret' })).toContain('type="password"');
		expect(html(Field, { kind: 'copy', label: 'Dirección de retorno', value: 'https://x/cb' })).toContain('readonly');
		expect(html(Field, { kind: 'select', label: 'Empresa', value: 'pt', options: [{ value: 'es', label: 'España' }, { value: 'pt', label: 'Portugal' }] })).toContain('<select');
	});
	it('ConfirmInline starts as one button', () => {
		const out = html(ConfirmInline, { label: 'Desvincular', question: '¿Desvincular a Lucía?', confirmLabel: 'Sí, desvincular' });
		expect(out).toContain('Desvincular');
		expect(out).not.toContain('Sí, desvincular');
	});
});
