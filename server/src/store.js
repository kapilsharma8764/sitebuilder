import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'

/**
 * Where the server keeps its data.
 *
 * A JSON file per collection, written atomically. That is deliberately modest:
 * this runs on one machine for one business at a time, and a database would be
 * another thing to install and keep running for no benefit at this size.
 *
 * Everything goes through this module, so moving to Postgres or Mongo later
 * means rewriting this file and nothing else.
 */

const DATA_DIR = process.env.SITEBUILDER_DATA ?? join(process.cwd(), 'data')

/** Serialises writes per file so two requests cannot clobber each other. */
const writeQueues = new Map()

function pathFor(collection) {
  return join(DATA_DIR, `${collection}.json`)
}

async function readAll(collection) {
  try {
    const text = await readFile(pathFor(collection), 'utf8')
    const parsed = JSON.parse(text)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    if (error.code === 'ENOENT') return []
    // A corrupted file should not take the server down; report and start clean
    // rather than crashing on every request from then on.
    if (error instanceof SyntaxError) {
      console.error(`[store] ${collection}.json is not valid JSON — starting empty`)
      return []
    }
    throw error
  }
}

async function writeAll(collection, rows) {
  const previous = writeQueues.get(collection) ?? Promise.resolve()
  const next = previous.then(async () => {
    const file = pathFor(collection)
    await mkdir(dirname(file), { recursive: true })
    // Write beside the target and rename, so a crash mid-write cannot leave a
    // half-written file where the data used to be.
    const temp = `${file}.${randomUUID()}.tmp`
    await writeFile(temp, JSON.stringify(rows, null, 2), 'utf8')
    await rename(temp, file)
  })
  writeQueues.set(
    collection,
    next.catch(() => {}),
  )
  return next
}

export async function list(collection, filter = {}) {
  const rows = await readAll(collection)
  const entries = Object.entries(filter)
  if (entries.length === 0) return rows
  return rows.filter((row) => entries.every(([key, value]) => row[key] === value))
}

export async function find(collection, predicate) {
  const rows = await readAll(collection)
  return rows.find(predicate)
}

export async function get(collection, id) {
  return find(collection, (row) => row.id === id)
}

export async function insert(collection, record) {
  const rows = await readAll(collection)
  const now = new Date().toISOString()
  const row = { id: randomUUID(), createdAt: now, updatedAt: now, ...record }
  rows.push(row)
  await writeAll(collection, rows)
  return row
}

export async function update(collection, id, changes) {
  const rows = await readAll(collection)
  const index = rows.findIndex((row) => row.id === id)
  if (index === -1) return null
  const row = { ...rows[index], ...changes, id, updatedAt: new Date().toISOString() }
  rows[index] = row
  await writeAll(collection, rows)
  return row
}

export async function remove(collection, id) {
  const rows = await readAll(collection)
  const remaining = rows.filter((row) => row.id !== id)
  if (remaining.length === rows.length) return false
  await writeAll(collection, remaining)
  return true
}

export { DATA_DIR }
