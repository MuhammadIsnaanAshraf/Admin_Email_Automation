import './Button.css'

export default function Button({ variant = 'ghost', icon, children, ...rest }) {
  return (
    <button className={`btn btn--${variant}`} {...rest}>
      {icon && <span className="btn__icon">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  )
}
