import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import { IconSearch, IconUsers } from '../components/Icons.jsx'
import { listUsers } from '../lib/api.js'
import './AdminUsers.css'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 50

  useEffect(() => {
    setLoading(true)
    listUsers({ search, page, pageSize })
      .then((data) => {
        setUsers(data.users || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, page])

  return (
    <>
      <PageHeader
        title="Users"
        subtitle={`${total} registered user${total !== 1 ? 's' : ''}`}
        icon={<IconUsers size={22} />}
      />

      <div className="au-toolbar">
        <div className="au-search">
          <IconSearch size={16} />
          <input
            className="au-search__input"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      <div className="au-table">
        {loading ? (
          <div className="au-empty">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="au-empty">No users found.</div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="au-row" onClick={() => navigate(`/users/${u.id}`)}>
              <div className="au-row__avatar">
                {u.avatarUrl
                  ? <img src={u.avatarUrl} alt="" className="au-row__avatar-img" />
                  : <span className="au-row__avatar-letter">{(u.name || u.email || '?')[0]?.toUpperCase()}</span>
                }
              </div>
              <div className="au-row__info">
                <span className="au-row__name">{u.name || u.email || 'Unknown'}</span>
                <span className="au-row__email">{u.email}</span>
              </div>
              <Badge tone={u.role === 'admin' ? 'success' : 'neutral'}>{u.role || 'user'}</Badge>
              <span className="au-row__date">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}
