import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Panel from '../components/ui/Panel.jsx'
import Badge from '../components/ui/Badge.jsx'
import { DataTableSkeleton } from '../components/ui/Skeleton.jsx'
import { IconSearch, IconMail } from '../components/Icons.jsx'
import { getAdminCampaignSends } from '../lib/api.js'
import './CampaignSends.css'

const FILTER_OPTIONS = ['all', 'scheduled', 'sending', 'sent', 'failed', 'canceled']
const STATUS_TONES = {
  scheduled: 'info',
  sending: 'warn',
  sent: 'success',
  failed: 'danger',
  canceled: 'neutral',
}

export default function CampaignSends() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [campaign, setCampaign] = useState(null)
  const [sends, setSends] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 50

  useEffect(() => {
    setLoading(true)
    setError('')
    getAdminCampaignSends(id, { filter, search, page, pageSize })
      .then((data) => {
        setCampaign(data.campaign)
        setSends(data.sends || [])
        setTotal(data.total || 0)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, filter, search, page])

  if (error) {
    return (
      <div>
        <PageHeader title="Campaign Sends" onBack={() => navigate('/campaigns')} />
        <div className="cs-error">{error}</div>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={campaign?.name || 'Campaign'}
        subtitle={campaign ? `${total} send${total !== 1 ? 's' : ''} • ${campaign.sent_count ?? 0} sent, ${campaign.failed_count ?? 0} failed • ${campaign.status}` : ''}
        onBack={() => navigate('/campaigns')}
        icon={<IconMail size={22} />}
      />

      <div className="cs-toolbar">
        <div className="cs-search">
          <IconSearch size={16} />
          <input
            className="cs-search__input"
            type="text"
            placeholder="Search by email or name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="cs-filters">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              className={`cs-filter${filter === f ? ' cs-filter--active' : ''}`}
              onClick={() => { setFilter(f); setPage(1) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Panel padded={false}>
        {loading ? (
          <DataTableSkeleton rows={8} cols={6} />
        ) : sends.length === 0 ? (
          <div className="cs-empty">No sends found.</div>
        ) : (
          <div className="cs-table">
            <div className="cs-header">
              <span className="cs-header__cell cs-header__cell--email">Email</span>
              <span className="cs-header__cell cs-header__cell--name">Name</span>
              <span className="cs-header__cell cs-header__cell--status">Status</span>
              <span className="cs-header__cell cs-header__cell--attempts">Attempts</span>
              <span className="cs-header__cell cs-header__cell--scheduled">Scheduled</span>
              <span className="cs-header__cell cs-header__cell--sent">Sent</span>
            </div>
            {sends.map((s) => (
              <div key={s.id} className="cs-row">
                <span className="cs-cell cs-cell--email">{s.email}</span>
                <span className="cs-cell cs-cell--name">{s.name || '—'}</span>
                <span className="cs-cell cs-cell--status"><Badge tone={STATUS_TONES[s.status] || 'neutral'}>{s.status}</Badge></span>
                <span className="cs-cell cs-cell--attempts">{s.attempts ?? 0}</span>
                <span className="cs-cell cs-cell--scheduled">{s.scheduled_at ? new Date(s.scheduled_at).toLocaleString() : '—'}</span>
                <span className="cs-cell cs-cell--sent">{s.sent_at ? new Date(s.sent_at).toLocaleString() : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  )
}
