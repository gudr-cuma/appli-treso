import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDataStore } from './stores/useDataStore'
import { useAuthStore } from './stores/useAuthStore'
import RequireAuth from './components/RequireAuth'
import AppShell from './components/AppShell'
import Login from './pages/Login'
import Home from './pages/Home'
import Factures from './pages/Factures'
import FactureDetail from './pages/FactureDetail'
import FactureFiltrer from './pages/FactureFiltrer'
import Adherents from './pages/Adherents'
import AdherentDetail from './pages/AdherentDetail'
import AdherentContacts from './pages/AdherentContacts'
import AdherentAdresses from './pages/AdherentAdresses'
import AdherentRib from './pages/AdherentRib'
import Impayes from './pages/Impayes'
import ChangerCuma from './pages/ChangerCuma'
import Deconnexion from './pages/Deconnexion'
import Stub from './pages/Stub'

export default function App() {
  const loadData = useDataStore((s) => s.loadData)
  const loaded = useDataStore((s) => s.loaded)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!loaded) loadData()
  }, [loaded, loadData])

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<RequireAuth><AppShell /></RequireAuth>}>
        <Route path="/" element={<Home />} />
        <Route path="/factures" element={<Factures />} />
        <Route path="/factures/filtrer" element={<FactureFiltrer />} />
        <Route path="/factures/:id" element={<FactureDetail />} />
        <Route path="/adherents" element={<Adherents />} />
        <Route path="/adherents/:code" element={<AdherentDetail />} />
        <Route path="/adherents/:code/contacts" element={<AdherentContacts />} />
        <Route path="/adherents/:code/adresses" element={<AdherentAdresses />} />
        <Route path="/adherents/:code/rib" element={<AdherentRib />} />
        <Route path="/impayes" element={<Impayes />} />
        <Route path="/changer-cuma" element={<ChangerCuma />} />
        <Route path="/deconnexion" element={<Deconnexion />} />
        <Route path="/menu/bons-de-travail" element={<Stub title="Bons de travail" />} />
        <Route path="/menu/saisir-reglement" element={<Stub title="Saisir un règlement" />} />
        <Route path="/menu/interrogation-compta" element={<Stub title="Interrogation comptable" />} />
        <Route path="/menu/parametres" element={<Stub title="Paramètres de l'utilisateur" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
