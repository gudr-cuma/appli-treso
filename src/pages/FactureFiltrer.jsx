import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'
import { useAdherentsActiveCuma, useFacturesActiveCuma } from '../lib/selectors'

function Pill({ value, onChange, options, placeholder = 'Aucun' }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pill-select min-w-[140px] appearance-none pr-8"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
    </div>
  )
}

export default function FactureFiltrer() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const adherents = useAdherentsActiveCuma()
  const factures = useFacturesActiveCuma()

  const [adherent, setAdherent] = useState(params.get('adherent_id') || '')
  const [type, setType] = useState(params.get('type') || '')
  const [payee, setPayee] = useState(params.get('payee') || '')
  const [from, setFrom] = useState(params.get('from') || '')
  const [to, setTo] = useState(params.get('to') || '')

  const types = [...new Set(factures.map((f) => f.type))].map((t) => ({ value: t, label: t }))
  const adhOptions = adherents.map((a) => ({ value: a.id, label: `${a.nom} ${a.prenom}` }))

  const apply = () => {
    const qs = new URLSearchParams()
    if (adherent) qs.set('adherent_id', adherent)
    if (type) qs.set('type', type)
    if (payee) qs.set('payee', payee)
    if (from) qs.set('from', from)
    if (to) qs.set('to', to)
    navigate(`/factures${qs.toString() ? `?${qs}` : ''}`)
  }

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Filtrer mes factures" />
      <div className="px-6 mt-4 space-y-5 flex-1">
        <Row label="Adhérent">
          <Pill value={adherent} onChange={setAdherent} options={adhOptions} />
        </Row>
        <Row label="Type">
          <Pill value={type} onChange={setType} options={types} />
        </Row>
        <Row label="Payée">
          <Pill
            value={payee}
            onChange={setPayee}
            options={[{ value: 'oui', label: 'Oui' }, { value: 'non', label: 'Non' }]}
          />
        </Row>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <DateField label="De" value={from} onChange={setFrom} />
          <DateField label="À" value={to} onChange={setTo} />
        </div>
      </div>

      <div className="px-6 py-5 flex justify-between gap-3">
        <button onClick={() => navigate('/factures')} className="btn-primary bg-gray-300 text-navy min-w-[120px]">
          Annuler
        </button>
        <button onClick={apply} className="btn-primary min-w-[120px]">
          Valider
        </button>
      </div>
      <ActionFooter items={['filtrer']} />
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-navy font-medium">{label}</span>
      {children}
    </div>
  )
}

function DateField({ label, value, onChange }) {
  return (
    <div className="text-center">
      <div className="text-sm text-muted">{label}</div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center"
      />
    </div>
  )
}
