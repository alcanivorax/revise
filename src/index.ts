#!/usr/bin/env node

import pkg from '../package.json' with { type: 'json' }
import { handleCliOptions } from './cli/options.js'

export async function run() {
  handleCliOptions()
  return `${pkg.name} is running...`
}

console.log(await run())
