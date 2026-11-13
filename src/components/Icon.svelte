<script module>
	// The ONE icon set of every Placenet app: Lucide, outline, stroke 1.8.
	// Apps name icons (`<Icon name="clock" />`) instead of pasting SVG paths, so
	// a tab bar in Shift and one in Factorial draw the same clock. To add an
	// icon: import it here and give it a name (lucide.dev for the catalogue).
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Bell from '@lucide/svelte/icons/bell';
	import Building from '@lucide/svelte/icons/building-2';
	import Calendar from '@lucide/svelte/icons/calendar';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronsLeft from '@lucide/svelte/icons/chevrons-left';
	import ChevronsRight from '@lucide/svelte/icons/chevrons-right';
	import Clock from '@lucide/svelte/icons/clock';
	import Coffee from '@lucide/svelte/icons/coffee';
	import Download from '@lucide/svelte/icons/download';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import FileText from '@lucide/svelte/icons/file-text';
	import Folder from '@lucide/svelte/icons/folder';
	import Funnel from '@lucide/svelte/icons/funnel';
	import History from '@lucide/svelte/icons/history';
	import House from '@lucide/svelte/icons/house';
	import Image from '@lucide/svelte/icons/image';
	import Info from '@lucide/svelte/icons/info';
	import Link from '@lucide/svelte/icons/link';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import LogOut from '@lucide/svelte/icons/log-out';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Network from '@lucide/svelte/icons/network';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Plus from '@lucide/svelte/icons/plus';
	import Receipt from '@lucide/svelte/icons/receipt';
	import Search from '@lucide/svelte/icons/search';
	import Settings from '@lucide/svelte/icons/settings';
	import Share from '@lucide/svelte/icons/share-2';
	import Star from '@lucide/svelte/icons/star';
	import Timer from '@lucide/svelte/icons/timer';
	import Trash from '@lucide/svelte/icons/trash-2';
	import TreePalm from '@lucide/svelte/icons/tree-palm';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import User from '@lucide/svelte/icons/user';
	import Users from '@lucide/svelte/icons/users';
	import X from '@lucide/svelte/icons/x';

	/** Name -> component. Semantic aliases (timeoff, payroll…) keep apps consistent. */
	export const ICONS = {
		'arrow-left': ArrowLeft,
		'arrow-right': ArrowRight,
		back: ChevronLeft,
		bell: Bell,
		building: Building,
		calendar: Calendar,
		'calendar-days': CalendarDays,
		check: Check,
		'chevron-down': ChevronDown,
		'chevron-left': ChevronLeft,
		'chevron-right': ChevronRight,
		'chevrons-left': ChevronsLeft,
		'chevrons-right': ChevronsRight,
		chat: MessageCircle,
		clock: Clock,
		close: X,
		break: Coffee,
		documents: Folder,
		download: Download,
		edit: Pencil,
		external: ExternalLink,
		file: FileText,
		filter: Funnel,
		folder: Folder,
		history: History,
		home: House,
		image: Image,
		info: Info,
		link: Link,
		loading: LoaderCircle,
		logout: LogOut,
		more: Ellipsis,
		news: Newspaper,
		notifications: Bell,
		org: Network,
		payroll: Receipt,
		person: User,
		people: Users,
		place: MapPin,
		plus: Plus,
		search: Search,
		settings: Settings,
		share: Share,
		shifts: CalendarDays,
		star: Star,
		timeoff: TreePalm,
		timer: Timer,
		trash: Trash,
		warning: TriangleAlert
	};
</script>

<script>
	/**
	 * @typedef {keyof typeof ICONS} IconName
	 * @type {{ name: IconName, size?: number, stroke?: number, label?: string, class?: string }}
	 */
	let { name, size = 24, stroke = 1.8, label = '', class: className = '' } = $props();
	const Component = $derived(ICONS[name]);
</script>

{#if Component}
	<Component
		{size}
		strokeWidth={stroke}
		class="pn-icon {className}"
		aria-hidden={label ? undefined : 'true'}
		aria-label={label || undefined}
		role={label ? 'img' : undefined}
	/>
{/if}
