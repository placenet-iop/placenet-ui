# Placenet UI — Style guide

The one look of every Placenet mini-app. It replaces the per-repo copies of
`STYLE_GUIDE.md` (boards, factorial, sharepoint, bookit had drifted apart):
an app's own `docs/STYLE_GUIDE.md` is now a pointer here plus what is truly
its own.

**Rule of thumb:** if two apps show the same kind of thing (a calendar, a news
item, a filter, a tab bar, a confirmation), they use the same component from
this kit. Apps do not draw their own.

## 1. Setup in an app

```js
// package.json
"placenet-ui": "https://github.com/placenet-iop/placenet-ui/archive/refs/tags/v0.2.0.tar.gz"
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import 'placenet-ui/tokens.css';
  import { Toaster, applyTheme, rememberTheme, themeFromUi, uiFromToken } from 'placenet-ui';
  let { data, children } = $props();
  // User views: the domain's colours. Admin views: pass null (never tinted).
  $effect(() => {
    const theme = data.adminView ? null : themeFromUi(uiFromToken(data.token));
    applyTheme(theme);
    rememberTheme(theme);
  });
</script>
{@render children()}
<Toaster />
```

In `src/app.html`, paste the string `THEME_BOOTSTRAP` (from `placenet-ui/theme`)
inside a `<script>` in `<head>`: the first paint already has the domain's
colours, with no flash of the default background.

Use `--pn-*` custom properties for anything the app draws itself. No hex
colours in app components: every colour is a token.

## 2. Colour

| Token | Comes from | Use |
| --- | --- | --- |
| `--pn-bg` | `ui.bg` (domain) | page background |
| `--pn-ink` | `ui.fg` (domain), walked to AA | text |
| `--pn-ink-muted` | ink faded toward bg, still AA | secondary text |
| `--pn-accent` | `ui.color` (organisation), else `#635FE5` | buttons, active tab, selected day, chosen pill |
| `--pn-on-accent` | derived | text on the accent |
| `--pn-accent-text` | accent walked to 3:1 on bg | accent used as text/icon |
| `--pn-accent-soft` | accent 10% on surface | tinted backgrounds (range days, source pill) |
| `--pn-surface` / `-muted` | fixed | cards / segmented track, chips |
| `--pn-line` / `-strong` | fixed | separators / grips, disabled fills |
| `--pn-ok/warn/danger/info` (+`-soft`) | fixed | states; text on its soft bg clears AA |

Admin views (`.well-known/placenet/*`) are seen inside the dashboard, so they
keep the dashboard's page (background, lines, text) and take only the
**organisation's accent**, as the dashboard tints its own primary buttons:
`applyTokenTheme(token, { admin: true })`. The domain's bg/fg never apply there.

## 3. Type, shape, touch

The kit's defaults ARE the dashboard's theme (`dashboard/theme/theme.tsx`).

- Fonts: **Roboto** for text, **Rethink Sans** for titles, as in the dashboard (bundled by the kit; no Google Fonts request). Sizes 12 / 14 (body, Mantine md) / 16 / 18 / 20 (section and panel titles, Mantine h4) / 26 (user screen titles). Nothing under 12 px.
- Radius: inputs 4 (dashboard default), buttons 12, cards 16, sheets 24. User-view cards are white with `--pn-shadow-card`; admin sections are white with a `--pn-line` border, like the dashboard's papers.
- Every tappable thing is at least 44 px (`--pn-touch`); admin inputs are 40 px tall, buttons 50 (dashboard size lg).

## 4. Icons

Only `<Icon name="…" />`: **Tabler**, the dashboard's set (`@tabler/icons-react`
there, `@tabler/icons-svelte-runes` here), outline. Stroke 1.5 in user views
(small phone screens), `stroke={1}` in admin views to match the dashboard's
1px. 24 px in the tab bar, 20–22 px in rows. Semantic names keep apps aligned:
`clock` (fichar), `shifts`, `timeoff`, `documents`, `payroll`, `news`, `org`,
`people`, `notifications`, `chat`, `settings`, `more`… Add an icon in
`src/components/Icon.svelte`, never paste SVG paths into an app.

## 5. Components and when to use them

