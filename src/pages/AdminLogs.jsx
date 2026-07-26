import { useState, useEffect } from 'react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Panel from '../components/ui/Panel.jsx'
import { IconLogs } from '../components/Icons.jsx'
import { getSystemLogs } from '../lib/api.js'
import './AdminLogs.css'

export default function AdminLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSystemLogs()
      .then((data) => setLogs(data.logs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader
        title="System Logs"
        subtitle="Platform-wide event log for auditing and debugging."
        icon={<IconLogs size={22} />}
      />

      <Panel padded={false}>
        {loading ? (
          <div className="al-empty">Loading logs…</div>
        ) : logs.length === 0 ? (
          <div className="al-empty">No logs available.</div>
        ) : (
          <div className="al-list">
            {logs.map((log, i) => (
              <div key={log.id || i} className="al-row">
                <span className="al-row__time">{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</span>
                <span className="al-row__level" data-level={log.level || 'info'}>{log.level || 'INFO'}</span>
                <span className="al-row__msg">{log.message || log.event || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  )
}
