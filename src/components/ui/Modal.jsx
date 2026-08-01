import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IconX } from '../Icons.jsx'
import './Modal.css'

/* Reusable modal dialog. Rendered in a portal on <body> so it escapes any
   overflow/stacking context. Closes on backdrop click and Escape; locks body
   scroll while open. */
export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal__backdrop" onMouseDown={onClose}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <div className="modal__head-text">
            <h2 className="modal__title">{title}</h2>
            {subtitle && <p className="modal__subtitle">{subtitle}</p>}
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close dialog" type="button">
            <IconX size={18} />
          </button>
        </div>

        <div className="modal__body">{children}</div>

        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
