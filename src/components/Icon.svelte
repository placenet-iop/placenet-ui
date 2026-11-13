<script module>
	// The ONE icon set of Placenet: Tabler (outline), the same set the dashboard
	// uses (@tabler/icons-react there, @tabler/icons-svelte-runes here). Apps name
	// icons (`<Icon name="clock" />`) instead of pasting SVG paths, so the clock
	// of Shift, Factorial and the dashboard is the same drawing.
	// Stroke: the dashboard draws Tabler at 1px (theme/globals.css); admin views
	// pass stroke={1} to match it, user views keep 1.5 for small phone screens.
	// To add an icon: import it here and give it a name (tabler.io/icons).
	import AlertTriangle from '@tabler/icons-svelte-runes/icons/alert-triangle';
	import ArrowLeft from '@tabler/icons-svelte-runes/icons/arrow-left';
	import ArrowRight from '@tabler/icons-svelte-runes/icons/arrow-right';
	import Beach from '@tabler/icons-svelte-runes/icons/beach';
	import Bell from '@tabler/icons-svelte-runes/icons/bell';
	import BuildingCommunity from '@tabler/icons-svelte-runes/icons/building-community';
	import Calendar from '@tabler/icons-svelte-runes/icons/calendar';
	import CalendarEvent from '@tabler/icons-svelte-runes/icons/calendar-event';
	import CalendarTime from '@tabler/icons-svelte-runes/icons/calendar-time';
	import Check from '@tabler/icons-svelte-runes/icons/check';
	import ChevronDown from '@tabler/icons-svelte-runes/icons/chevron-down';
	import ChevronLeft from '@tabler/icons-svelte-runes/icons/chevron-left';
	import ChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right';
	import ChevronsLeft from '@tabler/icons-svelte-runes/icons/chevrons-left';
	import ChevronsRight from '@tabler/icons-svelte-runes/icons/chevrons-right';
	import Clock from '@tabler/icons-svelte-runes/icons/clock';
	import Coffee from '@tabler/icons-svelte-runes/icons/coffee';
	import Dots from '@tabler/icons-svelte-runes/icons/dots';
	import Download from '@tabler/icons-svelte-runes/icons/download';
	import ExternalLink from '@tabler/icons-svelte-runes/icons/external-link';
	import FileText from '@tabler/icons-svelte-runes/icons/file-text';
	import Filter from '@tabler/icons-svelte-runes/icons/filter';
	import Folder from '@tabler/icons-svelte-runes/icons/folder';
	import History from '@tabler/icons-svelte-runes/icons/history';
	import Home from '@tabler/icons-svelte-runes/icons/home';
	import InfoCircle from '@tabler/icons-svelte-runes/icons/info-circle';
	import Link from '@tabler/icons-svelte-runes/icons/link';
	import Loader from '@tabler/icons-svelte-runes/icons/loader-2';
	import Logout from '@tabler/icons-svelte-runes/icons/logout';
	import MapPin from '@tabler/icons-svelte-runes/icons/map-pin';
	import MessageCircle from '@tabler/icons-svelte-runes/icons/message-circle';
	import News from '@tabler/icons-svelte-runes/icons/news';
	import Pencil from '@tabler/icons-svelte-runes/icons/pencil';
	import Photo from '@tabler/icons-svelte-runes/icons/photo';
	import Plus from '@tabler/icons-svelte-runes/icons/plus';
	import Receipt from '@tabler/icons-svelte-runes/icons/receipt';
	import Search from '@tabler/icons-svelte-runes/icons/search';
	import Settings from '@tabler/icons-svelte-runes/icons/settings';
	import Share from '@tabler/icons-svelte-runes/icons/share';
	import Sitemap from '@tabler/icons-svelte-runes/icons/sitemap';
	import Star from '@tabler/icons-svelte-runes/icons/star';
	import Trash from '@tabler/icons-svelte-runes/icons/trash';
	import User from '@tabler/icons-svelte-runes/icons/user';
	import Users from '@tabler/icons-svelte-runes/icons/users';
	import X from '@tabler/icons-svelte-runes/icons/x';

	/** Name -> component. Semantic names (timeoff, payroll…) keep apps aligned. */
	export const ICONS = {
		'arrow-left': ArrowLeft,
		'arrow-right': ArrowRight,
		back: ChevronLeft,
		bell: Bell,
		break: Coffee,
		building: BuildingCommunity,
		calendar: Calendar,
		'calendar-event': CalendarEvent,
		chat: MessageCircle,
		check: Check,
		'chevron-down': ChevronDown,
		'chevron-left': ChevronLeft,
		'chevron-right': ChevronRight,
		'chevrons-left': ChevronsLeft,
		'chevrons-right': ChevronsRight,
		clock: Clock,
		close: X,
		documents: Folder,
		download: Download,
		edit: Pencil,
		external: ExternalLink,
		file: FileText,
		filter: Filter,
		folder: Folder,
		history: History,
		home: Home,
		image: Photo,
		info: InfoCircle,
		link: Link,
		loading: Loader,
		logout: Logout,
		more: Dots,
		news: News,
		notifications: Bell,
		org: Sitemap,
		payroll: Receipt,
		people: Users,
		person: User,
		place: MapPin,
		plus: Plus,
		search: Search,
		settings: Settings,
		share: Share,
		shifts: CalendarTime,
		star: Star,
		timeoff: Beach,
		trash: Trash,
		warning: AlertTriangle
	};
</script>

<script>
	/**
	 * @typedef {keyof typeof ICONS} IconName
	 * @type {{ name: IconName, size?: number, stroke?: number, label?: string, class?: string }}
	 */
	let { name, size = 24, stroke = 1.5, label = '', class: className = '' } = $props();
	const Component = $derived(ICONS[name]);
</script>

{#if Component}
	<Component
		{size}
		{stroke}
		class="pn-icon {className}"
		aria-hidden={label ? undefined : 'true'}
		aria-label={label || undefined}
		role={label ? 'img' : undefined}
	/>
{/if}
