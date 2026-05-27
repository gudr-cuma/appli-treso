import { create } from 'zustand'
import * as XLSX from 'xlsx'

const SHEETS = [
  'users', 'cuma', 'user_cuma', 'adherents', 'factures',
  'reglements', 'contacts', 'adresses', 'rib', 'news',
]

export const useDataStore = create((set, get) => ({
  loaded: false,
  loading: false,
  error: null,
  tables: Object.fromEntries(SHEETS.map((s) => [s, []])),

  loadData: async () => {
    if (get().loading || get().loaded) return
    set({ loading: true, error: null })
    try {
      const res = await fetch('/db.xlsx')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = await res.arrayBuffer()
      const wb = XLSX.read(buffer, { type: 'array' })
      const tables = {}
      for (const name of SHEETS) {
        const ws = wb.Sheets[name]
        tables[name] = ws ? XLSX.utils.sheet_to_json(ws, { defval: null }) : []
      }
      set({ tables, loaded: true, loading: false })
    } catch (err) {
      console.error('loadData failed', err)
      set({ error: String(err), loading: false })
    }
  },
}))

// Helpers d'accès aux tables
export const selectUsers = (s) => s.tables.users
export const selectCumas = (s) => s.tables.cuma
export const selectUserCuma = (s) => s.tables.user_cuma
export const selectAdherents = (s) => s.tables.adherents
export const selectFactures = (s) => s.tables.factures
export const selectReglements = (s) => s.tables.reglements
export const selectContacts = (s) => s.tables.contacts
export const selectAdresses = (s) => s.tables.adresses
export const selectRib = (s) => s.tables.rib
export const selectNews = (s) => s.tables.news
