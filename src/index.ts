#!/usr/bin/env node

import pkg from '../package.json' with { type: 'json' }
import { addCommand } from './cli/add.js'
import { handleCliOptions } from './cli/options.js'

export async function run() {
  handleCliOptions()
  await addCommand()
}

console.log(await run())
