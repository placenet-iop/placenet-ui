// Theme from the service token's `ui` claim. PURE apart from applyTheme().
//
// The token (placenet internal/servicetoken) carries:
//   ui.color  the ORGANISATION's brand colour  -> the accent
//   ui.bg     the DOMAIN's background          -> the page
//   ui.fg     the DOMAIN's text colour         -> the ink (kept unless illegible)
//   ui.logo
// Each may be null, '' or absent (admin tokens omit bg/fg), and provisioned
// domains can carry unvalidated strings, so every value is normalised here.
//
// Readability is DERIVED, never trusted: a domain can pick any background and
// the app still has to be legible on it (WCAG AA).
//
// Origin: sharepoint/src/lib/theme.js (the most complete of the three copies).

const HEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export const INK_DARK = '#000120'; // Placenet navy
export const INK_LIGHT = '#ffffff';
export const DEFAULT_ACCENT = '#635fe5'; // Placenet purple, when the token has no ui.color

/** '#abc' | 'abc' | '#aabbcc' -> '#aabbcc', or null when it isn't a hex colour. */
export function normalizeHex(value) {
	const raw = String(value ?? '').trim();
	if (!HEX.test(raw)) return null;
	const hex = raw.replace(/^#/, '');
	const full = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;
	return `#${full.toLowerCase()}`;
}

/** WCAG relative luminance (0 = black, 1 = white); null for a bad colour. */
export function relativeLuminance(color) {
	const hex = normalizeHex(color);
	if (!hex) return null;
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
	const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two colours (1-21); 1 when either is invalid. */
export function contrastRatio(a, b) {
	const la = relativeLuminance(a);
	const lb = relativeLuminance(b);
	if (la === null || lb === null) return 1;
	const [hi, lo] = la > lb ? [la, lb] : [lb, la];
	return (hi + 0.05) / (lo + 0.05);
}

/** Navy or white, whichever reads better ON `background`. Navy for a bad colour. */
export function pickInk(background) {
	if (relativeLuminance(background) === null) return INK_DARK;
	return contrastRatio(background, INK_DARK) >= contrastRatio(background, INK_LIGHT) ? INK_DARK : INK_LIGHT;
}

/** Blend `pct`% of `b` into `a` (both hex): the JS twin of color-mix. */
export function mixHex(a, b, pct) {
	const ha = normalizeHex(a);
	const hb = normalizeHex(b);
	if (!ha || !hb) return ha || hb || INK_DARK;
	const t = Math.min(Math.max(pct, 0), 100) / 100;
	const channel = (i) => {
		const va = parseInt(ha.slice(i, i + 2), 16);
		const vb = parseInt(hb.slice(i, i + 2), 16);
		return Math.round(va + (vb - va) * t)
			.toString(16)
			.padStart(2, '0');
	};
	return `#${channel(1)}${channel(3)}${channel(5)}`;
}

/**
 * Keep an intended colour but walk it toward the readable ink until it clears
 * `min` contrast on `background`; the ink itself when even that fails.
 */
export function legibleOn(color, background, min = 4.5) {
	const hex = normalizeHex(color);
	if (!hex) return pickInk(background);
	if (contrastRatio(hex, background) >= min) return hex;
	const ink = pickInk(background);
	for (let pct = 20; pct <= 80; pct += 20) {
		const candidate = mixHex(hex, ink, pct);
		if (contrastRatio(candidate, background) >= min) return candidate;
	}
	return ink;
}

/** The `ui` claim of a JWT, or null. Does not verify: the server already did. */
export function uiFromToken(token) {
	try {
		const part = String(token || '').split('.')[1];
		if (!part) return null;
		const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
		const payload = JSON.parse(decodeURIComponent(escape(json)));
		return payload && typeof payload.ui === 'object' ? payload.ui : null;
	} catch {
		return null;
	}
}

/**
 * The palette for a `ui` claim. Every entry is null when the claim does not
 * set it, so the CSS default stays.
 *
 *   bg         page background            (ui.bg)
 *   ink        text on it                 (ui.fg, walked to AA; derived from bg without fg)
 *   inkMuted   secondary text             (ink faded 35% toward bg, still >= 4.5:1 when possible)
 *   accent     organisation colour        (ui.color, or `ui.accent` for apps that send it)
 *   onAccent   text on the accent
 *   accentText the accent as text/icon on the page, walked to 3:1 (large/bold use)
 */
export function themeFromUi(ui) {
	const bg = normalizeHex(ui?.bg);
	const accent = normalizeHex(ui?.color) || normalizeHex(ui?.accent);
	const ink = bg ? (normalizeHex(ui?.fg) ? legibleOn(ui.fg, bg) : pickInk(bg)) : null;
	let inkMuted = null;
	if (bg && ink) {
		inkMuted = mixHex(ink, bg, 35);
		if (contrastRatio(inkMuted, bg) < 4.5) inkMuted = mixHex(ink, bg, 20);
		if (contrastRatio(inkMuted, bg) < 4.5) inkMuted = ink;
	}
	const page = bg || '#fefdfb';
	return {
		bg,
		ink,
		inkMuted,
		accent,
		onAccent: accent ? pickInk(accent) : null,
		accentText: accent ? legibleOn(accent, page, 3) : null
	};
}

const VARS = {
	bg: '--pn-bg',
	ink: '--pn-ink',
	inkMuted: '--pn-ink-muted',
	accent: '--pn-accent',
	onAccent: '--pn-on-accent',
	accentText: '--pn-accent-text'
};

/**
 * Write a palette onto `root` (default <html>): set what the palette has,
 * REMOVE what it does not, so switching to a token without colours (an admin
 * view) falls back to the CSS defaults instead of keeping the last domain's.
 */
export function applyTheme(theme, root = globalThis.document?.documentElement) {
	if (!root) return;
	for (const [key, cssVar] of Object.entries(VARS)) {
		const value = theme?.[key];
		if (value) root.style.setProperty(cssVar, value);
		else root.style.removeProperty(cssVar);
	}
}

/** Shortcut: theme straight from a JWT. `null` clears back to the defaults. */
export function applyTokenTheme(token, root) {
	applyTheme(token ? themeFromUi(uiFromToken(token)) : null, root);
}

/**
 * Inline <script> for app.html so the first paint already has the domain's
 * colours (no flash of the default background). It reads the last palette the
 * app stored with rememberTheme(). Origin: shift's anti-flicker bootstrap.
 */
export const THEME_BOOTSTRAP = `(function(){try{var t=JSON.parse(localStorage.getItem('pn-theme')||'null');if(!t)return;var s=document.documentElement.style,m={bg:'--pn-bg',ink:'--pn-ink',inkMuted:'--pn-ink-muted',accent:'--pn-accent',onAccent:'--pn-on-accent',accentText:'--pn-accent-text'};for(var k in m){if(t[k])s.setProperty(m[k],t[k]);}}catch(e){}})();`;

/** Store the palette for THEME_BOOTSTRAP; storage may be blocked (private mode, webviews). */
export function rememberTheme(theme) {
	try {
		if (theme) localStorage.setItem('pn-theme', JSON.stringify(theme));
		else localStorage.removeItem('pn-theme');
	} catch {
		// No storage: the page still themes itself once the app runs.
	}
}
