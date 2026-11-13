// Shared behaviour of BottomSheet and SidePanel: one stack of open dialogs,
// focus moved in and back, Tab trapped, Escape closes the TOP one, page scroll
// locked while any is open. Used as a Svelte action on the dialog element:
//   <div use:modal={{ onclose, dismissible }} tabindex="-1" role="dialog">

const FOCUSABLE = [
	'button:not([disabled])',
	'[href]',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'summary',
	'[tabindex]'
]
	.map((sel) => `${sel}:not([tabindex="-1"])`)
	.join(', ');

let stack = [];
let savedOverflow = '';

export function modal(node, params) {
	let { onclose, dismissible = true } = params || {};
	const id = Symbol('dialog');
	stack = [...stack, id];
	const isTop = () => stack[stack.length - 1] === id;
	const previous = document.activeElement;
	if (stack.length === 1) {
		savedOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	}
	// The panel, not its first field: a phone keyboard would cover half of it.
	queueMicrotask(() => node.focus({ preventScroll: true }));

	function onKey(event) {
		if (!isTop()) return;
		if (event.key === 'Escape' && dismissible) {
			event.preventDefault();
			onclose?.();
		} else if (event.key === 'Tab') {
			const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
			if (!items.length) {
				event.preventDefault();
				return;
			}
			const first = items[0];
			const last = items[items.length - 1];
			const inside = node.contains(document.activeElement);
			if (event.shiftKey && (document.activeElement === first || document.activeElement === node || !inside)) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && (document.activeElement === last || !inside)) {
				event.preventDefault();
				first.focus();
			}
		}
	}
	window.addEventListener('keydown', onKey);

	return {
		update(next) {
			({ onclose, dismissible = true } = next || {});
		},
		destroy() {
			stack = stack.filter((s) => s !== id);
			window.removeEventListener('keydown', onKey);
			if (!stack.length) document.body.style.overflow = savedOverflow;
			if (previous instanceof HTMLElement && document.contains(previous)) previous.focus({ preventScroll: true });
		}
	};
}
