import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Modal from '../components/ui/Modal.jsx'
import { ListSkeleton } from '../components/ui/Skeleton.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import ActivateSubscriptionModal from '../components/ActivateSubscriptionModal.jsx'
import SendGapPanel from '../components/SendGapPanel.jsx'
import { IconSearch, IconUsers, IconCheck, IconAlert, IconClock, IconCreditCard } from '../components/Icons.jsx'
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

function describeGap(seconds) {
  if (seconds == null) return '—'
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const rem = seconds % 60
  if (mins < 60) return rem ? `${mins}m ${rem}s` : `${mins}m`
  const hours = Math.floor(mins / 60)
  const remMins = mins % 60
  return remMins ? `${hours}h ${remMins}m` : `${hours}h`
}

function SubscriptionCell({ subscription }) {
  if (subscription?.neverSubscribed) {
    return <Badge tone="neutral">Never subscribed</Badge>
  }
  if (subscription?.active) {
    return (
      <div className="au-sub-status">
        <Badge tone="success" dot>Active</Badge>
        <span className="au-sub-status__days">
          {subscription.daysRemaining} day{subscription.daysRemaining === 1 ? '' : 's'} left
        </span>
      </div>
    )
  }
  return (
    <div className="au-sub-status">
      <Badge tone="danger" dot>Expired</Badge>
      <span className="au-sub-status__days au-sub-status__days--expired">
        {subscription.daysExpiredAgo} day{subscription.daysExpiredAgo === 1 ? '' : 's'} ago
      </span>
    </div>
  )
}

function PacingCell({ sendSettings }) {
  if (!sendSettings) return '—'
  return (
    <div className="au-pace">
      <span className="au-pace__value">{describeGap(sendSettings.gapSeconds)}</span>
      <Badge tone={sendSettings.gapIsCustom ? 'info' : 'neutral'}>
        {sendSettings.gapIsCustom ? 'Custom' : 'Default'}
      </Badge>
    </div>
  )
}

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  console.log("🚀 ~ AdminUsers ~ users:", users)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [activateUser, setActivateUser] = useState(null)
  const [pacingUser, setPacingUser] = useState(null)
  const pageSize = 50

  const load = () => {
    setLoading(true)
    listUsers({ search, page, pageSize })
      .then((data) => {
        setUsers(data.users || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [search, page])

  const activateModalUser = activateUser && {
    id: activateUser.id,
    name: activateUser.name,
    email: activateUser.email,
    whatsappNumber: activateUser.whatsappNumber,
    subscription: activateUser.subscription,
  }

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
            <span className="au-header__cell au-header__cell--subscription">Subscription</span>
            <span className="au-header__cell au-header__cell--pace">Send Pace</span>
            <span className="au-header__cell au-header__cell--date">Joined</span>
            <span className="au-header__cell au-header__cell--actions" />
          </div>
          {users?.map((u) => {
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
                <div className="au-row__cell au-row__cell--subscription">
                  <SubscriptionCell subscription={u.subscription} />
                </div>
                <div className="au-row__cell au-row__cell--pace">
                  <PacingCell sendSettings={u.sendSettings} />
                </div>
                <div className="au-row__cell au-row__cell--date">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                </div>
                <div className="au-row__cell au-row__cell--actions">
                  <div className="au-actions">
                    <button
                      className="au-action au-action--primary"
                      onClick={(e) => { e.stopPropagation(); setActivateUser(u) }}
                    >
                      <IconCreditCard size={13} />
                      {u.subscription?.active ? 'Renew' : 'Activate'}
                    </button>
                    <button
                      className="au-action"
                      onClick={(e) => { e.stopPropagation(); setPacingUser(u) }}
                    >
                      <IconClock size={13} />
                      Pacing
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      )}

      <ActivateSubscriptionModal
        open={!!activateUser}
        user={activateModalUser}
        onClose={() => setActivateUser(null)}
        onActivated={load}
      />

      <Modal
        open={!!pacingUser}
        onClose={() => setPacingUser(null)}
        title={`Send pacing — ${pacingUser?.name || pacingUser?.email}`}
        subtitle="Delay between consecutive emails for this account."
      >
        {pacingUser && (
          <SendGapPanel
            userId={pacingUser.id}
            sendSettings={pacingUser.sendSettings}
            onSaved={(sendSettings) => {
              setUsers((prev) => prev.map((u) => (u.id === pacingUser.id ? { ...u, sendSettings } : u)))
              setPacingUser(null)
            }}
          />
        )}
      </Modal>
    </>
  )
}
