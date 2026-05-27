// Génère public/db.xlsx avec 10 onglets de données fictives inspirées des maquettes.
// Lancer : npm run seed
import { utils, writeFile } from 'xlsx'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const OUT = 'public/db.xlsx'
const PDF = '/facture-placeholder.svg'

const users = [
  { id: 'U1', email: 'test2.president@cuma.fr', password: 'demo', prenom: 'Luc', nom: 'Martin', role: 'admin' },
  { id: 'U2', email: 'tresorier@cuma.fr', password: 'demo', prenom: 'Anne', nom: 'Bernard', role: 'user' },
]

const cuma = [
  { id: 'C1', nom: 'CUMA 1' },
  { id: 'C2', nom: 'CUMA 2' },
  { id: 'C3', nom: 'CUMA 3' },
  { id: 'C4', nom: 'CUMA 4' },
  { id: 'C5', nom: 'CUMA 5' },
]

const user_cuma = [
  { user_id: 'U1', cuma_id: 'C1' },
  { user_id: 'U1', cuma_id: 'C2' },
  { user_id: 'U1', cuma_id: 'C3' },
  { user_id: 'U1', cuma_id: 'C4' },
  { user_id: 'U1', cuma_id: 'C5' },
  { user_id: 'U2', cuma_id: 'C1' },
]

const adherents = [
  { id: 'A1', cuma_id: 'C1', code: 'A0000010', nom: 'DUPONT', prenom: 'Paul', mode_reglement: 'C - Chèque', dematerialisation: 'Email lien' },
  { id: 'A2', cuma_id: 'C1', code: 'A0000011', nom: 'DURAND', prenom: 'Jean', mode_reglement: 'V - Virement', dematerialisation: 'Email lien' },
  { id: 'A3', cuma_id: 'C1', code: 'A0000012', nom: 'LEBLANC', prenom: 'Henri', mode_reglement: 'C - Chèque', dematerialisation: 'Papier' },
  { id: 'A4', cuma_id: 'C1', code: 'A0000013', nom: 'LEFEVRE', prenom: 'Martine', mode_reglement: 'P - Prélèvement', dematerialisation: 'Email lien' },
  { id: 'A5', cuma_id: 'C1', code: 'A0000014', nom: 'SCHMITT', prenom: 'Yann', mode_reglement: 'V - Virement', dematerialisation: 'Email lien' },
  { id: 'A6', cuma_id: 'C2', code: 'B0000001', nom: 'PETIT', prenom: 'Claire', mode_reglement: 'C - Chèque', dematerialisation: 'Papier' },
  { id: 'A7', cuma_id: 'C2', code: 'B0000002', nom: 'MOREAU', prenom: 'Eric', mode_reglement: 'V - Virement', dematerialisation: 'Email lien' },
]

const factures = [
  { id: 'F1', cuma_id: 'C1', adherent_id: 'A1', numero: '2021001', date: '2021-03-07', type: 'travaux',         montant_ht: 10000, montant_tva: 2000, montant_ttc: 12000, date_echeance: '2021-04-07', payee: true,  url_pdf: PDF },
  { id: 'F2', cuma_id: 'C1', adherent_id: 'A2', numero: '2021002', date: '2021-03-07', type: 'travaux',         montant_ht: 8538,  montant_tva: 1707, montant_ttc: 10245, date_echeance: '2021-04-07', payee: false, url_pdf: PDF },
  { id: 'F3', cuma_id: 'C1', adherent_id: 'A3', numero: '2021003', date: '2021-03-07', type: 'travaux',         montant_ht: 8538,  montant_tva: 1707, montant_ttc: 10245, date_echeance: '2021-04-07', payee: true,  url_pdf: PDF },
  { id: 'F4', cuma_id: 'C1', adherent_id: 'A4', numero: '2021004', date: '2021-03-07', type: 'capital social', montant_ht: 8538,  montant_tva: 1707, montant_ttc: 10245, date_echeance: '2021-04-07', payee: false, url_pdf: PDF },
  { id: 'F5', cuma_id: 'C1', adherent_id: 'A5', numero: '2021005', date: '2021-03-15', type: 'travaux',         montant_ht: 4200,  montant_tva: 840,  montant_ttc: 5040,  date_echeance: '2021-04-15', payee: false, url_pdf: PDF },
  { id: 'F6', cuma_id: 'C1', adherent_id: 'A4', numero: '2021006', date: '2021-04-02', type: 'travaux',         montant_ht: 3300,  montant_tva: 660,  montant_ttc: 3960,  date_echeance: '2021-05-02', payee: false, url_pdf: PDF },
  { id: 'F7', cuma_id: 'C2', adherent_id: 'A6', numero: '2021100', date: '2021-03-10', type: 'travaux',         montant_ht: 5000,  montant_tva: 1000, montant_ttc: 6000,  date_echeance: '2021-04-10', payee: true,  url_pdf: PDF },
  { id: 'F8', cuma_id: 'C2', adherent_id: 'A7', numero: '2021101', date: '2021-03-12', type: 'capital social', montant_ht: 2000,  montant_tva: 400,  montant_ttc: 2400,  date_echeance: '2021-04-12', payee: false, url_pdf: PDF },
]

