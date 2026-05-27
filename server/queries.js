const { readSheets } = require('./excel')

// ---------------------------------------------------------------------------
// USERS — TODO: créer une table TRESO_USERS dans ERP223B
// Colonnes attendues : id, email, password, prenom, nom, photo_url, role
// ---------------------------------------------------------------------------
async function getUsers(pool) {
  // Pas encore de table SQL dédiée — lecture depuis Excel en attendant
  const { users } = readSheets('users')
  return users
}

// ---------------------------------------------------------------------------
// CUMA — table SOC
// ---------------------------------------------------------------------------
async function getCuma(pool) {
  const r = await pool.request().query(`
    SELECT RTRIM(DOS) AS id,
           RTRIM(NOM) AS nom
    FROM   [dbo].[SOC]
    WHERE  DOS <> '999'
  `)
  return r.recordset
}

// ---------------------------------------------------------------------------
// USER_CUMA — lecture depuis Excel (lien user app ↔ DOS Divalto)
// ---------------------------------------------------------------------------
async function getUserCuma(pool) {
  const { user_cuma } = readSheets('user_cuma')
  return user_cuma.map((r) => ({ ...r, cuma_id: String(r.cuma_id) }))
}

// ---------------------------------------------------------------------------
// ADHERENTS — table CLI
// Remarque : CLI n'a pas de colonne PRENOM ni CODE explicite.
//   - code        = NOMABR (abréviation du tiers)
//   - dematerialisation = DEMATCOD
// ---------------------------------------------------------------------------
async function getAdherents(pool) {
  const r = await pool.request().query(`
    SELECT RTRIM(TIERS)    AS id,
           RTRIM(DOS)      AS cuma_id,
           RTRIM(NOMABR)   AS code,
           RTRIM(NOM)      AS nom,
           NULL            AS prenom,
           RTRIM(REGL)     AS mode_reglement,
           RTRIM(DEMATCOD) AS dematerialisation
    FROM   [dbo].[CLI]
  `)
  return r.recordset
}

// ---------------------------------------------------------------------------
// FACTURES — table ENT
// Remarque : le montant HT s'appelle HTMT dans Divalto (pas MTHT).
//   - montant_tva = TTCMT - HTMT
//   - payee       = NOTE (0 = non réglée)
// ---------------------------------------------------------------------------
async function getFactures(pool) {
  const r = await pool.request().query(`
    SELECT CAST(PINO AS varchar(20)) AS id,
           RTRIM(DOS)                AS cuma_id,
           RTRIM(TIERS)              AS adherent_id,
           CAST(PINO AS varchar(20)) AS numero,
           PIDT                      AS date,
           RTRIM(OP)                 AS type,
           HTMT                      AS montant_ht,
           TTCMT - HTMT              AS montant_tva,
           TTCMT                     AS montant_ttc,
           ECHDT                     AS date_echeance,
           CAST(NOTE AS int)         AS payee,
           NULL                      AS url_pdf
    FROM   [dbo].[ENT]
  `)
  return r.recordset
}

// ---------------------------------------------------------------------------
// REGLEMENTS — pas dans SQL, lecture depuis Excel
// ---------------------------------------------------------------------------
async function getReglements(pool) {
  const { reglements } = readSheets('reglements')
  return reglements
}

// ---------------------------------------------------------------------------
// CONTACTS — table T2
// T2 stocke TEL, TELGSM et EMAIL dans la même ligne.
// On les déplie ici en autant de lignes {type, valeur}.
// ---------------------------------------------------------------------------
async function getContacts(pool) {
  const r = await pool.request().query(`
    SELECT T2_ID                  AS rid,
           RTRIM(DOS)             AS cuma_id,
           RTRIM(TIERS)           AS adherent_id,
           NULLIF(RTRIM(TEL),   '') AS tel,
           NULLIF(RTRIM(TELGSM),'') AS gsm,
           NULLIF(RTRIM(EMAIL), '') AS email
    FROM   [dbo].[T2]
  `)
  const rows = []
  for (const row of r.recordset) {
    if (row.tel)
      rows.push({ id: `${row.rid}_tel`,   cuma_id: row.cuma_id, adherent_id: row.adherent_id, type: 'tel',    valeur: row.tel })
    if (row.gsm)
      rows.push({ id: `${row.rid}_gsm`,   cuma_id: row.cuma_id, adherent_id: row.adherent_id, type: 'telgsm', valeur: row.gsm })
    if (row.email)
      rows.push({ id: `${row.rid}_email`, cuma_id: row.cuma_id, adherent_id: row.adherent_id, type: 'email',  valeur: row.email })
  }
  return rows
}

// ---------------------------------------------------------------------------
// ADRESSES — table T1
// Remarque : libelle n'existe pas dans T1 (→ null).
// ---------------------------------------------------------------------------
async function getAdresses(pool) {
  const r = await pool.request().query(`
    SELECT T1_ID                AS id,
           RTRIM(TIERS)         AS adherent_id,
           NULL                 AS libelle,
           NULLIF(RTRIM(RUE), '') AS ligne1,
           RTRIM(CPOSTAL)       AS cp,
           RTRIM(VIL)           AS ville,
           RTRIM(DOS)           AS cuma_id
    FROM   [dbo].[T1]
  `)
  return r.recordset
}

// ---------------------------------------------------------------------------
// RIB — pas dans SQL, lecture depuis Excel
// ---------------------------------------------------------------------------
async function getRib(pool) {
  const { rib } = readSheets('rib')
  return rib
}

// ---------------------------------------------------------------------------
// NEWS — lecture depuis Excel
// ---------------------------------------------------------------------------
async function getNews(pool) {
  const { news } = readSheets('news')
  return news
}

// ---------------------------------------------------------------------------
// Point d'entrée appelé par l'API
// ---------------------------------------------------------------------------
async function getTables(pool) {
  // Séquentiel : msnodesqlv8 plante en cas de requêtes SQL parallèles sur le même pool
  const users      = await getUsers(pool)
  const cuma       = await getCuma(pool)
  const user_cuma  = await getUserCuma(pool)
  const adherents  = await getAdherents(pool)
  const factures   = await getFactures(pool)
  const reglements = await getReglements(pool)
  const contacts   = await getContacts(pool)
  const adresses   = await getAdresses(pool)
  const rib        = await getRib(pool)
  const news       = await getNews(pool)
  return { users, cuma, user_cuma, adherents, factures, reglements, contacts, adresses, rib, news }
}

module.exports = { getTables }
