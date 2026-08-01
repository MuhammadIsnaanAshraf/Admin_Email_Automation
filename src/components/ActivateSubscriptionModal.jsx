import { useEffect, useMemo, useState } from 'react'
import Modal from './ui/Modal.jsx'
import Button from './ui/Button.jsx'
import { IconAlert } from './Icons.jsx'
import { activateSubscription } from '../lib/api.js'
import './ActivateSubscriptionModal.css'

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'jazzcash', label: 'JazzCash' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
]

const DAY_MS = 24 * 60 * 60 * 1000

function fmtDate(d) {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/* Records a payment the admin received outside the platform, and applies
   the 30-day rule: fresh 30 days from today, or +30 days from the current
   expiry if the user isn't expired yet — never restarting days they already
   paid for. `user` is a row from listSubscriptions()'s response. */
export default function ActivateSubscriptionModal({ open, user, onClose, onActivated }) {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [note, setNote] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || !user) return
    // Prefill with whatever they paid last time — the common case is the
    // same amount every month, but it stays fully editable per activation.
    setAmount(user.subscription?.amount != null ? String(user.subscription.amount) : '')
    setPaymentMethod(user.subscription?.paymentMethod || 'bank_transfer')
    setNote('')
    setWhatsappNumber(user.whatsappNumber || '')
    setError(null)
  }, [open, user])

  const newExpiry = useMemo(() => {
    if (!user) return null
    const now = new Date()
    const currentExpiry = user.subscription?.periodEnd ? new Date(user.subscription.periodEnd) : null
    const start = currentExpiry && currentExpiry.getTime() > now.getTime() ? currentExpiry : now
    return new Date(start.getTime() + 30 * DAY_MS)
  }, [user])

  const isExtending = user?.subscription?.active

  const canSubmit = amount !== '' && Number(amount) >= 0 && !submitting

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || !user) return
    setSubmitting(true)
    setError(null)
    try {
      const { payment } = await activateSubscription(user.id, {
        amount: Number(amount),
        currency: 'PKR',
        paymentMethod,
        note: note.trim() || undefined,
        whatsappNumber: whatsappNumber.trim() || undefined,
      })
      onActivated?.(payment)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Could not activate the subscription.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <Modal
      open={open}
      onClose={submitting ? undefined : onClose}
      title={`Activate subscription — ${user.name || user.email}`}
      subtitle="Record the payment you received. 30 days are added automatically."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? 'Activating…' : 'Activate'}
          </Button>
        </>
      }
    >
      <form className="asm__form" onSubmit={handleSubmit}>
        <div className="asm__banner">
          {isExtending ? (
            <span>
              Currently active until <strong>{fmtDate(new Date(user.subscription.periodEnd))}</strong> —
              this will <strong>extend</strong> it to <strong>{fmtDate(newExpiry)}</strong> (30 more days on top of what's left).
            </span>
          ) : (
            <span>
              {user.subscription?.neverSubscribed ? 'No prior subscription.' : `Expired ${user.subscription.daysExpiredAgo} day${user.subscription.daysExpiredAgo === 1 ? '' : 's'} ago.`}{' '}
              This will start a fresh period ending <strong>{fmtDate(newExpiry)}</strong>.
            </span>
          )}
        </div>

        <label className="asm__field">
          <span className="asm__label">Amount received (PKR)</span>
          <input
            className="asm__input"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 2500"
            required
            autoFocus
          />
        </label>

        <label className="asm__field">
          <span className="asm__label">Payment method</span>
          <div className="asm__select-wrap">
            <select className="asm__select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </label>

        <label className="asm__field">
          <span className="asm__label">WhatsApp number <i>for expiry reminders</i></span>
          <input
            className="asm__input"
            type="tel"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="e.g. 923001234567"
          />
        </label>

        <label className="asm__field">
          <span className="asm__label">Note <i>optional</i></span>
          <input
            className="asm__input"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. transaction ref, half-price promo…"
            maxLength={200}
          />
        </label>

        {error && (
          <div className="asm__state asm__state--error"><IconAlert size={16} /> {error}</div>
        )}
      </form>
    </Modal>
  )
}
