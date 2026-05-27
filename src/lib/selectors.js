// Sélecteurs jointures multi-tables (consommés par les pages)
import { useDataStore } from '../stores/useDataStore'
import { useCumaStore } from '../stores/useCumaStore'

export function useActiveCumaId() {
  return useCumaStore((s) => s.activeCumaId)
}

export function useFacturesActiveCuma() {
  const cumaId = useActiveCumaId()
  const factures = useDataStore((s) => s.tables.factures)
  return factures.filter((f) => f.cuma_id === cumaId)
}

export function useAdherentsActiveCuma() {
  const cumaId = useActiveCumaId()
  const adherents = useDataStore((s) => s.tables.adherents)
  return adherents.filter((a) => a.cuma_id === cumaId)
}

export function adherentById(state, id) {
  return state.tables.adherents.find((a) => a.id === id)
}

export function adherentByCode(state, code) {
  return state.tables.adherents.find((a) => a.code === code)
}

export function reglementsForFacture(state, factureId) {
  return state.tables.reglements.filter((r) => r.facture_id === factureId)
}

export function reglementsEnAttenteParAdherent(state, adherentId, cumaId) {
  const factures = state.tables.factures.filter(
    (f) => f.adherent_id === adherentId && (!cumaId || f.cuma_id === cumaId)
  )
  const factureIds = new Set(factures.map((f) => f.id))
  return state.tables.reglements.filter(
    (r) => factureIds.has(r.facture_id) && r.statut === 'en_attente'
  )
}

export function formatMontant(n) {
  if (n == null) return ''
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-FR')
}
