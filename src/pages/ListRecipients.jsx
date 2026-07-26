import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Panel from '../components/ui/Panel.jsx'
import Badge from '../components/ui/Badge.jsx'
import { DataTableSkeleton } from '../components/ui/Skeleton.jsx'
import { IconSearch, IconList, IconCheck, IconAlert } from '../components/Icons.jsx'
import { getListRecipients } from '../lib/api.js'
import './ListRecipients.css'

const FILTER_OPTIONS = ['all', 'valid', 'invalid']

export default function ListRecipients() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [list, setList] = useState(null)
  const [recipients, setRecipients] = useState([])
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
    getListRecipients(id, { filter, search, page, pageSize })
      .then((data) => {
        setList(data.list)
        setRecipients(data.recipients || [])
        setTotal(data.total || 0)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, filter, search, page])

  if (error) {
    return (
      <div>
        <PageHeader title="List Recipients" onBack={() => navigate('/lists')} />
        <div className="lr-error">{error}</div>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={list?.name || list?.source_filename || 'Recipients'}
        subtitle={list ? `${total} recipient${total !== 1 ? 's' : ''} • ${list?.valid_rows ?? '—'} valid, ${list?.invalid_rows ?? '—'} invalid • Owner: ${list?.owner?.name || list?.owner?.email || 'Unknown'}` : ''}
        onBack={() => navigate('/lists')}
        icon={<IconList size={22} />}
      />

      <div className="lr-toolbar">
        <div className="lr-search">
          <IconSearch size={16} />
          <input
            className="lr-search__input"
            type="text"
            placeholder="Search by email, name, or company…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="lr-filters">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              className={`lr-filter${filter === f ? ' lr-filter--active' : ''}`}
              onClick={() => { setFilter(f); setPage(1) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Panel padded={false}>
        {loading ? (
          <DataTableSkeleton rows={8} cols={5} />
        ) : recipients.length === 0 ? (
          <div className="lr-empty">No recipients found.</div>
        ) : (
          <div className="lr-table">
            <div className="lr-header">
              <span className="lr-header__cell lr-header__cell--row">#</span>
              <span className="lr-header__cell lr-header__cell--email">Email</span>
              <span className="lr-header__cell lr-header__cell--name">Name</span>
              <span className="lr-header__cell lr-header__cell--company">Company</span>
              <span className="lr-header__cell lr-header__cell--status">Status</span>
            </div>
            {recipients.map((r) => (
              <div key={r.id} className="lr-row">
                <span className="lr-row__cell lr-row__cell--row">{r.row_number ?? '—'}</span>
                <span className="lr-row__cell lr-row__cell--email">{r.email}</span>
                <span className="lr-row__cell lr-row__cell--name">{r.name || '—'}</span>
                <span className="lr-row__cell lr-row__cell--company">{r.company || '—'}</span>
                <span className="lr-row__cell lr-row__cell--status">
                  {r.is_valid ? (
                    <Badge tone="success" dot>
                      <IconCheck size={12} /> Valid
                    </Badge>
                  ) : (
                    <Badge tone="danger" dot>
                      <IconAlert size={12} /> Invalid
                    </Badge>
                  )}
                  {r.errors?.length > 0 && (
                    <span className="lr-issues">{r.errors.join(', ')}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  )
}
