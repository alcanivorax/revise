import fs from 'fs'
import os from 'os'
import path from 'path'
import { Store } from '../type.js'

const __dirname = path.join(os.homedir(), '.revise')
const __filename = path.join(__dirname, 'data.json')

export function loadStore(): Store {
  if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname)
  }

  if (!fs.existsSync(__filename)) {
    fs.writeFileSync(__filename, JSON.stringify({ topics: [] }, null, 2))
  }

  return JSON.parse(fs.readFileSync(__filename, 'utf-8'))
}

export function saveStore(store: Store) {
  fs.writeFileSync(__filename, JSON.stringify(store, null, 2))
}
