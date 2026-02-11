import { args, index } from './args.js'
import pkg from '../../package.json' with { type: 'json' }
import { addCommand } from './add.js'
import { doneCommand } from './done.js'
import { todayCommand } from './today.js'

function printHelp(): void {
  console.log(`
revise - A CLI to Track what you learned and revise it on fixed spaced-repetition days

Usage:
  revise [options]

Options:
  -h, --help              Show help
  -v, --version           Show version
`)
}

function printVersion(): void {
  console.log(`
revise version ${pkg.version}
`)
}

function printInvalidOptions(option: string): void {
  console.error(`
unknown option: ${option}
usage: revise [-v | --version] [-h | --help]
`)
}

export async function handleCliOptions(): Promise<void> {
  if (args.length === 0) {
    todayCommand()
    process.exit(0)
  }

  if (args.includes('add') || args.includes('-add') || args.includes('--add')) {
    await addCommand()
    process.exit(0)
  }

  if (
    args.includes('done') ||
    args.includes('-done') ||
    args.includes('--done')
  ) {
    doneCommand(index)
    process.exit(0)
  }

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
