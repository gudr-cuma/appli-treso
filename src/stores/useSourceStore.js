import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Source des données : 'excel' | 'sql'
 * - 'excel' : lecture du fichier public/db.xlsx (mode démo / Cloudflare Pages)
 * - 'sql'   : API locale Express → SQL Server ERP223B (mode terrain, en local uniquement)
 */
export const useSourceStore = create(
  persist(
    (set) => ({
      source: 'excel',
      setSource: (source) => set({ source }),
    }),
    { name: 'treso-source' },
  ),
)
