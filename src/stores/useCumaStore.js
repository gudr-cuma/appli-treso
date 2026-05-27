import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useDataStore } from './useDataStore'
import { useAuthStore } from './useAuthStore'

export const useCumaStore = create(
  persist(
    (set, get) => ({
      activeCumaId: null,
      setActiveCuma: (id) => set({ activeCumaId: id }),
      ensureDefault: () => {
        if (get().activeCumaId) return
        const userId = useAuthStore.getState().user?.id
        if (!userId) return
        const links = useDataStore.getState().tables.user_cuma
        const first = links.find((l) => l.user_id === userId)
        if (first) set({ activeCumaId: first.cuma_id })
      },
    }),
    { name: 'appli-treso-cuma' },
  ),
)

// Hook utilitaire : liste des CUMA accessibles à l'utilisateur courant
export function useAccessibleCumas() {
  const userId = useAuthStore((s) => s.user?.id)
  const cumas = useDataStore((s) => s.tables.cuma)
  const links = useDataStore((s) => s.tables.user_cuma)
  if (!userId) return []
  const ids = new Set(links.filter((l) => l.user_id === userId).map((l) => l.cuma_id))
  return cumas.filter((c) => ids.has(c.id))
}
