import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { IconLogo } from '../components/Icons.jsx'
import './AdminLogin.css'

function buildError(err) {
  if (!err) return null
  if (err.message?.includes('admin')) return 'This account does not have admin access.'
  return err.message || err.description || 'Authentication failed.'
}

export default function AdminLogin() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      navigate('/', { replace: true })
    }
  }, [loading, isAuthenticated, isAdmin, navigate])

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'openid email profile',
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) {
      alert(buildError(error))
    }
  }

  if (loading) return null

  return (
    <div className="al-page">
      <div className="al-card">
        <div className="al-card__logo"><IconLogo size={28} /></div>
        <h1 className="al-card__title">Admin Console</h1>
        <p className="al-card__desc">Sign in with your Google account to manage the platform.</p>
        <button className="al-card__btn" onClick={handleLogin}>
          Sign in with Google
        </button>
        <p className="al-card__note">Only accounts with the admin role can access this console.</p>
      </div>
    </div>
  )
}
