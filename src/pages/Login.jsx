import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuthStore } from '../stores/useAuthStore'
import { useDataStore } from '../stores/useDataStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const setRememberMe = useAuthStore((s) => s.setRememberMe)
  const loaded = useDataStore((s) => s.loaded)
  const loading = useDataStore((s) => s.loading)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [forgotMsg, setForgotMsg] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!loaded) {
      setError('Chargement des données… réessaie dans un instant.')
      return
    }
    setRememberMe(remember)
    const res = login(email, password)
    if (res.ok) navigate('/', { replace: true })
    else setError(res.error)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col safe-top safe-bottom">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="mb-16 mt-8">
          <Logo size="lg" />
        </div>
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-3">
            <User className="text-muted shrink-0" size={22} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Utilisateur"
              className="input-line"
              autoComplete="email"
            />
          </div>
          <div className="flex items-center gap-3">
            <Lock className="text-muted shrink-0" size={22} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="input-line"
              autoComplete="current-password"
            />
          </div>
          <div className="text-right">
            <button
              type="button"
              onClick={() => setForgotMsg('Fonctionnalité à venir.')}
              className="text-sm font-semibold text-navy"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <label className="flex items-center justify-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-navy"
            />
            se souvenir de moi ?
          </label>
          {(error || forgotMsg) && (
            <div className={`text-center text-sm ${error ? 'text-ko' : 'text-muted'}`}>
              {error || forgotMsg}
            </div>
          )}
          <div className="flex justify-center pt-2">
            <button type="submit" disabled={loading} className="btn-primary min-w-[180px]">
              Se connecter
            </button>
          </div>
        </form>
        <div className="mt-10 text-xs text-muted text-center">
          Démo : test2.president@cuma.fr / demo
        </div>
      </div>
    </div>
  )
}
