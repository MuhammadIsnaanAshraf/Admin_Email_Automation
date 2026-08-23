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
  canceled: 'danger',
  failed: 'danger',
}

/* 'upcoming' isn't a real status — it's "booked for a moment that hasn't
   arrived", which is the thing worth watching. A campaign can read 'scheduled'
   while it's already part-way through a long list, so the two aren't the same
   question. Sorting that view by send time (soonest first) is the only order
   that makes sense for it. */
const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'sending', label: 'Sending' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'draft', label: 'Drafts' },
]

function fmtSendTime(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleString(undefined, {
    day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  })
}

/* Days until a booked send, for an at-a-glance "how soon". */
function relativeDays(iso) {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return null
  const hours = ms / 3600000
  if (hours < 1) return `in ${Math.max(1, Math.round(ms / 60000))}m`
  if (hours < 24) return `in ${Math.round(hours)}h`
  return `in ${Math.round(hours / 24)}d`
}

export default function AdminCampaigns() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [upcoming, setUpcoming] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 50

  useEffect(() => {
    setLoading(true)
    listAdminCampaigns({
      search,
      status,
      page,
      pageSize,
      // Booked campaigns are only useful soonest-first; everything else stays
      // on newest-created.
      sort: status === 'upcoming' ? 'scheduled_at' : 'created_at',
      dir: status === 'upcoming' ? 'asc' : 'desc',
    })
      .then((data) => {
        setCampaigns(data.campaigns || [])
        setTotal(data.total || 0)
        setUpcoming(data.upcoming || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, status, page])

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle={`${total} campaign${total !== 1 ? 's' : ''} across all users${upcoming ? ` · ${upcoming} booked for a future date` : ''}`}
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
        <div className="ac-filters">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`ac-filter${status === f.value ? ' ac-filter--on' : ''}`}
              onClick={() => { setStatus(f.value); setPage(1) }}
            >
              {f.label}
              {f.value === 'upcoming' && upcoming > 0 && <span className="ac-filter__count">{upcoming}</span>}
            </button>
          ))}
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
            <span className="ac-header__cell ac-header__cell--date">Send Time</span>
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
              <span className="ac-row__date">
                {(() => {
                  const booked = fmtSendTime(c.scheduled_at)
                  const soon = c.scheduled_at ? relativeDays(c.scheduled_at) : null
                  // Only a campaign still waiting on its slot gets the send
                  // time; anything else is more usefully shown by created date.
                  if (booked && soon && ['scheduled', 'paused'].includes(c.status)) {
                    return (
                      <span className="ac-when ac-when--upcoming">
                        <span className="ac-when__time">{booked}</span>
                        <span className="ac-when__note">{soon}</span>
                      </span>
                    )
                  }
                  if (booked && ['scheduled', 'sending'].includes(c.status)) {
                    return (
                      <span className="ac-when">
                        <span className="ac-when__time">{booked}</span>
                        <span className="ac-when__note">started</span>
                      </span>
                    )
                  }
                  return c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'
                })()}
              </span>
            </div>
          ))}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      )}
    </>
  )
}
