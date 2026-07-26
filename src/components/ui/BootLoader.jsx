import { IconLogo } from '../Icons.jsx'

export default function BootLoader() {
  return (
    <div className="boot-screen">
      <style>{`
        .boot-screen {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 22px;
          background: radial-gradient(120% 80% at 50% -10%, #141a24 0%, #0b0e14 60%);
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          z-index: 9999;
        }
        .boot-screen__logo {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: #46f019;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 44px rgba(70, 240, 25, 0.35);
          animation: boot-breathe 1.8s ease-in-out infinite;
        }
        .boot-screen__ring {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2.5px solid rgba(255, 255, 255, 0.14);
          border-top-color: #46f019;
          animation: boot-spin 0.8s linear infinite;
        }
        .boot-screen__word {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f4f6fa;
        }
        .boot-screen__tag {
          font-family: 'SFMono-Regular', ui-monospace, Menlo, Consolas, monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #5b6472;
        }
        @keyframes boot-spin { to { transform: rotate(360deg); } }
        @keyframes boot-breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 0 44px rgba(70, 240, 25, 0.35); }
          50% { transform: scale(1.06); box-shadow: 0 0 64px rgba(70, 240, 25, 0.5); }
        }
        @media (prefers-reduced-motion: reduce) {
          .boot-screen__logo, .boot-screen__ring { animation: none; }
        }
      `}</style>
      <div className="boot-screen__logo"><IconLogo size={28} /></div>
      <div className="boot-screen__ring" />
      <div className="boot-screen__word">FlowState</div>
      <div className="boot-screen__tag">Admin console loading</div>
    </div>
  )
}