| Need | Component | Notes |
| --- | --- | --- |
| Navigate the app | `TabBar` | max 4 tabs + "Más" (sheet with the rest). Active tab in accent. |
| A one-tap action that must not happen by accident | `SwipeConfirm` | Sliding is the confirmation: no dialog after it. `tone="forward"` (start/accept), `"back"` (stop/close). Long press and a hidden button keep it accessible. |
| How much is left today | `DayProgress` | One bar, never a list of segments. No bar on a day off. |
| Say something happened (optionally undo) | `pushToast()` + `<Toaster/>` | Never `alert()`/`confirm()`. |
| A form, a menu, a detail | `BottomSheet` | If it does not fit in a sheet it is a page. Primary action in `footer`. |
| 2–4 views of the same thing | `SegmentedControl` | Nóminas · Horarios · Otros; Chat \| Guía; Día · Semana · Mes. |
| Filter a list | `FilterPills` | Todas · per source. Scrolls sideways. |
| Pick a day / a range / show days | `Calendar` | `mode` single · range · view; `isDisabled`, `isStruck` (holidays), `markers`. Today and holidays come from the app. |
| News, posts, guide entries | `NewsList`, `NewsCard`, `NewsDetail` | Featured first, rows with same-size thumbnails, unread dot; detail with hero, source pill and one secondary action. |

The kit has **no words of its own**: every label is a prop, in the app's
language (Spanish defaults only as a fallback).

## 6. Admin views (`placenet-ui/admin`)

The admin of every app is opened from the dashboard (the app's config drawer,
or the organisation page), so it is built with the dashboard's pieces:

| Need | Component | Like the dashboard's |
| --- | --- | --- |
| Page with tabs (Inicio · Contenido · Notificaciones · Dominios · Conexión) | `AdminShell` | Tabs: 14px, padding 16, active in accent with underline. `?tab=` in the address. No big title (the drawer has it). |
| State on arrival + what needs a look | `StatusSummary` | 3–4 cards; "Requiere atención" links to the fix. |
| One question of the page | `Section` | Title (Rethink Sans), one line of help, save state on the right; `collapsible` for Avanzado / Conexión. |
| "Follows the organisation unless changed here" | `InheritField` | *Como la organización* · Personalizar / *Personalizado* · Restablecer. Never tri-state selects. |
| Save state | `SaveIndicator` + `saveState` / `saveForm` / `autosubmit` | Like the dashboard's autosave: "Guardando… / Guardado / No se guardó · Reintentar". Sections save on change through their existing form action; credentials and legal settings keep an explicit `Button type="submit"`. |
| A list to work through | `DataTable` | Table module: headers gray.7, cells 16/24, hovered row in accent; search, selection with Shift+click and a bulk bar; cards on a phone. |
| Edit a row without leaving | `SidePanel` | Drawer from the right, h4 title, blurred page behind. |
| Inputs | `Field` (text, url, email, number, textarea, select, secret, copy), `Switch` | Mantine md inputs (40px, radius 4), 48×24 switch. Secrets show "•••• Guardado · Cambiar". |
| Buttons, states, notices | `Button`, `Badge`, `Callout`, `ConfirmInline`, `EmptyState` | Buttons radius 12; confirmations in place, never `window.confirm`. |

## 7. Writing

- To admins: *Organización*, *Dominio*, *Pestañas*, *Personalizado* /
  *Restablecer*, *Conexión propia*, *Personas*, *Rol*. Never "tenant",
  "espacio", "sobrescribe", "override", "slug", "OAuth" (except naming a menu
  of another product).
- One line of help under a title; more goes behind a link.
- Saving: admin sections save on change with a "Guardando… / Guardado"
  indicator; credentials and legal settings keep an explicit button.

## Dark domains (0.3.1)

On a domain whose background is dark, `themeFromUi` also sets `--pn-surface`,
`--pn-surface-muted`, `--pn-line`, `--pn-line-strong` and `--pn-ink-subtle` to
lighter shades of that background, so cards, sheets, the tab bar and pills keep
the page's light ink readable. It also writes the accent's tones
(`--pn-accent-soft`, `--pn-accent-press`, `--pn-focus`) as values, so they follow
an accent applied on any element, not only `:root`. Apps should drop local
"white-on-white" workarounds once on 0.3.1.
