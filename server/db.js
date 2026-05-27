/**
 * Connexion SQL Server via ODBC + Windows Authentication (Trusted_Connection).
 *
 * Prérequis : ODBC Driver for SQL Server installé sur la machine.
 * Versions testées (par ordre de préférence) :
 *   - ODBC Driver 18 for SQL Server
 *   - ODBC Driver 17 for SQL Server
 *   - SQL Server Native Client 11.0
 *
 * Pour forcer une version spécifique, renseigner SQL_ODBC_DRIVER dans le .env :
 *   SQL_ODBC_DRIVER=ODBC Driver 18 for SQL Server
 */

const sql = require('mssql/msnodesqlv8')
require('dotenv').config()

const SERVER   = process.env.SQL_SERVER   || 'localhost'
const DATABASE = process.env.SQL_DATABASE || 'ERP223B'
const DRIVER   = process.env.SQL_ODBC_DRIVER || 'ODBC Driver 17 for SQL Server'

const connectionString =
  `Driver={${DRIVER}};Server=${SERVER};Database=${DATABASE};Trusted_Connection=yes;`

let pool = null

async function getPool() {
  if (pool) return pool
  try {
    pool = await sql.connect({ connectionString })
    console.log(`[DB] Connecté à ${SERVER}/${DATABASE} (${DRIVER})`)
    return pool
  } catch (err) {
    pool = null
    // Message d'aide si le driver ODBC est introuvable
    if (err.message && err.message.includes('IM002')) {
      throw new Error(
        `Driver ODBC introuvable : "${DRIVER}".\n` +
        `Installez "ODBC Driver 17 for SQL Server" depuis Microsoft,\n` +
        `ou précisez SQL_ODBC_DRIVER dans le fichier .env.`
      )
    }
    throw err
  }
}

function closePool() {
  if (pool) {
    pool.close()
    pool = null
  }
}

module.exports = { getPool, closePool, sql }
