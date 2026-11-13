// Toasts: one short line at the bottom, optionally with ONE action ("Deshacer",
// "Reintentar"). Never window.alert/confirm (a phone's WebView may not show
// them at all). Mount <Toaster /> once in the root layout.

let nextId = 1;

/** @type {{ items: Array<{ id: number, message: string, tone: 'neutral'|'ok'|'error', action?: { label: string, onAction: () => void }, duration: number }> }} */
export const toasts = $state({ items: [] });

const timers = new Map();

/**
 * Show a toast. Returns its id (for dismiss()).
 * @param {{ message: string, tone?: 'neutral'|'ok'|'error', action?: { label: string, onAction: () => void }, duration?: number }} toast
 */
export function pushToast({ message, tone = 'neutral', action, duration }) {
	const id = nextId++;
	// With an action the reader needs time to reach it; errors stay longer too.
	const ms = duration ?? (action ? 6000 : tone === 'error' ? 7000 : 3500);
	toasts.items = [...toasts.items.slice(-2), { id, message, tone, action, duration: ms }];
	if (ms > 0) timers.set(id, setTimeout(() => dismissToast(id), ms));
	return id;
}

export function dismissToast(id) {
	clearTimeout(timers.get(id));
	timers.delete(id);
	toasts.items = toasts.items.filter((t) => t.id !== id);
}
