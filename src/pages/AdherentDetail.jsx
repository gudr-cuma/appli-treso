import { Link, useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useDataStore } from '../stores/useDataStore'
import { adherentByCode } from '../lib/selectors'
import PageHeader from '../components/PageHeader'
import ActionFooter from '../components/ActionFooter'

export default function AdherentDetail() {
  const { code } = useParams()
  const tables = useDataStore((s) => s.tables)
  const adh = adherentByCode({ tables }, code)
  if (!adh) {
    return <div className="flex-1 flex items-center justify-center text-muted">Adhérent introuvable.</div>
  }
  const adresse = tables.adresses.find((a) => a.adherent_id === adh.id)
  const tel = tables.contacts.find((c) => c.adherent_id === adh.id && c.type === 'tel')
  const mail = tables.contacts.find((c) => c.adherent_id === adh.id && c.type === 'email')

  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title={`${adh.nom} ${adh.prenom}`} subtitle={adh.code} />
      <div className="px-4">
        <div className="bg-white rounded-2xl shadow-card p-5 border border-gray-200">
          <div className="text-muted text-sm">Adresse</div>
          {adresse && (
            <div className="mt-3 text-navy text-sm space-y-1">
              <div>{adresse.ligne1}</div>
              <div>{adresse.cp} {adresse.ville}</div>
              {tel && <div>Tél. : {tel.valeur}</div>}
              {mail && <div>Mail : {mail.valeur}</div>}
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-3 items-center text-sm">
          <span className="text-navy">Mode règlement</span>
          <div className="pill-select min-w-[140px]">
            <span>{adh.mode_reglement || '—'}</span>
            <ChevronDown size={14} className="text-muted" />
          </div>
          <span className="text-navy">Dématérialisation</span>
          <div className="pill-select min-w-[140px]">
            <span>{adh.dematerialisation || '—'}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-between gap-2">
          <Link to={`/adherents/${adh.code}/contacts`} className="btn-primary text-accent bg-navy text-xs flex-1 text-center">
            Contacts
          </Link>
          <Link to={`/adherents/${adh.code}/adresses`} className="btn-primary text-accent bg-navy text-xs flex-1 text-center">
            Adresses
          </Link>
          <Link to={`/adherents/${adh.code}/rib`} className="btn-primary text-accent bg-navy text-xs flex-1 text-center">
            RIB
          </Link>
        </div>
      </div>
      <div className="flex-1" />
      <ActionFooter items={['factures', 'impayes']} />
    </div>
  )
}
