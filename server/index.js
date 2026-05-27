const express = require('express')
const cors = require('cors')
const { getPool, closePool } = require('./db')
const { getTables } = require('./queries')

require('dotenv').config()

const app = express()
const PORT = process.env.API_PORT || 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }))
app.use(express.json())

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await getPool()
    res.json({ ok: true, db: 'connected' })
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message })
  }
})

// ── Toutes les tables en un seul appel (même structure que l'Excel parsé) ───
app.get('/api/tables', async (_req, res) => {
  try {
    const pool = await getPool()
    const tables = await getTables(pool)
    res.json(tables)
  } catch (err) {
    console.error('[API] /api/tables error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── Démarrage ────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`[API] Serveur démarré sur http://localhost:${PORT}`)
})

process.on('SIGTERM', () => { closePool(); server.close() })
process.on('SIGINT',  () => { closePool(); server.close() })
