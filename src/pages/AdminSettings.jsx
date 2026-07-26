import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/ui/PageHeader.jsx'
import Panel from '../components/ui/Panel.jsx'
import Button from '../components/ui/Button.jsx'
import { IconExternal } from '../components/Icons.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import './AdminSettings.css'

export default function AdminSettings() {
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        title="Admin Settings"
        subtitle="Manage admin account preferences and session."
      />

      <div style={{ maxWidth: 600 }}>
        <Panel title="Account">
          <div className="as-field">
            <span className="as-field__label">Email</span>
            <span className="as-field__value">{user?.email || '—'}</span>
          </div>
          <div className="as-field">
            <span className="as-field__label">Role</span>
            <span className="as-field__value">{profile?.role || 'admin'}</span>
          </div>
          <div className="as-field">
            <span className="as-field__label">User Portal</span>
            <span className="as-field__value">
              <Button variant="outline" icon={<IconExternal size={14} />} onClick={() => window.open('http://localhost:5173', '_blank')}>
                Open Portal
              </Button>
            </span>
          </div>
          <div className="as-field">
            <span className="as-field__label">Session</span>
            <span className="as-field__value">
              <Button variant="outline" onClick={logout}>Sign Out</Button>
            </span>
          </div>
        </Panel>
      </div>
    </>
  )
}
