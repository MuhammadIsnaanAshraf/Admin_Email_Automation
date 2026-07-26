import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../config/nav.jsx'
import { IconLogo, IconX } from '../components/Icons.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import './Sidebar.css'

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()

  return (
    <>
      {open && <div className="sidebar__overlay" onClick={onClose} />}
      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__logo"><IconLogo size={24} /></div>
          <div className="sidebar__brand-text">
            <div className="sidebar__brand-row">
              <span className="sidebar__brand-name">FlowState</span>
              <span className="sidebar__admin">ADMIN</span>
            </div>
            <span className="sidebar__brand-sub">ENGINEERING CONSOLE</span>
          </div>
          <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
            <IconX size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__link-icon"><Icon size={18} /></span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__avatar">FS</div>
          <div className="sidebar__account">
            <span className="sidebar__account-name">{user?.email || 'Account'}</span>
            <span className="sidebar__account-role">Admin</span>
          </div>
        </div>
      </aside>
    </>
  )
}
