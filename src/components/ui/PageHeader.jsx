import { IconArrowLeft } from '../Icons.jsx'
import './PageHeader.css'

export default function PageHeader({ eyebrow, icon, title, subtitle, badges, onBack, action }) {
  return (
    <div className="page-header">
      <div className="page-header__left">
        {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
        <div className="page-header__title-row">
          {onBack && (
            <button className="page-header__back" onClick={onBack} aria-label="Go back">
              <IconArrowLeft size={20} />
            </button>
          )}
          {icon && <span className="page-header__icon">{icon}</span>}
          <h1 className="page-header__title">{title}</h1>
          {badges && <span className="page-header__badges">{badges}</span>}
        </div>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="page-header__actions">{action}</div>}
    </div>
  )
}
