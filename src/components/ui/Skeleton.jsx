import './Skeleton.css'

export function PageHeaderSkeleton() {
  return (
    <div className="page-header skeleton">
      <div className="page-header__left">
        <div className="skeleton__line skeleton__line--short" />
        <div className="skeleton__line skeleton__line--medium" />
        <div className="skeleton__line skeleton__line--short" style={{ marginTop: 12 }} />
      </div>
      <div className="skeleton__box skeleton__box--button" />
    </div>
  )
}

export function DataTableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="data-table__scroll skeleton">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}><div className="skeleton__line skeleton__line--short" /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j}><div className="skeleton__line skeleton__line--short" /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card skeleton">
      <div className="skeleton__line skeleton__line--short" />
      <div className="skeleton__line skeleton__line--long" style={{ marginTop: 16 }} />
      <div className="skeleton__line skeleton__line--short" style={{ marginTop: 8 }} />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="skeleton-dashboard">
      <PageHeaderSkeleton />
      <div className="skeleton-dashboard__stats">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    </div>
  )
}

export function ListSkeleton({ items = 5 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="skeleton-list__item">
          <div className="skeleton__box skeleton__box--avatar" />
          <div className="skeleton-list__content">
            <div className="skeleton__line skeleton__line--medium" />
            <div className="skeleton__line skeleton__line--short" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 4 }) {
  return (
    <div className="skeleton-form">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="skeleton-form__field">
          <div className="skeleton__line skeleton__line--short" />
          <div className="skeleton__line skeleton__line--medium" style={{ marginTop: 8 }} />
        </div>
      ))}
    </div>
  )
}
