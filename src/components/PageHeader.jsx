import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, onBack }) {
  const navigate = useNavigate()
  return (
    <div className="px-4 pt-3 pb-2">
      <button
        aria-label="Retour"
        onClick={() => onBack ? onBack() : navigate(-1)}
        className="p-1 -ml-1 text-navy"
      >
        <ChevronLeft size={28} />
      </button>
      <h1 className="text-2xl font-bold text-navy text-center mt-1">{title}</h1>
      {subtitle && (
        <div className="text-accent font-semibold text-center">{subtitle}</div>
      )}
    </div>
  )
}
