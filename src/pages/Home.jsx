import { Link } from 'react-router-dom'
import { User, ClipboardCheck, PiggyBank, FileBarChart2, Mail, Check, X } from 'lucide-react'
import { useDataStore } from '../stores/useDataStore'
import { useFacturesActiveCuma } from '../lib/selectors'
import { formatDate } from '../lib/selectors'

function Tile({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="bg-navy text-white rounded-2xl flex flex-col items-center justify-center py-6 shadow-tile active:scale-[0.98] transition"
    >
      <span className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
        <Icon size={22} className="text-white" />
      </span>
      <span className="font-semibold">{label}</span>
    </Link>
  )
}

function StatusIcon({ payee }) {
  return payee ? (
    <span className="w-8 h-8 rounded-full bg-ok/20 flex items-center justify-center">
      <Check size={18} className="text-ok" />
    </span>
  ) : (
    <span className="w-8 h-8 rounded-full bg-ko/20 flex items-center justify-center">
      <X size={18} className="text-ko" />
    </span>
  )
}

export default function Home() {
  const news = useDataStore((s) => s.tables.news).find((n) => n.actif)
  const adherents = useDataStore((s) => s.tables.adherents)
  const factures = useFacturesActiveCuma()
  const dernieres = [...factures]
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 3)
  const adherentName = (id) => {
    const a = adherents.find((x) => x.id === id)
    return a ? `${a.nom} ${a.prenom}` : ''
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 pt-4 pb-2 text-center text-2xl font-extrabold text-ok tracking-wide">
        CUMA
        <div className="text-xs font-semibold tracking-widest text-ok/70">LA PUISSANCE DU GROUPE</div>
      </div>
      <div className="px-4 grid grid-cols-2 gap-3">
        <Tile to="/adherents" icon={User} label="Adhérents" />
        <Tile to="/factures" icon={ClipboardCheck} label="Factures" />
        <Tile to="/impayes" icon={PiggyBank} label="Impayés" />
        <Tile to="/menu/interrogation-compta" icon={FileBarChart2} label="Comptabilité" />
      </div>

      {news && (
        <section className="mt-5">
          <h2 className="text-center font-semibold text-navy py-2 border-y border-gray-200 bg-white">
            {news.titre}
          </h2>
          <div className="bg-white px-4 py-4 flex items-center gap-4">
            <Mail size={36} className="text-navy/70 shrink-0" />
            <p className="text-sm">{news.message}</p>
          </div>
        </section>
      )}

      <section className="mt-3 pb-4">
        <h2 className="text-center font-semibold text-navy py-2 border-y border-gray-200 bg-white">
          Mes dernières factures
        </h2>
        <ul>
          {dernieres.map((f) => (
            <li key={f.id} className="bg-white border-b border-gray-100">
              <Link to={`/factures/${f.id}`} className="flex items-center gap-3 px-4 py-3">
                <StatusIcon payee={f.payee} />
                <span className="flex-1 font-semibold text-navy">{adherentName(f.adherent_id)}</span>
                <span className="text-xs text-muted">N°: {f.numero}</span>
                <span className="text-xs text-muted ml-3">{formatDate(f.date)}</span>
              </Link>
            </li>
          ))}
          {!dernieres.length && (
            <li className="px-4 py-6 text-center text-muted text-sm">Aucune facture.</li>
          )}
        </ul>
      </section>
    </div>
  )
}
