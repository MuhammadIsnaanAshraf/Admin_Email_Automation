import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import { ListSkeleton } from '../components/ui/Skeleton.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import { IconSearch, IconFile } from '../components/Icons.jsx'
import { listTemplates } from '../lib/api.js'
import './AdminTemplates.css'

export default function AdminTemplates() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 50

  useEffect(() => {
    setLoading(true)
    listTemplates({ search, page, pageSize })
      .then((data) => {
        setTemplates(data.templates || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, page])

  return (
    <>
      <PageHeader
        title="Templates"
        subtitle={`${total} template${total !== 1 ? 's' : ''} across all users`}
        icon={<IconFile size={22} />}
      />

      <div className="at-toolbar">
        <div className="at-search">
          <IconSearch size={16} />
          <input
            className="at-search__input"
            type="text"
            placeholder="Search by name or subject…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {loading ? (
        <div className="at-table"><ListSkeleton items={5} /></div>
      ) : templates.length === 0 ? (
        <div className="at-table"><div className="at-empty">No templates found.</div></div>
      ) : (
        <div className="at-table">
          <div className="at-header">
            <span className="at-header__cell at-header__cell--name">Name / Subject</span>
            <span className="at-header__cell at-header__cell--owner">Owner</span>
            <span className="at-header__cell at-header__cell--vars">Variables</span>
            <span className="at-header__cell at-header__cell--date">Updated</span>
          </div>
          {templates.map((t) => (
            <div key={t.id} className="at-row" onClick={() => navigate(`/templates/${t.id}`)}>
              <div className="at-row__icon">
                <IconFile size={18} />
              </div>
              <div className="at-row__info">
                <span className="at-row__name">{t.name || 'Untitled'}</span>
                <span className="at-row__subject">{t.subject || '—'}</span>
              </div>
              <div className="at-row__owner">
                <span className="at-row__owner-name">{t.owner?.name || t.owner?.email || 'Unknown'}</span>
                <span className="at-row__owner-email">{t.owner?.email || ''}</span>
              </div>
              <span className="at-row__vars">{t.variables?.length || 0} var{t.variables?.length !== 1 ? 's' : ''}</span>
              <span className="at-row__date">{t.updated_at ? new Date(t.updated_at).toLocaleDateString() : '—'}</span>
            </div>
          ))}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      )}
    </>
  )
}
