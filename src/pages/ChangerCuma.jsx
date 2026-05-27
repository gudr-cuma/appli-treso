import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useCumaStore, useAccessibleCumas } from '../stores/useCumaStore'

export default function ChangerCuma() {
  const navigate = useNavigate()
  const cumas = useAccessibleCumas()
  const activeCumaId = useCumaStore((s) => s.activeCumaId)
  const setActiveCuma = useCumaStore((s) => s.setActiveCuma)
  const [selected, setSelected] = useState(activeCumaId || cumas[0]?.id || '')

  const valider = () => {
    if (selected) setActiveCuma(selected)
    navigate('/')
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Changer de CUMA" />
      <ul className="mt-6 px-8 space-y-3 flex-1">
        {cumas.map((c) => {
          const isSel = selected === c.id
          return (
            <li key={c.id}>
              <button
                onClick={() => setSelected(c.id)}
                className="w-full flex items-center gap-4 py-2"
              >
                <span
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                    isSel ? 'border-ok bg-ok/20' : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSel && <Check size={16} className="text-ok" strokeWidth={3} />}
                </span>
                <span className="text-navy text-lg">{c.nom}</span>
              </button>
            </li>
          )
        })}
        {!cumas.length && (
          <li className="text-center text-muted text-sm">Aucune CUMA accessible.</li>
        )}
      </ul>
      <div className="px-8 py-6 flex justify-between gap-3">
        <button onClick={() => navigate(-1)} className="btn-primary bg-gray-300 text-navy min-w-[120px]">
          Annuler
        </button>
        <button onClick={valider} className="btn-primary min-w-[120px]">Valider</button>
      </div>
    </div>
  )
}
