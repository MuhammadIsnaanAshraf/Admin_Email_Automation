import { useEffect, useMemo, useState } from 'react'
import Modal from './ui/Modal.jsx'
import Button from './ui/Button.jsx'
import { IconAlert } from './Icons.jsx'
import { startTrial } from '../lib/api.js'
import './ActivateSubscriptionModal.css'

const DAY_MS = 24 * 60 * 60 * 1000
const DEFAULT_TRIAL_DAYS = 7

function fmtDate(d) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/* Grants a free trial — a one-time-only offer per account. `user` is a row
   from listSubscriptions()'s response (must carry trialUsed + subscription).
   The backend is the actual source of truth for both guards below; this
   component mirrors them so the button is disabled/explained before the
   admin even opens the form, not just after a failed submit. */
export default function StartTrialModal({ open, user, onClose, onActivated }) {
  const [days, setDays] = useState(String(DEFAULT_TRIAL_DAYS))
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || !user) return
    setDays(String(DEFAULT_TRIAL_DAYS))
    setNote('')
    setError(null)
  }, [open, user])

  const daysNum = Number(days)
  const validDays = Number.isInteger(daysNum) && daysNum >= 1 && daysNum <= 365

  const newExpiry = useMemo(() => {
    if (!validDays) return null
    return new Date(Date.now() + daysNum * DAY_MS)
  }, [daysNum, validDays])

  const blockedReason = !user
    ? null
    : user.trialUsed
      ? 'This account has already used its free trial — it can only be granted once.'
      : user.subscription?.active
        ? 'This account already has an active subscription. Trials are only for accounts without one.'
        : null

  const canSubmit = !!user && !blockedReason && validDays && !submitting

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const { payment } = await startTrial(user.id, { days: daysNum, note: note.trim() || undefined })
      onActivated?.(payment)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Could not start the trial.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      title={`Start free trial — ${user.name || user.email}`}
      subtitle="One-time only — this account can never receive a second trial."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? 'Starting…' : 'Start trial'}
          </Button>
        </>
      }
    >
      <form className="asm__form" onSubmit={handleSubmit}>
        {blockedReason ? (
          <div className="asm__state asm__state--error"><IconAlert size={16} /> {blockedReason}</div>
        ) : (
          <div className="asm__banner">
            {validDays
              ? <span>Grants access until <strong>{fmtDate(newExpiry)}</strong> ({daysNum} day{daysNum === 1 ? '' : 's'} from now). No payment recorded.</span>
              : <span>Enter a whole number of days between 1 and 365.</span>}
          </div>
        )}

        <label className="asm__field">
          <span className="asm__label">Trial length (days)</span>
          <input
            className="asm__input"
            type="number"
            min="1"
            max="365"
            step="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="e.g. 7"
            disabled={!!blockedReason}
            required
            autoFocus
          />
        </label>

        <label className="asm__field">
          <span className="asm__label">Note <i>optional</i></span>
          <input
            className="asm__input"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. onboarding call, referral…"
            maxLength={200}
            disabled={!!blockedReason}
          />
        </label>

        {error && (
          <div className="asm__state asm__state--error"><IconAlert size={16} /> {error}</div>
        )}
      </form>
    </Modal>
  )
}
