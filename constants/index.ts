import {
  Clapperboard,
  Folder,
  Info,
  LayoutDashboard,
  Share2,
  SquarePen,
  CloudDownload,
  Trash,
  Images,
  ChartPie,
} from 'lucide-react';

export const navItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    url: '/',
  },
  {
    name: 'Documents',
    icon: Folder,
    url: '/documents',
  },
  {
    name: 'Images',
    icon: Images,
    url: '/images',
  },
  {
    name: 'Media',
    icon: Clapperboard,
    url: '/media',
  },
  {
    name: 'Others',
    icon: ChartPie,
    url: '/others',
  },
];

export const actionsDropdownItems = [
  {
    label: 'Rename',
    icon: SquarePen,
    value: 'rename',
  },
  {
    label: 'Details',
    icon: Info,
    value: 'details',
  },
  {
    label: 'Share',
    icon: Share2,
    value: 'share',
  },
  {
    label: 'Download',
    icon: CloudDownload,
    value: 'download',
  },
  {
    label: 'Delete',
    icon: Trash,
    value: 'delete',
  },
];

export const sortTypes = [
  {
    label: 'Date created (newest)',
    value: '$createdAt-desc',
  },
  {
    label: 'Created Date (oldest)',
    value: '$createdAt-asc',
  },
  {
    label: 'Name (A-Z)',
    value: 'name-asc',
  },
  {
    label: 'Name (Z-A)',
    value: 'name-desc',
  },
  {
    label: 'Size (Highest)',
    value: 'size-desc',
  },
  {
    label: 'Size (Lowest)',
    value: 'size-asc',
  },
];

export const avatarPlaceholderUrl =
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
