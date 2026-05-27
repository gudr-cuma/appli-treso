/**
 * REQUÊTES SQL — À compléter avec les vrais noms de tables ERP223B
 * =================================================================
 *
 * Chaque fonction reçoit un pool `mssql` et retourne un tableau d'objets
 * au format attendu par le front-end (même structure que l'onglet Excel).
 *
 * Quand tu m'envoies les noms de tables / colonnes ERP, je remplis les TODO.
 *
 * En attendant : toutes les fonctions renvoient [] → l'app démarre en mode SQL
 * mais affiche des listes vides. Seul le login sera également vide (voir note users).
 */

// ---------------------------------------------------------------------------
// USERS — Utilisateurs de l'application
// ---------------------------------------------------------------------------
// Colonnes attendues : id, email, password, prenom, nom, photo_url, role
async function getUsers(pool) {
  // TODO: remplacer par le vrai nom de table/vue
  // Exemple :
  // const r = await pool.request().query(`
  //   SELECT USR_ID    AS id,
  //          USR_EMAIL  AS email,
  //          USR_MDP    AS password,
  //          USR_PRENOM AS prenom,
  //          USR_NOM    AS nom,
  //          NULL       AS photo_url,
  //          'user'     AS role
  //   FROM [dbo].[T_UTILISATEURS]
  // `)
  // return r.recordset
  return []
}

// ---------------------------------------------------------------------------
// CUMA
// ---------------------------------------------------------------------------
// Colonnes attendues : id, nom, logo_url
async function getCuma(pool) {
  // TODO
  // const r = await pool.request().query(`
  //   SELECT CUMA_ID   AS id,
  //          CUMA_NOM  AS nom,
  //          NULL      AS logo_url
  //   FROM [dbo].[T_CUMA]
  // `)
  // return r.recordset
  return []
}

// ---------------------------------------------------------------------------
// USER_CUMA — Lien M:N utilisateur ↔ CUMA
// ---------------------------------------------------------------------------
// Colonnes attendues : user_id, cuma_id
async function getUserCuma(pool) {
  // TODO
  return []
}

// ---------------------------------------------------------------------------
// ADHERENTS
// ---------------------------------------------------------------------------
// Colonnes attendues : id, cuma_id, code, nom, prenom, mode_reglement, dematerialisation
async function getAdherents(pool) {
  // TODO : exemple de mapping complet
  // const r = await pool.request().query(`
  //   SELECT ADH_ID            AS id,
  //          ADH_CUMA_ID       AS cuma_id,
  //          ADH_CODE          AS code,
  //          ADH_NOM           AS nom,
  //          ADH_PRENOM        AS prenom,
  //          ADH_MODE_REGLT    AS mode_reglement,
  //          ADH_DEMAT         AS dematerialisation
  //   FROM [dbo].[T_ADHERENTS]
  //   WHERE ADH_ACTIF = 1
  // `)
  // return r.recordset
  return []
}

// ---------------------------------------------------------------------------
// FACTURES
// ---------------------------------------------------------------------------
// Colonnes attendues : id, cuma_id, adherent_id, numero, date, type,
//                      montant_ht, montant_tva, montant_ttc, date_echeance,
//                      payee, url_pdf
async function getFactures(pool) {
  // TODO
  return []
}

// ---------------------------------------------------------------------------
// REGLEMENTS
// ---------------------------------------------------------------------------
// Colonnes attendues : id, facture_id, statut (en_attente|regle), date, montant
async function getReglements(pool) {
  // TODO
  return []
}

// ---------------------------------------------------------------------------
// CONTACTS
// ---------------------------------------------------------------------------
// Colonnes attendues : id, adherent_id, type, valeur
async function getContacts(pool) {
  // TODO
  return []
}

// ---------------------------------------------------------------------------
// ADRESSES
// ---------------------------------------------------------------------------
// Colonnes attendues : id, adherent_id, libelle, ligne1, cp, ville
async function getAdresses(pool) {
  // TODO
  return []
}

// ---------------------------------------------------------------------------
// RIB
// ---------------------------------------------------------------------------
// Colonnes attendues : id, adherent_id, iban, bic
async function getRib(pool) {
  // TODO
  return []
}

// ---------------------------------------------------------------------------
// NEWS
// ---------------------------------------------------------------------------
// Colonnes attendues : id, date, titre, message, actif
async function getNews(pool) {
  // TODO
  return []
}

// ---------------------------------------------------------------------------
// Point d'entrée principal — appelé par l'API
// ---------------------------------------------------------------------------
async function getTables(pool) {
  const [users, cuma, user_cuma, adherents, factures, reglements, contacts, adresses, rib, news] =
    await Promise.all([
      getUsers(pool),
      getCuma(pool),
      getUserCuma(pool),
      getAdherents(pool),
      getFactures(pool),
      getReglements(pool),
      getContacts(pool),
      getAdresses(pool),
      getRib(pool),
      getNews(pool),
    ])
  return { users, cuma, user_cuma, adherents, factures, reglements, contacts, adresses, rib, news }
}

module.exports = { getTables }
