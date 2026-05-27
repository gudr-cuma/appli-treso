import { Link, useNavigate } from 'react-router-dom'
import {
  X, Home, User, ClipboardCheck, FileText, PiggyBank,
  Receipt, Settings, Repeat, LogOut,
} from 'lucide-react'
import Logo from './Logo'
import { useAuthStore } from '../stores/useAuthStore'

const items = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/adherents', label: 'Fiche client', icon: User },
  { to: '/factures', label: 'Mes factures', icon: ClipboardCheck },
  { to: '/menu/bons-de-travail', label: 'Bons de travail', icon: FileText },
  { to: '/menu/saisir-reglement', label: 'Saisir un règlement', icon: PiggyBank },
  { to: '/menu/interrogation-compta', label: 'Interrogation comptable', icon: Receipt },
  { to: '/menu/parametres', label: "Paramètres de l'utilisateur", icon: Settings },
  { to: '/changer-cuma', label: 'Changer de Cuma', icon: Repeat },
  { to: '/deconnexion', label: 'Déconnexion', icon: LogOut },
]

export default function HamburgerMenu({ open, onClose }) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  if (!open) return null

  const handleNavigate = (to) => {
    onClose()
    navigate(to)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="bg-white w-[88%] max-w-sm h-full flex flex-col shadow-2xl">
        <div className="bg-navy text-white px-4 pt-3 pb-5 safe-top">
          <div className="flex items-start justify-between">
            <button
              aria-label="Fermer le menu"
              onClick={onClose}
              className="p-2 -ml-2 rounded hover:bg-white/10"
            >
              <X size={26} />
            </button>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              <User size={28} className="text-navy" />
            </div>
            <div className="text-sm leading-tight">
              <div className="font-semibold">{user?.prenom || 'Utilisateur'}</div>
              <div className="opacity-80 text-xs">{user?.email}</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <button
                key={it.to}
                onClick={() => handleNavigate(it.to)}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 active:bg-gray-100 transition text-left"
              >
                <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                  <Icon size={18} className="text-white" />
                </span>
                <span className="text-navy text-sm font-medium">{it.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      <button
        aria-label="Fermer"
        className="flex-1 bg-black/40"
        onClick={onClose}
      />
    </div>
  )
}
