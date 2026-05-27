import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useDataStore } from './useDataStore'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      rememberMe: false,
      login: (email, password) => {
        const users = useDataStore.getState().tables.users
        const found = users.find(
          (u) => String(u.email).toLowerCase() === String(email).toLowerCase()
            && String(u.password) === String(password),
        )
        if (!found) return { ok: false, error: 'Email ou mot de passe invalide' }
        set({ user: found })
        return { ok: true }
      },
      logout: () => set({ user: null }),
      setRememberMe: (v) => set({ rememberMe: v }),
    }),
    {
      name: 'appli-treso-auth',
      partialize: (state) => state.rememberMe ? { user: state.user, rememberMe: true } : { rememberMe: false },
    },
  ),
)
