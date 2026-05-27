const express = require('express')
const cors = require('cors')
const { getPool, closePool } = require('./db')
const { getTables, getAdherentsByCuma, getFacturesByCuma, getDetailByAdherent } = require('./queries')

require('dotenv').config()

const app = express()
const PORT = process.env.API_PORT || 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }))
app.use(express.json())

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await getPool()
    res.json({ ok: true, db: 'connected' })
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message })
  }
})

// ── Données de base — login (users, cuma, user_cuma + Excel) ─────────────────
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

// ── Adhérents d'une CUMA ──────────────────────────────────────────────────────
app.get('/api/adherents', async (req, res) => {
  const cumaId = req.query.cuma_id
  if (!cumaId) return res.status(400).json({ error: 'cuma_id manquant' })
  try {
    const pool = await getPool()
    const adherents = await getAdherentsByCuma(pool, cumaId)
    res.json(adherents)
  } catch (err) {
    console.error('[API] /api/adherents error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── Factures d'une CUMA ───────────────────────────────────────────────────────
app.get('/api/factures', async (req, res) => {
  const cumaId = req.query.cuma_id
  if (!cumaId) return res.status(400).json({ error: 'cuma_id manquant' })
  try {
    const pool = await getPool()
    const factures = await getFacturesByCuma(pool, cumaId)
    res.json(factures)
  } catch (err) {
    console.error('[API] /api/factures error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── Contacts + adresses d'un adhérent ────────────────────────────────────────
app.get('/api/adherent/:tiers/detail', async (req, res) => {
  const { tiers } = req.params
  try {
    const pool = await getPool()
    const detail = await getDetailByAdherent(pool, tiers)
    res.json(detail)
  } catch (err) {
    console.error('[API] /api/adherent/:tiers/detail error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── Démarrage ─────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`[API] Serveur démarré sur http://localhost:${PORT}`)
})

process.on('SIGTERM', () => { closePool(); server.close() })
process.on('SIGINT',  () => { closePool(); server.close() })
