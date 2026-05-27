import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useDataStore } from '../stores/useDataStore'
import { useFacturesActiveCuma, formatDate, formatMontant } from '../lib/selectors'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'

export default function Impayes() {
  const factures = useFacturesActiveCuma()
  const adherents = useDataStore((s) => s.tables.adherents)
  const reglements = useDataStore((s) => s.tables.reglements)
  const factureIds = new Set(factures.map((f) => f.id))
  const enAttente = reglements.filter(
    (r) => r.statut === 'en_attente' && factureIds.has(r.facture_id),
  )
  const factureById = (id) => factures.find((f) => f.id === id)
  const adhById = (id) => adherents.find((a) => a.id === id)

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Impayés" />
      <ul className="flex-1 overflow-y-auto">
        {enAttente.map((r) => {
          const f = factureById(r.facture_id)
          const adh = f ? adhById(f.adherent_id) : null
          return (
            <li key={r.id} className="bg-white border-b border-gray-100">
              <Link
                to={f ? `/factures/${f.id}` : '#'}
                className="flex items-center gap-3 px-5 py-3"
              >
                <div className="flex-1">
                  <div className="text-accent font-bold">
                    {adh ? `${adh.nom} ${adh.prenom}` : 'Adhérent inconnu'}
                  </div>
                  {f && (
                    <div className="text-xs text-navy mt-1">
                      Facture N°{f.numero} — {formatDate(f.date)}
                    </div>
                  )}
                  <div className="text-xs text-ko mt-0.5">
                    Échéance {formatDate(r.date)} — {formatMontant(r.montant)}
                  </div>
                </div>
                <ChevronRight className="text-muted" />
              </Link>
            </li>
          )
        })}
        {!enAttente.length && (
          <li className="px-4 py-8 text-center text-muted text-sm">Aucun impayé. 🎉</li>
        )}
      </ul>
      <ActionFooter items={['adherents', 'factures']} />
    </div>
  )
}
