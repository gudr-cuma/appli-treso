import { create } from 'zustand'
import * as XLSX from 'xlsx'
import { useSourceStore } from './useSourceStore'

const SHEETS = [
  'users', 'cuma', 'user_cuma', 'adherents', 'factures',
  'reglements', 'contacts', 'adresses', 'rib', 'news',
]

const emptyTables = () => Object.fromEntries(SHEETS.map((s) => [s, []]))

const isSQL = () => useSourceStore.getState().source === 'sql'

export const useDataStore = create((set, get) => ({
  loaded: false,
  loading: false,
  error: null,
  tables: emptyTables(),

  adherentsLoadedFor: null,   // cumaId
  adherentsLoading: false,

  facturesLoadedFor: null,    // cumaId
  facturesLoading: false,

  detailLoadedFor: null,      // adherent TIERS
  detailLoading: false,

  reset: () => set({
    loaded: false, loading: false, error: null,
    tables: emptyTables(),
    adherentsLoadedFor: null, adherentsLoading: false,
    facturesLoadedFor: null,  facturesLoading: false,
    detailLoadedFor: null,    detailLoading: false,
  }),

  // ── Login : users + cuma + user_cuma + Excel (reglements/rib/news) ─────────
  loadData: async () => {
    if (get().loading || get().loaded) return
    set({ loading: true, error: null })

    try {
      let tables

      if (isSQL()) {
        const res = await fetch('/api/tables')
        if (!res.ok) {
          const msg = await res.text().catch(() => `HTTP ${res.status}`)
          throw new Error(`API ${res.status} — ${msg}`)
        }
        tables = await res.json()
        for (const name of SHEETS) {
          if (!Array.isArray(tables[name])) tables[name] = []
        }
      } else {
        // Mode Excel : tout en une fois (fichier léger)
        const res = await fetch('/db.xlsx')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const buffer = await res.arrayBuffer()
        const wb = XLSX.read(buffer, { type: 'array' })
        tables = {}
        for (const name of SHEETS) {
          const ws = wb.Sheets[name]
          tables[name] = ws ? XLSX.utils.sheet_to_json(ws, { defval: null }) : []
        }
      }

      set({ tables, loaded: true, loading: false })
    } catch (err) {
      console.error('[DataStore] loadData failed', err)
      const friendly =
        isSQL() && (err.message.includes('fetch') || err.message.includes('Failed') || err.message.includes('NetworkError'))
          ? 'Impossible de joindre le serveur API (localhost:3001).\nVérifiez que `npm run dev` est bien démarré.'
          : String(err.message || err)
      set({ error: friendly, loading: false })
    }
  },

  // ── Adhérents d'une CUMA (lazy, SQL uniquement) ──────────────────────────
  loadAdherents: async (cumaId) => {
    if (!cumaId || !isSQL()) return
    if (get().adherentsLoadedFor === cumaId || get().adherentsLoading) return
    set({ adherentsLoading: true })
    try {
      const res = await fetch(`/api/adherents?cuma_id=${encodeURIComponent(cumaId)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const adherents = await res.json()
      set((s) => ({
        tables: { ...s.tables, adherents },
        adherentsLoadedFor: cumaId,
        adherentsLoading: false,
      }))
    } catch (err) {
      console.error('[DataStore] loadAdherents failed', err)
      set({ adherentsLoading: false })
    }
  },

  // ── Factures d'une CUMA (lazy, SQL uniquement) ──────────────────────────
  loadFactures: async (cumaId) => {
    if (!cumaId || !isSQL()) return
    if (get().facturesLoadedFor === cumaId || get().facturesLoading) return
    set({ facturesLoading: true })
    try {
      const res = await fetch(`/api/factures?cuma_id=${encodeURIComponent(cumaId)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const factures = await res.json()
      set((s) => ({
        tables: { ...s.tables, factures },
        facturesLoadedFor: cumaId,
        facturesLoading: false,
      }))
    } catch (err) {
      console.error('[DataStore] loadFactures failed', err)
      set({ facturesLoading: false })
    }
  },

  // ── Contacts + adresses d'un adhérent (lazy, SQL uniquement) ────────────
  loadAdherentDetail: async (adherentId) => {
    if (!adherentId || !isSQL()) return
    if (get().detailLoadedFor === adherentId || get().detailLoading) return
    set({ detailLoading: true })
    try {
      const res = await fetch(`/api/adherent/${encodeURIComponent(adherentId)}/detail`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { contacts, adresses } = await res.json()
      set((s) => ({
        tables: { ...s.tables, contacts, adresses },
        detailLoadedFor: adherentId,
        detailLoading: false,
      }))
    } catch (err) {
      console.error('[DataStore] loadAdherentDetail failed', err)
      set({ detailLoading: false })
    }
  },
}))

export const selectUsers      = (s) => s.tables.users
export const selectCumas      = (s) => s.tables.cuma
export const selectUserCuma   = (s) => s.tables.user_cuma
export const selectAdherents  = (s) => s.tables.adherents
export const selectFactures   = (s) => s.tables.factures
export const selectReglements = (s) => s.tables.reglements
export const selectContacts   = (s) => s.tables.contacts
export const selectAdresses   = (s) => s.tables.adresses
export const selectRib        = (s) => s.tables.rib
export const selectNews       = (s) => s.tables.news
