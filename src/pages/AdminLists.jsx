import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import { IconSearch, IconList } from '../components/Icons.jsx'
import { listAdminLists } from '../lib/api.js'
import './AdminLists.css'

const STATUS_TONES = {
  draft: 'neutral',
  ready: 'success',
  archived: 'warn',
}

export default function AdminLists() {
  const navigate = useNavigate()
  const [lists, setLists] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 50

  useEffect(() => {
    setLoading(true)
    listAdminLists({ search, page, pageSize })
      .then((data) => {
        setLists(data.lists || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, page])

  return (
    <>
      <PageHeader
        title="Lists"
        subtitle={`${total} recipient list${total !== 1 ? 's' : ''} across all users`}
        icon={<IconList size={22} />}
      />

      <div className="alist-toolbar">
        <div className="alist-search">
          <IconSearch size={16} />
          <input
            className="alist-search__input"
            type="text"
            placeholder="Search by name or filename…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      <div className="alist-table">
        {loading ? (
          <div className="alist-empty">Loading lists…</div>
        ) : lists.length === 0 ? (
          <div className="alist-empty">No lists found.</div>
        ) : (
          lists.map((l) => (
            <div key={l.id} className="alist-row" onClick={() => navigate(`/lists/${l.id}`)}>
              <div className="alist-row__icon">
                <IconList size={18} />
              </div>
              <div className="alist-row__info">
                <span className="alist-row__name">{l.name || l.source_filename || 'Untitled'}</span>
                {l.source_filename && l.name && (
                  <span className="alist-row__file">{l.source_filename}</span>
                )}
              </div>
              <div className="alist-row__owner">
                <span className="alist-row__owner-name">{l.owner?.name || l.owner?.email || 'Unknown'}</span>
              </div>
              <Badge tone={STATUS_TONES[l.status] || 'neutral'}>{l.status}</Badge>
              <span className="alist-row__stats">
                {l.valid_rows ?? 0} / {l.total_rows ?? 0}
              </span>
              <span className="alist-row__date">{l.created_at ? new Date(l.created_at).toLocaleDateString() : '—'}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}
