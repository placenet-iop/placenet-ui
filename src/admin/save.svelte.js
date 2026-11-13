// Autosave for admin sections, on top of SvelteKit form actions WITHOUT
// importing SvelteKit (the kit stays framework-agnostic):
//
//   <script>
//     import { enhance } from '$app/forms';
//     import { saveState, saveForm, autosubmit, SaveIndicator } from 'placenet-ui/admin';
//     const save = saveState();
//   </script>
//   <Section title="…">
//     {#snippet status()}<SaveIndicator state={save} />{/snippet}
//     <form method="POST" action="?/views" use:enhance={saveForm(save)} use:autosubmit>
//       …fields…
//     </form>
//   </Section>
//
// `autosubmit` submits the form on `change` at once and on `input` after a
// pause, one request at a time (a change during a save is sent after it).
// `saveForm` turns the action's result into the indicator's state; a failure
// keeps the page's data (update with reset: false) so nothing typed is lost.

/** A reactive save state for one section. */
export function saveState() {
	const s = $state({ status: 'idle', message: '', retry: null });
	return s;
}

/**
 * The `use:enhance` callback for a section's form.
 * @param {ReturnType<typeof saveState>} state
 * @param {{ errorMessage?: (result: any) => string, sessionExpired?: string, onSaved?: () => void, savedFor?: number }} [opts]
 */
export function saveForm(state, opts = {}) {
	const { errorMessage, sessionExpired = '', onSaved, savedFor = 3000 } = opts;
	return ({ formElement }) => {
		state.status = 'saving';
		state.message = '';
		state.retry = null;
		// Tell autosubmit the request is over, whatever happened, so it can send a queued change.
		const done = () => formElement.dispatchEvent(new CustomEvent('pn:saved'));
		return async ({ result, update }) => {
			if (result.type === 'success' || result.type === 'redirect') {
				await update({ reset: false, invalidateAll: true });
				state.status = 'saved';
				done();
				onSaved?.();
				const stamp = Symbol();
				state._stamp = stamp;
				setTimeout(() => {
					if (state._stamp === stamp && state.status === 'saved') state.status = 'idle';
				}, savedFor);
				return;
			}
			// failure (validation) or error (expired token, server down)
			state.status = 'error';
			state.message =
				result.type === 'error' && sessionExpired
					? sessionExpired
					: errorMessage?.(result) || (typeof result.data?.message === 'string' ? result.data.message : '');
			state.retry = () => formElement.requestSubmit();
			// Put the fields back on what is stored: the page never shows a value that was not saved.
			await update({ reset: false, invalidateAll: true });
			done();
		};
	};
}

/**
 * Svelte action: submit the form when its fields change.
 * @param {HTMLFormElement} form
 * @param {{ delay?: number, valid?: (form: HTMLFormElement) => boolean | string }} [params]
 */
export function autosubmit(form, params = {}) {
	let { delay = 600, valid } = params;
	let timer = null;
	let busy = false;
	let queued = false;

	function send() {
		clearTimeout(timer);
		if (valid) {
			const verdict = valid(form);
			if (verdict !== true) {
				form.dispatchEvent(new CustomEvent('pn:invalid', { detail: typeof verdict === 'string' ? verdict : '' }));
				return;
			}
		}
		if (busy) {
			queued = true;
			return;
		}
		busy = true;
		form.requestSubmit();
	}
	const onChange = (event) => {
		if (event.target?.closest?.('[data-no-autosave]')) return;
		send();
	};
	const onInput = (event) => {
		if (event.target?.closest?.('[data-no-autosave]')) return;
		const type = event.target?.type;
		if (type === 'checkbox' || type === 'radio' || event.target?.tagName === 'SELECT') return; // change handles them
		clearTimeout(timer);
		timer = setTimeout(send, delay);
	};
	const onBlur = (event) => {
		if (timer && form.contains(event.target)) send();
	};
	// saveForm dispatches pn:saved when the request is over (saved or not).
	const onDone = () => {
		busy = false;
		if (queued) {
			queued = false;
			send();
		}
	};
	form.addEventListener('change', onChange);
	form.addEventListener('input', onInput);
	form.addEventListener('focusout', onBlur);
	form.addEventListener('pn:saved', onDone);

	return {
		update(next) {
			({ delay = 600, valid } = next || {});
		},
		destroy() {
			clearTimeout(timer);
			form.removeEventListener('change', onChange);
			form.removeEventListener('input', onInput);
			form.removeEventListener('focusout', onBlur);
			form.removeEventListener('pn:saved', onDone);
		}
	};
}
