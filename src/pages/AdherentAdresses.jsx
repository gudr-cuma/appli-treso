import { useParams } from 'react-router-dom'
import { useDataStore } from '../stores/useDataStore'
import { adherentByCode } from '../lib/selectors'
import { useCumaStore } from '../stores/useCumaStore'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'
import { useEffect } from 'react'

export default function AdherentAdresses() {
  const { code } = useParams()
  const cumaId = useCumaStore((s) => s.activeCumaId)
  const loadAdherents      = useDataStore((s) => s.loadAdherents)
  const loadAdherentDetail = useDataStore((s) => s.loadAdherentDetail)
  const tables = useDataStore((s) => s.tables)
  const adh = adherentByCode({ tables }, code)

  useEffect(() => { loadAdherents(cumaId) }, [cumaId, loadAdherents])
  useEffect(() => { if (adh?.id) loadAdherentDetail(adh.id) }, [adh?.id, loadAdherentDetail])

  const list = adh ? tables.adresses.filter((a) => a.adherent_id === adh.id) : []

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Adresses" subtitle={adh ? adh.nom : ''} />
      <ul className="mt-2">
        {list.map((a) => (
          <li key={a.id} className="bg-white border-b border-gray-100 px-5 py-3">
            <div className="text-xs text-muted uppercase">{a.libelle}</div>
            <div className="text-navy">{a.ligne1}</div>
            <div className="text-navy">{a.cp} {a.ville}</div>
          </li>
        ))}
        {!list.length && <li className="px-5 py-6 text-center text-muted text-sm">Aucune adresse.</li>}
      </ul>
      <div className="flex-1" />
      <ActionFooter items={['factures', 'impayes']} />
    </div>
  )
}