// reglements en attente (impayés) — un par facture impayée
const reglements = factures
  .filter((f) => !f.payee)
  .map((f, i) => ({
    id: `R${i + 1}`,
    facture_id: f.id,
    statut: 'en_attente',
    date: f.date_echeance,
    montant: f.montant_ttc,
  }))

// 4 règlements en attente pour LEFEVRE Martine (A4) — comme dans la maquette
reglements.push(
  { id: 'R90', facture_id: 'F4', statut: 'en_attente', date: '2021-05-01', montant: 1500 },
  { id: 'R91', facture_id: 'F6', statut: 'en_attente', date: '2021-06-01', montant: 1500 },
)

const contacts = [
  { id: 'CT1', adherent_id: 'A1', type: 'tel',   valeur: '01 02 03 10 15' },
  { id: 'CT2', adherent_id: 'A1', type: 'email', valeur: 'dupont@gmail.com' },
  { id: 'CT3', adherent_id: 'A2', type: 'tel',   valeur: '02 33 44 55 66' },
  { id: 'CT4', adherent_id: 'A3', type: 'email', valeur: 'leblanc@gmail.com' },
  { id: 'CT5', adherent_id: 'A4', type: 'tel',   valeur: '06 12 34 56 78' },
]

const adresses = [
  { id: 'AD1', adherent_id: 'A1', libelle: 'Principale', ligne1: '45 rue Sedaine',         cp: '75011', ville: 'PARIS' },
  { id: 'AD2', adherent_id: 'A2', libelle: 'Principale', ligne1: '12 av. de la République', cp: '14000', ville: 'CAEN' },
  { id: 'AD3', adherent_id: 'A3', libelle: 'Principale', ligne1: 'Ferme du Bois',           cp: '50500', ville: 'CARENTAN' },
  { id: 'AD4', adherent_id: 'A4', libelle: 'Principale', ligne1: '3 chemin des Prés',       cp: '14130', ville: "PONT-L'EVEQUE" },
  { id: 'AD5', adherent_id: 'A5', libelle: 'Principale', ligne1: '8 rue du Stade',          cp: '14400', ville: 'BAYEUX' },
]

const rib = [
  { id: 'RB1', adherent_id: 'A1', iban: 'FR76 3000 1007 9412 3456 7890 185', bic: 'BDFEFRPPCCT' },
  { id: 'RB2', adherent_id: 'A2', iban: 'FR76 1820 6000 1112 3456 7890 142', bic: 'AGRIFRPP882' },
]

const news = [
  { id: 'N1', date: '2021-12-15', titre: 'Message Cuma',  message: "Date de l'AG : 31/12/2021. Venez nombreux !",   actif: true },
  { id: 'N2', date: '2021-10-01', titre: 'Maintenance',   message: 'Maintenance prévue le 5/10 entre 22h et 23h.', actif: false },
]

const wb = utils.book_new()
const sheets = { users, cuma, user_cuma, adherents, factures, reglements, contacts, adresses, rib, news }
for (const [name, rows] of Object.entries(sheets)) {
  utils.book_append_sheet(wb, utils.json_to_sheet(rows), name)
}

mkdirSync(dirname(OUT), { recursive: true })
writeFile(wb, OUT)
console.log(`OK - ${OUT} genere (${Object.keys(sheets).length} onglets)`)
