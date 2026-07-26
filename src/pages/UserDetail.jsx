import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Panel from '../components/ui/Panel.jsx'
import Badge from '../components/ui/Badge.jsx'
import { FormSkeleton } from '../components/ui/Skeleton.jsx'
import { IconUsers, IconMail, IconCheck, IconAlert } from '../components/Icons.jsx'
import { getUser } from '../lib/api.js'
import './UserDetail.css'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getUser(id)
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (error) {
    return (
      <div>
        <PageHeader title="User Detail" onBack={() => navigate('/users')} />
        <div className="ud-error">{error}</div>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title={user?.name || user?.email || 'User Detail'}
        subtitle={user ? `Joined ${user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}` : ''}
        onBack={() => navigate('/users')}
        badges={user ? <Badge tone={user.role === 'admin' ? 'success' : 'neutral'}>{user.role || 'user'}</Badge> : null}
        icon={<IconUsers size={22} />}
      />

      {loading ? (
        <FormSkeleton fields={6} />
      ) : (
        <div className="grid-2-1">
          <div className="ud-detail" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Panel title="Profile">
              <div className="ud-field">
                <span className="ud-field__label">Email</span>
                <span className="ud-field__value">{user?.email || '—'}</span>
              </div>
              <div className="ud-field">
                <span className="ud-field__label">Name</span>
                <span className="ud-field__value">{user?.name || '—'}</span>
              </div>
              <div className="ud-field">
                <span className="ud-field__label">Role</span>
                <span className="ud-field__value">{user?.role || 'user'}</span>
              </div>
              <div className="ud-field">
                <span className="ud-field__label">Created</span>
                <span className="ud-field__value">{user?.created_at ? new Date(user.created_at).toLocaleString() : '—'}</span>
              </div>
            </Panel>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Panel title="Gmail Connection">
              {user?.gmailConnected ? (
                <div className="ud-conn ud-conn--ok">
                  <IconCheck size={18} />
                  <span>Connected</span>
                </div>
              ) : (
                <div className="ud-conn ud-conn--no">
                  <IconAlert size={18} />
                  <span>Not connected</span>
                </div>
              )}
            </Panel>

            <Panel title="Stats">
              <div className="ud-mini">
                <IconMail size={16} />
                <span>{user?.campaignCount ?? '—'} campaigns</span>
              </div>
              <div className="ud-mini" style={{ marginTop: 8 }}>
                <IconMail size={16} />
                <span>{user?.totalSends ?? '—'} total sends</span>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </>
  )
}
