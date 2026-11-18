# placenet-ui

Shared UI kit of the Placenet mini-apps and their admin views (SvelteKit, Svelte 5): the dashboard's tokens,
the theme read from the PlaceNet service token, and the components every app
uses for the same things (tab bar, swipe to confirm, day progress, sheets,
segmented controls, filter pills, calendar, news, toasts, icons).

- **How it looks and when to use what:** [STYLE_GUIDE.md](STYLE_GUIDE.md)
- **Rules, release process and which apps use it:** `placenet-app/ui-kit/design.md`
  in the (private) [documentation](https://github.com/placenet-iop/documentation/blob/master/placenet-app/ui-kit/design.md) repo
- **Install in an app:** `"placenet-ui": "https://github.com/placenet-iop/placenet-ui/archive/refs/tags/vX.Y.Z.tar.gz"`
  (a tag, never a branch). Use the tarball URL, not `github:` or `git+https`: npm
  rewrites those to `git+ssh` in the lockfile and an image build without an SSH
  key fails. Install with plain `npm install` (not `--legacy-peer-deps`) when
  the app's Dockerfile runs plain `npm ci`. Source package: no build step.
- **Develop:** `npm install --legacy-peer-deps && npm test`

Rules for changes: no hex colour inside `src/components` (a test enforces it),
no user-facing text without a prop, every component keyboard- and
screen-reader-usable, and a new tag for every release.

Contents: `src/tokens.css`, `src/theme.js` (palette from `ui.bg` / `ui.fg` /
`ui.color`, WCAG AA), `src/calendar.js` (pure date maths), `src/toast.svelte.js`,
`src/components/*`.
