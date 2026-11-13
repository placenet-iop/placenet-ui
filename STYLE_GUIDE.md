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
"placenet-ui": "git+https://github.com/placenet-iop/placenet-ui.git#v0.1.0"
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

Admin views (`.well-known/placenet/*`) are never tinted by the domain: they
keep the defaults and use the accent only for the primary button.

## 3. Type, shape, touch

- Font: **Inter** (bundled by the kit; no Google Fonts request). Sizes 12 / 14 / 16 / 18 / 26 (`--pn-text-xs…xl`). Nothing under 12 px.
- Radius: fields 8, buttons 12, cards 16–20, sheets 24. Cards are white with `--pn-shadow-card`, no grey border.
- Every tappable thing is at least 44 px (`--pn-touch`).

## 4. Icons

Only `<Icon name="…" />`: Lucide, outline, stroke 1.8, 24 px in the tab bar,
20–22 px in rows. Semantic names keep apps aligned: `clock` (fichar),
`shifts`, `timeoff`, `documents`, `payroll`, `news`, `org`, `people`,
`notifications`, `chat`, `settings`, `more`… Add an icon in
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

## 6. Writing

- To admins: *Organización*, *Dominio*, *Pestañas*, *Personalizado* /
  *Restablecer*, *Conexión propia*, *Personas*, *Rol*. Never "tenant",
  "espacio", "sobrescribe", "override", "slug", "OAuth" (except naming a menu
  of another product).
- One line of help under a title; more goes behind a link.
- Saving: admin sections save on change with a "Guardando… / Guardado"
  indicator; credentials and legal settings keep an explicit button.
