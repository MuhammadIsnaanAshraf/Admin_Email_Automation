import './Panel.css'

export default function Panel({ title, subtitle, actions, padded = true, className = '', children }) {
  return (
    <section className={`panel ${className}`}>
      {(title || actions) && (
        <header className="panel__head">
          <div className="panel__titles">
            {title && <h2 className="panel__title">{title}</h2>}
            {subtitle && <p className="panel__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="panel__actions">{actions}</div>}
        </header>
      )}
      <div className={padded ? 'panel__body' : 'panel__body panel__body--flush'}>
        {children}
      </div>
    </section>
  )
}
