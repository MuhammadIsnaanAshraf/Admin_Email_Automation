import { useEffect, useState } from 'react'
import Panel from './ui/Panel.jsx'
import Button from './ui/Button.jsx'
import Badge from './ui/Badge.jsx'
import { IconClock, IconAlert, IconCheck } from './Icons.jsx'
import { updateUserSendSettings } from '../lib/api.js'
import './SendGapPanel.css'

/* Human-readable rendering of a gap in seconds — "90s" is harder to reason
   about at a glance than "1m 30s", and the admin is picking a pace, not a
   raw number. */
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

function perHour(seconds) {
  if (!seconds) return '—'
  const n = 3600 / seconds
  return n >= 1 ? `~${Math.round(n)} emails/hour` : `~${Math.round(n * 24)} emails/day`
}

/* Edits user_settings.send_gap_seconds — the delay between one recipient's
   email and the next for THIS account. Empty input = no override, i.e. the
   account follows the platform-wide default. */
export default function SendGapPanel({ userId, sendSettings, onSaved }) {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setValue(sendSettings?.gapIsCustom ? String(sendSettings.gapSeconds) : '')
    setError(null)
    setSaved(false)
  }, [sendSettings])

  if (!sendSettings) return null

  const platformDefault = sendSettings.platformDefaultGapSeconds
  const trimmed = value.trim()
  const parsed = trimmed === '' ? null : Number(trimmed)
  const invalid = trimmed !== '' && (!Number.isFinite(parsed) || parsed < 1 || parsed > 86400)

  // "Dirty" compares against the stored override, treating empty and
  // "no override" as the same state so re-saving a blank field is a no-op.
  const currentStored = sendSettings.gapIsCustom ? String(sendSettings.gapSeconds) : ''
  const dirty = trimmed !== currentStored

  const save = async (override) => {
    const next = override !== undefined ? override : (trimmed === '' ? null : parsed)
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const { sendSettings: updated } = await updateUserSendSettings(userId, { sendGapSeconds: next })
      onSaved?.(updated)
      setSaved(true)
    } catch (err) {
      setError(err.message || 'Could not save the send gap.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel
      title="Send Pacing"
      subtitle="Delay between consecutive emails for this account."
    >
      <div className="sgp__current">
        <span className="sgp__current-icon"><IconClock size={18} /></span>
        <div className="sgp__current-info">
          <span className="sgp__current-value">{describeGap(sendSettings.gapSeconds)}</span>
          <span className="sgp__current-rate">{perHour(sendSettings.gapSeconds)}</span>
        </div>
        <Badge tone={sendSettings.gapIsCustom ? 'info' : 'neutral'}>
          {sendSettings.gapIsCustom ? 'Custom' : 'Platform default'}
        </Badge>
      </div>

      <label className="sgp__field">
        <span className="sgp__label">Gap in seconds <i>leave empty to use the default ({describeGap(platformDefault)})</i></span>
        <div className="sgp__row">
          <input
            className="sgp__input"
            type="number"
            min="1"
            max="86400"
            value={value}
            onChange={(e) => { setValue(e.target.value); setSaved(false) }}
            placeholder={String(platformDefault)}
          />
          <Button variant="primary" onClick={() => save()} disabled={saving || invalid || !dirty}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          {sendSettings.gapIsCustom && (
            <Button variant="ghost" onClick={() => save(null)} disabled={saving}>Reset</Button>
          )}
        </div>
      </label>

      {trimmed !== '' && !invalid && (
        <p className="sgp__preview">New pace: {describeGap(parsed)} between emails ({perHour(parsed)}).</p>
      )}
      {invalid && (
        <p className="sgp__msg sgp__msg--error"><IconAlert size={14} /> Enter a number between 1 and 86400 seconds.</p>
      )}
      {error && <p className="sgp__msg sgp__msg--error"><IconAlert size={14} /> {error}</p>}
      {saved && !dirty && <p className="sgp__msg sgp__msg--ok"><IconCheck size={14} /> Saved.</p>}

      <p className="sgp__note">
        Applies to campaigns scheduled from now on — already-scheduled emails keep the times they were given.
      </p>
    </Panel>
  )
}
