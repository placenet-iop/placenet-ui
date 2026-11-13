// placenet-ui/admin: the admin views of an app, as the dashboard draws its
// own screens (they are shown inside the dashboard's drawer). See STYLE_GUIDE.md §7.
// Theme: applyTokenTheme(token, { admin: true }) — dashboard page, organisation accent.

export { default as AdminShell } from './AdminShell.svelte';
export { default as StatusSummary } from './StatusSummary.svelte';
export { default as Section } from './Section.svelte';
export { default as InheritField } from './InheritField.svelte';
export { default as SaveIndicator } from './SaveIndicator.svelte';
export { default as DataTable } from './DataTable.svelte';
export { default as SidePanel } from './SidePanel.svelte';
export { default as Button } from './Button.svelte';
export { default as Switch } from './Switch.svelte';
export { default as Field } from './Field.svelte';
export { default as Badge } from './Badge.svelte';
export { default as Callout } from './Callout.svelte';
export { default as ConfirmInline } from './ConfirmInline.svelte';
export { default as EmptyState } from './EmptyState.svelte';
export { saveState, saveForm, autosubmit } from './save.svelte.js';
export { adminThemeFromUi, applyTokenTheme } from '../theme.js';
export { default as Icon } from '../components/Icon.svelte';
