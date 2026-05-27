import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, FileSpreadsheet, Database } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuthStore } from '../stores/useAuthStore'
import { useDataStore } from '../stores/useDataStore'
import { useSourceStore } from '../stores/useSourceStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const setRememberMe = useAuthStore((s) => s.setRememberMe)
  const loaded = useDataStore((s) => s.loaded)
  const loading = useDataStore((s) => s.loading)
  const dataError = useDataStore((s) => s.error)
  const reset = useDataStore((s) => s.reset)

  const source = useSourceStore((s) => s.source)
  const setSource = useSourceStore((s) => s.setSource)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [forgotMsg, setForgotMsg] = useState('')

  // Changer de source déclenche un rechargement via App.jsx useEffect (loaded → false)
  const handleSourceChange = (newSource) => {
    if (newSource === source) return
    setSource(newSource)
    reset()          // → App.jsx détecte loaded=false et rappelle loadData()
    setError('')
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (dataError) {
      setError(dataError)
      return
    }
    if (!loaded) {
      setError('Chargement des données… réessaie dans un instant.')
      return
    }
    setRememberMe(remember)
    const res = login(email, password)
    if (res.ok) navigate('/', { replace: true })
    else setError(res.error)
  }

  const isSQL = source === 'sql'

  return (
    <div className="min-h-screen bg-surface flex flex-col safe-top safe-bottom">
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="mb-10 mt-8">
          <Logo size="lg" />
        </div>

        {/* ── Toggle Source ─────────────────────────────────────────── */}
        <div className="w-full max-w-sm mb-8">
          <p className="text-xs text-muted text-center mb-2 font-medium uppercase tracking-wide">
            Source des données
          </p>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => handleSourceChange('excel')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                !isSQL
                  ? 'bg-navy text-white'
                  : 'text-muted hover:bg-gray-50'
              }`}
            >
              <FileSpreadsheet size={16} />
              Excel démo
            </button>
            <button
              type="button"
              onClick={() => handleSourceChange('sql')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors ${
                isSQL
                  ? 'bg-navy text-white'
                  : 'text-muted hover:bg-gray-50'
              }`}
            >
              <Database size={16} />
              Base SQL locale
            </button>
          </div>

          {/* Indicateur de statut chargement / erreur API */}
          <div className="mt-1.5 text-center text-xs">
            {loading && (
              <span className="text-muted">Connexion à la source de données…</span>
            )}
            {!loading && loaded && (
              <span className="text-ok font-medium">
                {isSQL ? '✓ Base SQL connectée' : '✓ Fichier Excel chargé'}
              </span>
            )}
            {!loading && dataError && (
              <span className="text-ko whitespace-pre-line">{dataError}</span>
            )}
          </div>
        </div>

        {/* ── Formulaire Login ──────────────────────────────────────── */}
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
            <div className={`text-center text-sm whitespace-pre-line ${error ? 'text-ko' : 'text-muted'}`}>
              {error || forgotMsg}
            </div>
          )}
          <div className="flex justify-center pt-2">
            <button type="submit" disabled={loading || !!dataError} className="btn-primary min-w-[180px]">
              Se connecter
            </button>
          </div>
        </form>

        {!isSQL && (
          <div className="mt-10 text-xs text-muted text-center">
            Démo : test2.president@cuma.fr / demo
          </div>
        )}
        {isSQL && (
          <div className="mt-10 text-xs text-muted text-center">
            Identifiants issus de la table users de ERP223B
          </div>
        )}
      </div>
    </div>
  )
}
