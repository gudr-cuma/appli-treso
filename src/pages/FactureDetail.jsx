import { useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useDataStore } from '../stores/useDataStore'
import { useFacturesActiveCuma, formatDate, formatMontant } from '../lib/selectors'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'
import { useState } from 'react'

export default function FactureDetail() {
  const { id } = useParams()
  const factures = useFacturesActiveCuma()
  const adherents = useDataStore((s) => s.tables.adherents)
  const idx = factures.findIndex((f) => f.id === id)
  const facture = factures[idx]
  const [pageIdx, setPageIdx] = useState(Math.max(0, idx))

  if (!facture) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted">
        Facture introuvable.
      </div>
    )
  }

  const adh = adherents.find((a) => a.id === facture.adherent_id)
  const current = factures[pageIdx] || facture

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader
        title={`Facture N°${facture.numero}`}
        subtitle={`${adh?.code || ''} - ${formatDate(facture.date)}`}
      />

      <div className="px-4">
        <dl className="bg-white rounded-xl divide-y divide-gray-100 shadow-card">
          {[
            ['Tiers', `${adh?.nom || ''} ${adh?.prenom || ''}`],
            ['Montant HT', formatMontant(facture.montant_ht)],
            ['Montant TVA', formatMontant(facture.montant_tva)],
            ['Montant TTC', formatMontant(facture.montant_ttc)],
            ["Date d'échéance", formatDate(facture.date_echeance)],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between px-4 py-3 text-sm">
              <dt className="text-navy">{k}</dt>
              <dd className="font-semibold text-navy">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 bg-white rounded-xl shadow-card overflow-hidden">
          <div className="flex items-center justify-end px-3 py-2 text-xs text-muted">
            <Search size={14} className="mr-1" />
            <a
              href={current.url_pdf || '#'}
              target="_blank"
              rel="noreferrer"
              className="font-semibold"
            >
              OUVRIR EN PLEIN ÉCRAN
            </a>
          </div>
          <div className="px-2 pb-2">
            <img
              src={current.url_pdf || '/facture-placeholder.svg'}
              alt="Aperçu facture"
              className="w-full rounded border border-gray-200"
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t">
            <button
              onClick={() => setPageIdx((i) => Math.max(0, i - 1))}
              disabled={pageIdx <= 0}
              className="p-1 text-navy disabled:opacity-30"
              aria-label="Précédent"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="text-xs text-muted text-center">
              <div className="font-semibold text-navy">{pageIdx + 1}/{factures.length}</div>
              <div>Dossier 101 - BCM</div>
            </div>
            <button
              onClick={() => setPageIdx((i) => Math.min(factures.length - 1, i + 1))}
              disabled={pageIdx >= factures.length - 1}
              className="p-1 text-navy disabled:opacity-30"
              aria-label="Suivant"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1" />
      <ActionFooter items={['adherents', 'impayes']} />
    </div>
  )
}
