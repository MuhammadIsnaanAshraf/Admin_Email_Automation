import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { getMe } from '../lib/api.js'
import BootLoader from '../components/ui/BootLoader.jsx'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const handle = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) {
        setError('No authorization code returned from Google.')
        return
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (exchangeError) {
        setError(exchangeError.message)
        return
      }

      const me = await getMe().catch(() => null)

      if (me?.role !== 'admin') {
        await supabase.auth.signOut()
        setError('This account does not have admin access.')
        return
      }

      navigate('/', { replace: true })
    }

    handle()
  }, [navigate])

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#f0533f' }}>
        <p>{error}</p>
        <button onClick={() => navigate('/login')} style={{ marginTop: 16, padding: '8px 16px' }}>
          Back to login
        </button>
      </div>
    )
  }

  return <BootLoader />
}
