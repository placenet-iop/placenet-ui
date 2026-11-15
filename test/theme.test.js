import { describe, expect, it } from 'vitest';
import {
	applyTheme,
	contrastRatio,
	legibleOn,
	normalizeHex,
	pickInk,
	themeFromUi,
	uiFromToken,
	INK_DARK,
	INK_LIGHT
} from '../src/theme.js';

function jwt(payload) {
	const b64 = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	return `${b64('{"alg":"none"}')}.${b64(JSON.stringify(payload))}.sig`;
}

describe('normalizeHex', () => {
	it('accepts #rgb, rgb and #rrggbb, lower-cased', () => {
		expect(normalizeHex('#ABC')).toBe('#aabbcc');
		expect(normalizeHex('abc')).toBe('#aabbcc');
		expect(normalizeHex(' #635FE5 ')).toBe('#635fe5');
	});
	it('rejects anything else', () => {
		for (const bad of [null, undefined, '', 'red', '#12', 'url(x)', '#1234567']) expect(normalizeHex(bad)).toBeNull();
	});
});

describe('pickInk and legibleOn', () => {
	it('navy on light, white on dark', () => {
		expect(pickInk('#ffffff')).toBe(INK_DARK);
		expect(pickInk('#101010')).toBe(INK_LIGHT);
		expect(pickInk('nonsense')).toBe(INK_DARK);
	});
	it('keeps a legible colour and walks an illegible one to AA', () => {
		expect(legibleOn('#000120', '#ffffff')).toBe('#000120');
		const walked = legibleOn('#7fb77e', '#2e6b2d');
		expect(contrastRatio(walked, '#2e6b2d')).toBeGreaterThanOrEqual(4.5);
	});
});

describe('themeFromUi', () => {
	it('is all null without a claim, so the CSS defaults stay', () => {
		expect(Object.values(themeFromUi(null)).every((v) => v === null)).toBe(true);
	});
	it('keeps the domain text colour when it reads on its background', () => {
		const t = themeFromUi({ bg: '#fefdfb', fg: '#1f1f33', color: '#0f7c7e' });
		expect(t.bg).toBe('#fefdfb');
		expect(t.ink).toBe('#1f1f33');
		expect(t.accent).toBe('#0f7c7e');
		expect(t.onAccent).toBe(INK_LIGHT);
		expect(contrastRatio(t.inkMuted, t.bg)).toBeGreaterThanOrEqual(4.5);
	});
	it('derives a readable ink on a dark domain without fg', () => {
		const t = themeFromUi({ bg: '#14213d' });
		expect(t.ink).toBe(INK_LIGHT);
		expect(contrastRatio(t.inkMuted, t.bg)).toBeGreaterThanOrEqual(4.5);
	});
	it('fixes an illegible fg instead of trusting it', () => {
		const t = themeFromUi({ bg: '#ffffff', fg: '#f2f2f2' });
		expect(contrastRatio(t.ink, '#ffffff')).toBeGreaterThanOrEqual(4.5);
	});
	it('reads ui.accent when an app sends that instead of ui.color', () => {
		expect(themeFromUi({ accent: '#e51943' }).accent).toBe('#e51943');
	});
	it('makes the accent usable as text on the page (3:1)', () => {
		const t = themeFromUi({ bg: '#ffffff', color: '#ffe066' });
		expect(contrastRatio(t.accentText, '#ffffff')).toBeGreaterThanOrEqual(3);
	});
});

describe('uiFromToken', () => {
	it('reads the ui claim of a JWT, UTF-8 safe', () => {
		expect(uiFromToken(jwt({ sub: 'Núria', ui: { color: '#635fe5', bg: '#fff' } }))).toEqual({ color: '#635fe5', bg: '#fff' });
	});
	it('is null for anything that is not a token with ui', () => {
		for (const bad of [null, '', 'abc', 'a.b.c', jwt({ sub: 1 })]) expect(uiFromToken(bad)).toBeNull();
	});
});

describe('applyTheme', () => {
	it('sets what the palette has and removes the rest', () => {
		const styles = new Map([['--pn-ink', '#123456']]);
		const root = { style: { setProperty: (k, v) => styles.set(k, v), removeProperty: (k) => styles.delete(k) } };
		applyTheme(themeFromUi({ color: '#635fe5' }), root);
		expect(styles.get('--pn-accent')).toBe('#635fe5');
		expect(styles.has('--pn-ink')).toBe(false);
		applyTheme(null, root);
		expect(styles.size).toBe(0);
	});
});

describe('dark pages keep cards readable', () => {
	it('a dark domain gets dark surfaces the light ink reads on', async () => {
		const { themeFromUi, contrastRatio } = await import('../src/theme.js');
		const t = themeFromUi({ bg: '#14213d', fg: '#ffffff', color: '#0f7c7e' });
		expect(t.surface).not.toBeNull();
		expect(contrastRatio(t.ink, t.surface)).toBeGreaterThanOrEqual(4.5);
		expect(contrastRatio(t.inkSubtle, t.surface)).toBeGreaterThanOrEqual(4.5);
		expect(t.accentSoft).toMatch(/^#[0-9a-f]{6}$/);
		expect(contrastRatio(t.ink, t.accentSoft)).toBeGreaterThanOrEqual(4.5);
	});
	it('a dark domain without an accent still redoes the purple tones', async () => {
		const { themeFromUi } = await import('../src/theme.js');
		const t = themeFromUi({ bg: '#000000' });
		expect(t.accent).toBeNull();
		expect(t.accentSoft).not.toBeNull();
	});
	it('a light domain keeps the white surfaces', async () => {
		const { themeFromUi } = await import('../src/theme.js');
		const t = themeFromUi({ bg: '#fff8e1', color: '#0f7c7e' });
		expect(t.surface).toBeNull();
		expect(t.line).toBeNull();
		expect(t.focus).toBe('rgba(15, 124, 126, 0.3)');
	});
	it('admin sets the accent tones and nothing of the page', async () => {
		const { adminThemeFromUi } = await import('../src/theme.js');
		const t = adminThemeFromUi({ color: '#0f7c7e', bg: '#000000' });
		expect(t.surface).toBeNull();
		expect(t.accentPress).toMatch(/^#/);
	});
});
