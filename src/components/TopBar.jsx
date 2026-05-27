import { Menu } from 'lucide-react'
import Logo from './Logo'

export default function TopBar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-navy text-white safe-top">
      <div className="flex items-center justify-between px-4 h-14">
        <button
          aria-label="Ouvrir le menu"
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded hover:bg-white/10 active:bg-white/20 transition"
        >
          <Menu size={28} strokeWidth={2.5} />
        </button>
        <Logo />
      </div>
    </header>
  )
}
