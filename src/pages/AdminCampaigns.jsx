import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import { ListSkeleton } from '../components/ui/Skeleton.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import { IconSearch, IconMail } from '../components/Icons.jsx'
import { listAdminCampaigns } from '../lib/api.js'
import './AdminCampaigns.css'

const STATUS_TONES = {
  draft: 'neutral',
  scheduled: 'info',
  sending: 'warn',
  paused: 'neutral',
  completed: 'success',
  cancelled: 'danger',
  failed: 'danger',
}

export default function AdminCampaigns() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 50

  useEffect(() => {
    setLoading(true)
    listAdminCampaigns({ search, page, pageSize })
      .then((data) => {
        setCampaigns(data.campaigns || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, page])

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle={`${total} campaign${total !== 1 ? 's' : ''} across all users`}
        icon={<IconMail size={22} />}
      />

      <div className="ac-toolbar">
        <div className="ac-search">
          <IconSearch size={16} />
          <input
            className="ac-search__input"
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {loading ? (
        <div className="ac-table"><ListSkeleton items={5} /></div>
      ) : campaigns.length === 0 ? (
        <div className="ac-table"><div className="ac-empty">No campaigns found.</div></div>
      ) : (
        <div className="ac-table">
          <div className="ac-header">
            <span className="ac-header__cell ac-header__cell--name">Name</span>
            <span className="ac-header__cell ac-header__cell--owner">Owner</span>
            <span className="ac-header__cell ac-header__cell--status">Status</span>
            <span className="ac-header__cell ac-header__cell--stats">Sent / Total</span>
            <span className="ac-header__cell ac-header__cell--date">Created</span>
          </div>
          {campaigns.map((c) => (
            <div key={c.id} className="ac-row" onClick={() => navigate(`/campaigns/${c.id}`)}>
              <div className="ac-row__icon"><IconMail size={18} /></div>
              <div className="ac-row__info">
                <span className="ac-row__name">{c.name || 'Untitled'}</span>
              </div>
              <div className="ac-row__owner">
                <span className="ac-row__owner-name">{c.owner?.name || c.owner?.email || 'Unknown'}</span>
              </div>
              <Badge tone={STATUS_TONES[c.status] || 'neutral'}>{c.status}</Badge>
              <span className="ac-row__stats">{c.sent_count ?? 0} / {c.total_recipients ?? 0}</span>
              <span className="ac-row__date">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</span>
            </div>
          ))}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      )}
    </>
  )
}
