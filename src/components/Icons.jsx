const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
})

export const IconDashboard = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const IconUsers = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 20v-2a4 4 0 0 0-3-3.9" />
  </svg>
)

export const IconLogs = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9l3 3-3 3M13 15h4" />
  </svg>
)

export const IconSettings = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
  </svg>
)

export const IconChevronDown = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const IconChevronLeft = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
)

export const IconChevronRight = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const IconSearch = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
)

export const IconArrowLeft = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export const IconX = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

export const IconPlus = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconRefresh = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M21 12a9 9 0 1 1-2.6-6.4" />
    <path d="M21 4v5h-5" />
  </svg>
)

export const IconMail = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
)

export const IconCheck = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M5 12l4.5 4.5L19 7" />
  </svg>
)

export const IconAlert = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 3l9 16H3z" />
    <path d="M12 10v4M12 17v.5" />
  </svg>
)

export const IconBolt = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </svg>
)

export const IconActivity = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M3 12h4l3 8 4-16 3 8h4" />
  </svg>
)

export const IconExternal = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </svg>
)

export const IconFile = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h4" />
  </svg>
)

export const IconList = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="4" y="5" width="16" height="14" rx="1.5" />
    <path d="M8 9h8M8 13h8M8 17h5" />
  </svg>
)

export const IconLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0a0f0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9a4 4 0 0 1 8 0c0 3-4 3-4 6a4 4 0 0 0 8 0" />
    <circle cx="19" cy="8" r="1.4" fill="#0a0f0a" stroke="none" />
  </svg>
)
