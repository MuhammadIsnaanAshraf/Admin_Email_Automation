import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import { ListSkeleton } from '../components/ui/Skeleton.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import { IconSearch, IconUsers, IconCheck, IconAlert } from '../components/Icons.jsx'
import { listUsers } from '../lib/api.js'
import './AdminUsers.css'

function tokenExpiryStatus(expiry) {
  if (!expiry) return null
  const now = Date.now()
  const exp = new Date(expiry).getTime()
  if (exp <= now) return 'expired'
  const msLeft = exp - now
  if (msLeft < 24 * 60 * 60 * 1000) return 'expiring'
  return 'ok'
}

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

      {loading ? (
        <div className="au-table"><ListSkeleton items={5} /></div>
      ) : users.length === 0 ? (
        <div className="au-table"><div className="au-empty">No users found.</div></div>
      ) : (
        <div className="au-table">
          <div className="au-header">
            <span className="au-header__cell au-header__cell--user">User</span>
            <span className="au-header__cell au-header__cell--role">Role</span>
            <span className="au-header__cell au-header__cell--gmail">Gmail</span>
            <span className="au-header__cell au-header__cell--token">Token Expiry</span>
            <span className="au-header__cell au-header__cell--date">Joined</span>
          </div>
          {users.map((u) => {
            const expiryStatus = tokenExpiryStatus(u.tokenExpiry)
            return (
              <div key={u.id} className="au-row" onClick={() => navigate(`/users/${u.id}`)}>
                <div className="au-row__cell au-row__cell--user">
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
                </div>
                <div className="au-row__cell au-row__cell--role">
                  <Badge tone={u.role === 'admin' ? 'success' : 'neutral'}>{u.role || 'user'}</Badge>
                </div>
                <div className="au-row__cell au-row__cell--gmail">
                  {u.gmailConnected ? (
                    <span className="au-gmail au-gmail--ok"><IconCheck size={14} /> Connected</span>
                  ) : (
                    <span className="au-gmail au-gmail--no"><IconAlert size={14} /> None</span>
                  )}
                </div>
                <div className="au-row__cell au-row__cell--token">
                  {u.tokenExpiry ? (
                    <span className={`au-token au-token--${expiryStatus}`}>
                      {new Date(u.tokenExpiry).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="au-token--none">—</span>
                  )}
                </div>
                <div className="au-row__cell au-row__cell--date">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                </div>
              </div>
            )
          })}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      )}
    </>
  )
}
