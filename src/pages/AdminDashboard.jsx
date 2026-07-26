import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Panel from '../components/ui/Panel.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { IconUsers, IconMail, IconFile, IconList, IconActivity, IconBolt, IconExternal } from '../components/Icons.jsx'
import { getSystemStats, listUsers } from '../lib/api.js'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSystemStats().catch(() => null),
      listUsers({ page: 1, pageSize: 5 }).catch(() => null),
    ]).then(([statsData, usersData]) => {
      setStats(statsData)
      setRecentUsers(usersData?.users || [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of platform activity, user growth, and system health."
        action={
          <Button variant="primary" icon={<IconExternal size={16} />} onClick={() => window.open('http://localhost:5173', '_blank')}>
            Open User Portal
          </Button>
        }
      />

      <div className="grid-4">
        <div className="ad-stat">
          <span className="ad-stat__icon ad-stat__icon--users"><IconUsers size={20} /></span>
          <div className="ad-stat__body">
            <span className="ad-stat__value">{loading ? '—' : stats?.totalUsers?.toLocaleString() || '0'}</span>
            <span className="ad-stat__label">Total Users</span>
          </div>
        </div>
        <div className="ad-stat">
          <span className="ad-stat__icon ad-stat__icon--campaigns"><IconMail size={20} /></span>
          <div className="ad-stat__body">
            <span className="ad-stat__value">{loading ? '—' : stats?.totalCampaigns?.toLocaleString() || '0'}</span>
            <span className="ad-stat__label">Campaigns</span>
          </div>
        </div>
        <div className="ad-stat">
          <span className="ad-stat__icon ad-stat__icon--templates"><IconFile size={20} /></span>
          <div className="ad-stat__body">
            <span className="ad-stat__value">{loading ? '—' : stats?.totalTemplates?.toLocaleString() || '0'}</span>
            <span className="ad-stat__label">Templates</span>
          </div>
        </div>
        <div className="ad-stat">
          <span className="ad-stat__icon ad-stat__icon--lists"><IconList size={20} /></span>
          <div className="ad-stat__body">
            <span className="ad-stat__value">{loading ? '—' : stats?.totalLists?.toLocaleString() || '0'}</span>
            <span className="ad-stat__label">Lists</span>
          </div>
        </div>
        <div className="ad-stat">
          <span className="ad-stat__icon ad-stat__icon--sent"><IconActivity size={20} /></span>
          <div className="ad-stat__body">
            <span className="ad-stat__value">{loading ? '—' : stats?.totalSends?.toLocaleString() || '0'}</span>
            <span className="ad-stat__label">Emails Sent</span>
          </div>
        </div>
        <div className="ad-stat">
          <span className="ad-stat__icon ad-stat__icon--active"><IconBolt size={20} /></span>
          <div className="ad-stat__body">
            <span className="ad-stat__value">{loading ? '—' : stats?.activeUsers?.toLocaleString() || '0'}</span>
            <span className="ad-stat__label">Active Today</span>
          </div>
        </div>
      </div>

      <div className="section-gap" style={{ maxWidth: 720 }}>
        <Panel title="Recent Users" actions={<Button onClick={() => navigate('/users')}>View All</Button>}>
          {loading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading users…</p>
          ) : recentUsers.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>No users found.</p>
          ) : (
            <div className="ad-users">
              {recentUsers.map((u) => (
                <div key={u.id} className="ad-users__row" onClick={() => navigate(`/users/${u.id}`)}>
                  <div className="ad-users__info">
                    <span className="ad-users__name">{u.name || u.email || 'Unknown'}</span>
                    <span className="ad-users__email">{u.email}</span>
                  </div>
                  <Badge tone={u.role === 'admin' ? 'success' : 'neutral'}>{u.role || 'user'}</Badge>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  )
}
