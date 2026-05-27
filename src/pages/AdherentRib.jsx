import { useParams } from 'react-router-dom'
import { useDataStore } from '../stores/useDataStore'
import { adherentByCode } from '../lib/selectors'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'

export default function AdherentRib() {
  const { code } = useParams()
  const tables = useDataStore((s) => s.tables)
  const adh = adherentByCode({ tables }, code)
  const list = adh ? tables.rib.filter((r) => r.adherent_id === adh.id) : []
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="RIB" subtitle={adh ? `${adh.nom} ${adh.prenom}` : ''} />
      <ul className="mt-2">
        {list.map((r) => (
          <li key={r.id} className="bg-white border-b border-gray-100 px-5 py-3">
            <div className="text-xs text-muted uppercase">IBAN</div>
            <div className="text-navy font-mono">{r.iban}</div>
            <div className="text-xs text-muted uppercase mt-2">BIC</div>
            <div className="text-navy font-mono">{r.bic}</div>
          </li>
        ))}
        {!list.length && <li className="px-5 py-6 text-center text-muted text-sm">Aucun RIB.</li>}
      </ul>
      <div className="flex-1" />
      <ActionFooter items={['factures', 'impayes']} />
    </div>
  )
}
