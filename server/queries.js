const { readSheets } = require('./excel')
const { sql } = require('./db')

// ---------------------------------------------------------------------------
// USERS — TODO: créer une table TRESO_USERS dans ERP223B
// ---------------------------------------------------------------------------
async function getUsers(pool) {
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
// ADHERENTS — table CLI, filtrés par DOS (lazy via /api/adherents?cuma_id=X)
// ---------------------------------------------------------------------------
async function getAdherentsByCuma(pool, cumaId) {
  const r = await pool.request()
    .input('dos', sql.VarChar(10), String(cumaId).trim())
    .query(`
      SELECT RTRIM(TIERS)    AS id,
             RTRIM(DOS)      AS cuma_id,
             RTRIM(NOMABR)   AS code,
             RTRIM(NOM)      AS nom,
             NULL            AS prenom,
             RTRIM(REGL)     AS mode_reglement,
             RTRIM(DEMATCOD) AS dematerialisation
      FROM   [dbo].[CLI]
      WHERE  RTRIM(DOS) = @dos
    `)
  return r.recordset
}

// ---------------------------------------------------------------------------
// FACTURES — table ENT, filtrées par DOS (lazy via /api/factures?cuma_id=X)
// ---------------------------------------------------------------------------
async function getFacturesByCuma(pool, cumaId) {
  const r = await pool.request()
    .input('dos', sql.VarChar(10), String(cumaId).trim())
    .query(`
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
      WHERE  RTRIM(DOS) = @dos
    `)
  return r.recordset
}

// ---------------------------------------------------------------------------
// CONTACTS + ADRESSES — par adhérent (lazy via /api/adherent/:tiers/detail)
// T2 stocke TEL, TELGSM, EMAIL sur une ligne → dépliés en {type, valeur}.
// ---------------------------------------------------------------------------
function expandContacts(recordset) {
  const rows = []
  for (const row of recordset) {
    if (row.tel)   rows.push({ id: `${row.rid}_tel`,   cuma_id: row.cuma_id, adherent_id: row.adherent_id, type: 'tel',    valeur: row.tel })
    if (row.gsm)   rows.push({ id: `${row.rid}_gsm`,   cuma_id: row.cuma_id, adherent_id: row.adherent_id, type: 'telgsm', valeur: row.gsm })
    if (row.email) rows.push({ id: `${row.rid}_email`, cuma_id: row.cuma_id, adherent_id: row.adherent_id, type: 'email',  valeur: row.email })
  }
  return rows
}

async function getDetailByAdherent(pool, tiersId) {
  const tiers = String(tiersId).trim()

  const rc = await pool.request()
    .input('tiers', sql.VarChar(20), tiers)
    .query(`
      SELECT T2_ID                   AS rid,
             RTRIM(DOS)              AS cuma_id,
             RTRIM(TIERS)            AS adherent_id,
             NULLIF(RTRIM(TEL),  '') AS tel,
             NULLIF(RTRIM(TELGSM),'') AS gsm,
             NULLIF(RTRIM(EMAIL),'') AS email
      FROM   [dbo].[T2]
      WHERE  RTRIM(TIERS) = @tiers
    `)

  const ra = await pool.request()
    .input('tiers', sql.VarChar(20), tiers)
    .query(`
      SELECT T1_ID                  AS id,
             RTRIM(TIERS)           AS adherent_id,
             NULL                   AS libelle,
             NULLIF(RTRIM(RUE),'')  AS ligne1,
             RTRIM(CPOSTAL)         AS cp,
             RTRIM(VIL)             AS ville,
             RTRIM(DOS)             AS cuma_id
      FROM   [dbo].[T1]
      WHERE  RTRIM(TIERS) = @tiers
    `)

  return {
    contacts: expandContacts(rc.recordset),
    adresses: ra.recordset,
  }
}

// ---------------------------------------------------------------------------
// REGLEMENTS / RIB / NEWS — lecture depuis Excel
// ---------------------------------------------------------------------------
async function getReglements() { return readSheets('reglements').reglements }
async function getRib()        { return readSheets('rib').rib }
async function getNews()       { return readSheets('news').news }

// ---------------------------------------------------------------------------
// Point d'entrée initial — login (uniquement les petites tables)
// ---------------------------------------------------------------------------
async function getTables(pool) {
  // Séquentiel obligatoire (msnodesqlv8 crashe en parallèle)
  const users     = await getUsers(pool)
  const cuma      = await getCuma(pool)
  const user_cuma = await getUserCuma(pool)
  const reglements = await getReglements()
  const rib       = await getRib()
  const news      = await getNews()
  return {
    users, cuma, user_cuma,
    adherents: [], factures: [], contacts: [], adresses: [],
    reglements, rib, news,
  }
}

module.exports = { getTables, getAdherentsByCuma, getFacturesByCuma, getDetailByAdherent }
