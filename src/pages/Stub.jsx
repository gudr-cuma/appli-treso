import { Clock } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Stub({ title }) {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title={title} />
      <div className="flex-1 flex flex-col items-center justify-center text-muted gap-3 px-8 text-center">
        <Clock size={48} className="text-accent" />
        <div className="text-lg font-semibold text-navy">Bientôt disponible</div>
        <p className="text-sm">
          Cette fonctionnalité fera partie d&apos;une prochaine version.
        </p>
      </div>
    </div>
  )
}
