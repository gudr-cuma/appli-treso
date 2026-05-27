import { useParams } from 'react-router-dom'
import { useDataStore } from '../stores/useDataStore'
import { adherentByCode } from '../lib/selectors'
import { useCumaStore } from '../stores/useCumaStore'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'
import { useEffect } from 'react'

export default function AdherentContacts() {
  const { code } = useParams()
  const cumaId = useCumaStore((s) => s.activeCumaId)
  const loadAdherents      = useDataStore((s) => s.loadAdherents)
  const loadAdherentDetail = useDataStore((s) => s.loadAdherentDetail)
  const tables = useDataStore((s) => s.tables)
  const adh = adherentByCode({ tables }, code)

  useEffect(() => { loadAdherents(cumaId) }, [cumaId, loadAdherents])
  useEffect(() => { if (adh?.id) loadAdherentDetail(adh.id) }, [adh?.id, loadAdherentDetail])

  const list = adh ? tables.contacts.filter((c) => c.adherent_id === adh.id) : []

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Contacts" subtitle={adh ? adh.nom : ''} />
      <ul className="mt-2">
        {list.map((c) => (
          <li key={c.id} className="bg-white border-b border-gray-100 px-5 py-3">
            <div className="text-xs text-muted uppercase">{c.type}</div>
            <div className="text-navy font-medium">{c.valeur}</div>
          </li>
        ))}
        {!list.length && <li className="px-5 py-6 text-center text-muted text-sm">Aucun contact.</li>}
      </ul>
      <div className="flex-1" />
      <ActionFooter items={['factures', 'impayes']} />
    </div>
  )
}
