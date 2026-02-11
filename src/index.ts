#!/usr/bin/env node

import { handleCliOptions } from './cli/options.js'

export async function run() {
  await handleCliOptions()
}

await run()
