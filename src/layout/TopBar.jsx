import { useAuth } from '../auth/AuthContext.jsx'
import './TopBar.css'

function initialsFrom(user) {
  const source = user?.name || user?.email || '?'
  const parts = source.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export default function TopBar({ onToggleSidebar }) {
  const { user, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <span className="topbar__menu-bar" />
          <span className="topbar__menu-bar" />
          <span className="topbar__menu-bar" />
        </button>
        <span className="topbar__env-label">ENV</span>
        <span className="topbar__env-dot" />
        <span className="topbar__env">ADMIN CONSOLE</span>
      </div>
      <div className="topbar__right">
        <div className="topbar__user">
          <div className="topbar__user-text">
            <span className="topbar__user-name">{user?.name || 'Admin'}</span>
            <span className="topbar__user-mail">{user?.email || ''}</span>
          </div>
          {user?.avatarUrl ? (
            <img className="topbar__user-avatar-img" src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
          ) : (
            <div className="topbar__user-avatar">{initialsFrom(user)}</div>
          )}
        </div>

        <button className="topbar__logout" onClick={logout}>Sign out</button>
      </div>
    </header>
  )
}
