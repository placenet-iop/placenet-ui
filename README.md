# placenet-ui

Shared UI kit of the Placenet mini-apps (SvelteKit, Svelte 5): design tokens,
the theme read from the PlaceNet service token, and the components every app
uses for the same things (tab bar, swipe to confirm, day progress, sheets,
segmented controls, filter pills, calendar, news, toasts, icons).

- **How it looks and when to use what:** [STYLE_GUIDE.md](STYLE_GUIDE.md)
- **Install in an app:** `"placenet-ui": "git+https://github.com/placenet-iop/placenet-ui.git#vX.Y.Z"`
  (a tag, never a branch). Source package: no build step, no `prepare` script.
- **Develop:** `npm install --legacy-peer-deps && npm test`

Rules for changes: no hex colour inside `src/components` (a test enforces it),
no user-facing text without a prop, every component keyboard- and
screen-reader-usable, and a new tag for every release.

Contents: `src/tokens.css`, `src/theme.js` (palette from `ui.bg` / `ui.fg` /
`ui.color`, WCAG AA), `src/calendar.js` (pure date maths), `src/toast.svelte.js`,
`src/components/*`.
