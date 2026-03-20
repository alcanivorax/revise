import { args, index } from './args.js'
import pkg from '../../package.json' with { type: 'json' }
import { addCommand } from './add.js'
import { doneCommand } from './done.js'
import { todayCommand } from './today.js'
import { style } from '../core/style.js'

function printHelp(): void {
  console.log()
  console.log(
    style.header('revise') +
      style.dim(' · ') +
      style.muted('spaced repetition for what you learn')
  )
  console.log(style.dim('─'.repeat(40)))
  console.log()
  console.log(style.dim('usage:'))
  console.log(
    style.title('  revise') +
      style.muted('              ') +
      style.dim('show due revisions')
  )
  console.log(
    style.title('  revise add') +
      style.muted('           ') +
      style.dim('add new topic')
  )
  console.log(
    style.title('  revise done <n>') +
      style.muted('      ') +
      style.dim('mark revision n done')
  )
  console.log()
  console.log(style.dim('options:'))
  console.log(
    style.title('  -h, --help') +
      style.muted('            ') +
      style.dim('show this help')
  )
  console.log(
    style.title('  -v, --version') +
      style.muted('         ') +
      style.dim('show version')
  )
  console.log()
}

function printVersion(): void {
  console.log()
  console.log(style.muted(`v${pkg.version}`))
  console.log()
}

function printInvalidOptions(option: string): void {
  console.log()
  console.log(style.overdue(`unknown command: ${option}`))
  console.log(
    style.dim('run ') + style.title('revise --help') + style.dim(' for usage')
  )
  console.log()
}

export async function handleCliOptions(): Promise<void> {
  if (args.length === 0) {
    todayCommand()
    process.exit(0)
  }

  if (args.includes('add')) {
    await addCommand()
    process.exit(0)
  }

  if (args.includes('done')) {
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
