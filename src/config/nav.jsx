import {
  IconDashboard,
  IconUsers,
  IconFile,
  IconList,
  IconMail,
  IconActivity,
  IconLogs,
  IconSettings,
  IconCreditCard,
} from '../components/Icons.jsx'

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: IconDashboard, end: true },
  { path: '/users', label: 'Users', icon: IconUsers },
  { path: '/subscriptions', label: 'Subscriptions', icon: IconCreditCard },
  { path: '/templates', label: 'Email Compose', icon: IconFile },
  { path: '/lists', label: 'Lists', icon: IconList },
  { path: '/campaigns', label: 'Campaigns', icon: IconMail },
  { path: '/sends', label: 'All Sends', icon: IconActivity },
  { path: '/logs', label: 'System Logs', icon: IconLogs },
  { path: '/settings', label: 'Settings', icon: IconSettings },
]
