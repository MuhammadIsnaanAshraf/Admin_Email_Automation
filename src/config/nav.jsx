import {
  IconDashboard,
  IconUsers,
  IconFile,
  IconList,
  IconLogs,
  IconSettings,
} from '../components/Icons.jsx'

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: IconDashboard, end: true },
  { path: '/users', label: 'Users', icon: IconUsers },
  { path: '/templates', label: 'Templates', icon: IconFile },
  { path: '/lists', label: 'Lists', icon: IconList },
  { path: '/logs', label: 'System Logs', icon: IconLogs },
  { path: '/settings', label: 'Settings', icon: IconSettings },
]
