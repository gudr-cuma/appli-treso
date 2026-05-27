import { Link } from 'react-router-dom'
import { User, SlidersHorizontal, PiggyBank, ClipboardCheck } from 'lucide-react'

const ICONS = {
  adherents: { icon: User, label: 'Adhérents', to: '/adherents' },
  filtrer: { icon: SlidersHorizontal, label: 'Filtrer', to: '/factures/filtrer' },
  impayes: { icon: PiggyBank, label: 'Impayés', to: '/impayes' },
  factures: { icon: ClipboardCheck, label: 'Factures', to: '/factures' },
}

export default function ActionFooter({ items = [] }) {
  if (!items.length) return null
  return (
    <nav className="sticky bottom-0 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex justify-around items-center py-2">
        {items.map((key) => {
          const def = ICONS[key]
          if (!def) return null
          const Icon = def.icon
          return (
            <Link
              key={key}
              to={def.to}
              className="flex flex-col items-center gap-1 py-1 px-3 text-accent hover:text-accent-dark"
            >
              <Icon size={26} strokeWidth={2} />
              <span className="text-xs font-medium">{def.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
