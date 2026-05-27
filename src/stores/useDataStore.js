import { create } from 'zustand'
import * as XLSX from 'xlsx'
import { useSourceStore } from './useSourceStore'

const SHEETS = [
  'users', 'cuma', 'user_cuma', 'adherents', 'factures',
  'reglements', 'contacts', 'adresses', 'rib', 'news',
]

const emptyTables = () => Object.fromEntries(SHEETS.map((s) => [s, []]))

export const useDataStore = create((set, get) => ({
  loaded: false,
  loading: false,
  error: null,
  tables: emptyTables(),

  // Factures chargées à la demande (SQL uniquement)
  facturesLoadedFor: null,   // cumaId dont les factures sont en store
  facturesLoading: false,

  reset: () => set({
    loaded: false, loading: false, error: null,
    tables: emptyTables(),
    facturesLoadedFor: null, facturesLoading: false,
  }),

  // ── Chargement initial (tout sauf factures en mode SQL) ─────────────────
  loadData: async () => {
    if (get().loading || get().loaded) return
    set({ loading: true, error: null })

    const source = useSourceStore.getState().source

    try {
      let tables

      if (source === 'sql') {
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
        source === 'sql' && (err.message.includes('fetch') || err.message.includes('Failed') || err.message.includes('NetworkError'))
          ? 'Impossible de joindre le serveur API (localhost:3001).\nVérifiez que `npm run dev` est bien démarré.'
          : String(err.message || err)
      set({ error: friendly, loading: false })
    }
  },

  // ── Factures par CUMA (SQL uniquement, appelé depuis Factures / Impayés) ──
  loadFactures: async (cumaId) => {
    if (!cumaId) return
    const source = useSourceStore.getState().source
    // En mode Excel les factures sont déjà dans tables (chargées par loadData)
    if (source !== 'sql') return
    // Déjà chargées pour cette CUMA
    if (get().facturesLoadedFor === cumaId) return
    if (get().facturesLoading) return

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
}))

// Helpers d'accès aux tables
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
