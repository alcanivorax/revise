import { args } from './args.js'
import pkg from '../../package.json' with { type: 'json' }

function printHelp(): void {
  console.log(`
${pkg.name} - a cli tool

Usage:
  ${pkg.name} [options]

Options:
  -h, --help              Show help
  -v, --version           Show version
`)
}

function printVersion(): void {
  console.log(`
${pkg.name} version ${pkg.version}
`)
}
function printInvalidOptions(option: string): void {
  console.error(`
unknown option: ${option}
usage: ${pkg.name} [-v | --version] [-h | --help]
`)
}

export function handleCliOptions(): void {
  if (args.length === 0) return

  if (args.includes('-h') || args.includes('--help') || args.includes('help')) {
    printHelp()
    process.exit(0)
  }

  if (
    args.includes('-v') ||
    args.includes('--version') ||
    args.includes('version')
  ) {
    printVersion()
    process.exit(0)
  }

  printInvalidOptions(args[0])
  process.exit(2)
}
