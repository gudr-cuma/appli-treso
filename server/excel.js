const XLSX = require('xlsx')
const path  = require('path')

const EXCEL_PATH = path.join(__dirname, '..', 'public', 'db-sql.xlsx')

function readSheets(...names) {
  const wb = XLSX.readFile(EXCEL_PATH)
  const out = {}
  for (const name of names) {
    const ws = wb.Sheets[name]
    out[name] = ws ? XLSX.utils.sheet_to_json(ws, { defval: null }) : []
  }
  return out
}

module.exports = { readSheets }
