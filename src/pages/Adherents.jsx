import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useDataStore } from '../stores/useDataStore'
import { useAdherentsActiveCuma } from '../lib/selectors'
import { reglementsEnAttenteParAdherent } from '../lib/selectors'
import { useCumaStore } from '../stores/useCumaStore'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'

export default function Adherents() {
  const adherents = useAdherentsActiveCuma()
  const cumaId = useCumaStore((s) => s.activeCumaId)
  const allTables = useDataStore((s) => s.tables)

  const countAttente = (adherentId) =>
    reglementsEnAttenteParAdherent({ tables: allTables }, adherentId, cumaId).length

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Clients / Adhérents" />
      <div className="px-5 text-navy font-medium">Tous</div>
      <ul className="flex-1 overflow-y-auto mt-2">
        {adherents.map((a) => (
          <li key={a.id} className="bg-white border-b border-gray-100">
            <Link to={`/adherents/${a.code}`} className="flex items-center px-5 py-3 gap-3">
              <div className="flex-1">
                <div className="text-accent font-bold">{a.nom} {a.prenom}</div>
                <div className="text-xs text-navy mt-1">
                  <span className="font-semibold">Code :</span>{' '}
                  <span className="text-accent">{a.code}</span>
                </div>
                <div className="text-xs text-navy">
                  <span className="font-semibold">Règlements en attente :</span>{' '}
                  <span className="text-accent">{countAttente(a.id)}</span>
                </div>
              </div>
              <ChevronRight className="text-muted" />
            </Link>
          </li>
        ))}
        {!adherents.length && (
          <li className="px-4 py-8 text-center text-muted text-sm">Aucun adhérent.</li>
        )}
      </ul>
      <ActionFooter items={['filtrer', 'impayes']} />
    </div>
  )
}
