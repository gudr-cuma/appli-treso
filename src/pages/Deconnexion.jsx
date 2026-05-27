import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { useCumaStore } from '../stores/useCumaStore'

export default function Deconnexion() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const setActiveCuma = useCumaStore((s) => s.setActiveCuma)

  const confirm = () => {
    logout()
    setActiveCuma(null)
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-2xl font-bold text-navy">Voulez-vous vraiment se déconnecter</h1>
      </div>
      <div className="px-8 py-8 flex justify-between gap-3">
        <button onClick={() => navigate(-1)} className="btn-primary bg-gray-300 text-navy min-w-[120px]">
          Annuler
        </button>
        <button onClick={confirm} className="btn-primary min-w-[140px]">
          Déconnecter
        </button>
      </div>
    </div>
  )
}
