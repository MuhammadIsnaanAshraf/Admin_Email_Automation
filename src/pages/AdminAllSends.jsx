import { useState, useEffect } from 'react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import { DataTableSkeleton } from '../components/ui/Skeleton.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import { IconSearch, IconActivity } from '../components/Icons.jsx'
import { listAllSends } from '../lib/api.js'
import './AdminAllSends.css'

const STATUS_OPTIONS = ['all', 'scheduled', 'sending', 'sent', 'failed', 'canceled']
const STATUS_TONES = {
  scheduled: 'info',
  sending: 'warn',
  sent: 'success',
  failed: 'danger',
  canceled: 'neutral',
}
const pageSize = 50

export default function AdminAllSends() {
  const [sends, setSends] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [campaignName, setCampaignName] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    listAllSends({ campaignName, userSearch, status, page, pageSize })
      .then((data) => {
        setSends(data.sends || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [campaignName, userSearch, status, page])

  return (
    <>
      <PageHeader
        title="All Sends"
        subtitle={`${total} send${total !== 1 ? 's' : ''} across all campaigns`}
        icon={<IconActivity size={22} />}
      />

      <div className="as-toolbar">
        <div className="as-search">
          <IconSearch size={16} />
          <input
            className="as-search__input"
            type="text"
            placeholder="Campaign name…"
            value={campaignName}
            onChange={(e) => { setCampaignName(e.target.value); setPage(1) }}
          />
        </div>
        <div className="as-search">
          <IconSearch size={16} />
          <input
            className="as-search__input"
            type="text"
            placeholder="User name or email…"
            value={userSearch}
            onChange={(e) => { setUserSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="as-filters">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              className={`as-filter${status === s ? ' as-filter--active' : ''}`}
              onClick={() => { setStatus(s); setPage(1) }}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="as-table">
        {loading ? (
          <DataTableSkeleton rows={8} cols={7} />
        ) : sends.length === 0 ? (
          <div className="as-empty">No sends found.</div>
        ) : (
          <>
            <div className="as-header">
              <span className="as-header__cell as-header__cell--email">Email</span>
              <span className="as-header__cell as-header__cell--name">Name</span>
              <span className="as-header__cell as-header__cell--status">Status</span>
              <span className="as-header__cell as-header__cell--campaign">Campaign</span>
              <span className="as-header__cell as-header__cell--owner">Owner</span>
              <span className="as-header__cell as-header__cell--scheduled">Scheduled</span>
              <span className="as-header__cell as-header__cell--sent">Sent</span>
            </div>
            {sends.map((s) => (
              <div key={s.id} className="as-row">
                <span className="as-cell as-cell--email">{s.email}</span>
                <span className="as-cell as-cell--name">{s.name || '—'}</span>
                <span className="as-cell as-cell--status"><Badge tone={STATUS_TONES[s.status] || 'neutral'}>{s.status}</Badge></span>
                <span className="as-cell as-cell--campaign">{s.campaignName}</span>
                <span className="as-cell as-cell--owner">{s.owner?.name || s.owner?.email || '—'}</span>
                <span className="as-cell as-cell--scheduled">{s.scheduled_at ? new Date(s.scheduled_at).toLocaleString() : '—'}</span>
                <span className="as-cell as-cell--sent">{s.sent_at ? new Date(s.sent_at).toLocaleString() : '—'}</span>
              </div>
            ))}
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </div>
    </>
  )
}
