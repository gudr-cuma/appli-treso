import { Link, useSearchParams } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import { useDataStore } from '../stores/useDataStore'
import { useFacturesActiveCuma, formatDate, formatMontant } from '../lib/selectors'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'
import { useState, useMemo } from 'react'

export default function Factures() {
  const [params] = useSearchParams()
  const factures = useFacturesActiveCuma()
  const adherents = useDataStore((s) => s.tables.adherents)
  const [q, setQ] = useState('')

  const filters = useMemo(() => ({
    adherent_id: params.get('adherent_id') || '',
    type: params.get('type') || '',
    payee: params.get('payee') || '',
    from: params.get('from') || '',
    to: params.get('to') || '',
  }), [params])

  const filtered = factures.filter((f) => {
    if (filters.adherent_id && f.adherent_id !== filters.adherent_id) return false
    if (filters.type && f.type !== filters.type) return false
    if (filters.payee === 'oui' && !f.payee) return false
    if (filters.payee === 'non' && f.payee) return false
    if (filters.from && String(f.date) < filters.from) return false
    if (filters.to && String(f.date) > filters.to) return false
    if (q) {
      const adh = adherents.find((a) => a.id === f.adherent_id)
      const hay = `${adh?.nom} ${adh?.prenom} ${f.numero}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  const adherentName = (id) => {
    const a = adherents.find((x) => x.id === id)
    return a ? `${a.nom} ${a.prenom}` : ''
  }

  const hasActiveFilters = Object.values(filters).some(Boolean)

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Mes factures" />
      <div className="px-6 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recherche"
            className="w-full bg-white border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        {hasActiveFilters && (
          <div className="mt-2 text-xs text-muted text-center">
            Filtres actifs.{' '}
            <Link to="/factures" className="text-accent underline">Réinitialiser</Link>
          </div>
        )}
      </div>
      <ul className="flex-1 overflow-y-auto">
        {filtered.map((f) => (
          <li key={f.id} className="bg-white border-b border-gray-100">
            <Link to={`/factures/${f.id}`} className="flex items-center px-5 py-3 gap-3">
              <div className="flex-1">
                <div className="text-accent font-bold">{adherentName(f.adherent_id)}</div>
                <div className="text-xs text-navy mt-1">
                  <span className="font-semibold">Numéro :</span> {f.numero}
                  <span className="ml-4 font-semibold">Type :</span> {f.type}
                </div>
                <div className="text-xs text-navy">
                  <span className="font-semibold">Date :</span> {formatDate(f.date)}
                </div>
                <div className="text-xs text-navy">
                  <span className="font-semibold">Montant :</span> {formatMontant(f.montant_ttc)}
                </div>
              </div>
              <ChevronRight className="text-muted" />
            </Link>
          </li>
        ))}
        {!filtered.length && (
          <li className="px-4 py-8 text-center text-muted text-sm">Aucune facture.</li>
        )}
      </ul>
      <ActionFooter items={['adherents', 'filtrer', 'impayes']} />
    </div>
  )
}
