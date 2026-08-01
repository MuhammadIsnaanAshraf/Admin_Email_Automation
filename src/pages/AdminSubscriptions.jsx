import { useEffect, useState } from 'react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { ListSkeleton } from '../components/ui/Skeleton.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import ActivateSubscriptionModal from '../components/ActivateSubscriptionModal.jsx'
import { IconSearch, IconCreditCard } from '../components/Icons.jsx'
import { listSubscriptions } from '../lib/api.js'
import './AdminSubscriptions.css'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'never', label: 'Never subscribed' },
]

function StatusCell({ subscription }) {
  if (subscription.neverSubscribed) {
    return <Badge tone="neutral">Never subscribed</Badge>
  }
  if (subscription.active) {
    return (
      <div className="asub-status">
        <Badge tone="success" dot>Active</Badge>
        <span className="asub-status__days">{subscription.daysRemaining} day{subscription.daysRemaining === 1 ? '' : 's'} left</span>
      </div>
    )
  }
  return (
    <div className="asub-status">
      <Badge tone="danger" dot>Expired</Badge>
      <span className="asub-status__days asub-status__days--expired">
        {subscription.daysExpiredAgo} day{subscription.daysExpiredAgo === 1 ? '' : 's'} ago
      </span>
    </div>
  )
}

export default function AdminSubscriptions() {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [activateUser, setActivateUser] = useState(null)
  const pageSize = 50

  const load = () => {
    setLoading(true)
    listSubscriptions({ search, filter, page, pageSize })
      .then((data) => {
        setUsers(data.users || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [search, filter, page])

  const activeCount = users.filter((u) => u.subscription.active).length

  return (
    <>
      <PageHeader
        title="Subscriptions"
        subtitle={loading ? 'Track who\'s paid, activate new payments, and see who\'s about to expire.' : `${activeCount} of ${users.length} on this page are active`}
        icon={<IconCreditCard size={22} />}
      />

      <div className="asub-toolbar">
        <div className="asub-search">
          <IconSearch size={16} />
          <input
            className="asub-search__input"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="asub-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`asub-filter${filter === f.value ? ' asub-filter--active' : ''}`}
              onClick={() => { setFilter(f.value); setPage(1) }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="asub-table"><ListSkeleton items={6} /></div>
      ) : users.length === 0 ? (
        <div className="asub-table"><div className="asub-empty">No users found.</div></div>
      ) : (
        <div className="asub-table">
          <div className="asub-header">
            <span className="asub-header__cell asub-header__cell--user">User</span>
            <span className="asub-header__cell asub-header__cell--status">Status</span>
            <span className="asub-header__cell asub-header__cell--expiry">Expires</span>
            <span className="asub-header__cell asub-header__cell--amount">Last Paid</span>
            <span className="asub-header__cell asub-header__cell--action" />
          </div>
          {users.map((u) => (
            <div key={u.id} className="asub-row">
              <div className="asub-row__cell asub-row__cell--user">
                <span className="asub-row__name">{u.name || u.email || 'Unknown'}</span>
                <span className="asub-row__email">{u.email}</span>
              </div>
              <div className="asub-row__cell asub-row__cell--status">
                <StatusCell subscription={u.subscription} />
              </div>
              <div className="asub-row__cell asub-row__cell--expiry">
                {u.subscription.periodEnd ? new Date(u.subscription.periodEnd).toLocaleDateString() : '—'}
              </div>
              <div className="asub-row__cell asub-row__cell--amount">
                {u.subscription.amount != null ? `${u.subscription.currency} ${Number(u.subscription.amount).toLocaleString()}` : '—'}
              </div>
              <div className="asub-row__cell asub-row__cell--action">
                <Button variant="outline" onClick={() => setActivateUser(u)}>
                  {u.subscription.active ? 'Renew' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      )}

      <ActivateSubscriptionModal
        open={!!activateUser}
        user={activateUser}
        onClose={() => setActivateUser(null)}
        onActivated={load}
      />
    </>
  )
}
