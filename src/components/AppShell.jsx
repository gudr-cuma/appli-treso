import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import HamburgerMenu from './HamburgerMenu'
import { useDataStore } from '../stores/useDataStore'
import { useCumaStore } from '../stores/useCumaStore'

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const loaded = useDataStore((s) => s.loaded)
  const ensureDefault = useCumaStore((s) => s.ensureDefault)

  useEffect(() => {
    if (loaded) ensureDefault()
  }, [loaded, ensureDefault])

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 flex flex-col">
        {!loaded ? (
          <div className="flex-1 flex items-center justify-center text-muted">
            Chargement des données…
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
