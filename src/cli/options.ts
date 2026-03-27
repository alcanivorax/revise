import { args, index } from './args.js'
import pkg from '../../package.json' with { type: 'json' }
import { addCommand } from './add.js'
import { doneCommand } from './done.js'
import { listCommand } from './list.js'
import { todayCommand } from './today.js'
import { style, box } from '../core/style.js'

function printHelp(): void {
  const lines = [
    style.title('  revise') +
      style.muted('             ') +
      style.dim('show due revisions'),
    style.title('  revise list') +
      style.muted('         ') +
      style.dim('show all topics'),
    style.title('  revise list --upcoming') +
      style.muted(' ') +
      style.dim('filter topics'),
    style.title('  revise add') +
      style.muted('          ') +
      style.dim('add new topic'),
    style.title('  revise done <n>') +
      style.muted('       ') +
      style.dim('mark revision n done'),
  ]

  const optionLines = [
    style.title('  -h, --help') +
      style.muted('         ') +
      style.dim('show this help'),
    style.title('  -v, --version') +
      style.muted('      ') +
      style.dim('show version'),
  ]

  const helpContent = [
    style.header('revise') +
      style.dim(' · ') +
      style.muted('spaced repetition for what you learn'),
    '',
    style.effects.bold(style.muted('usage:')),
    ...lines,
    '',
    style.effects.bold(style.muted('options:')),
    ...optionLines,
    '',
    style.effects.italic(
      style.dim('tip: use revision numbers with done to track progress')
    ),
  ]

  const border = box.doubleHorizontal
  const width = 56

  console.log()
  console.log(
    style.dim(box.doubleTopLeft) +
      border.repeat(width) +
      style.dim(box.doubleTopRight)
  )
  for (const line of helpContent) {
    const padding = width - line.replace(/\x1b\[[0-9;]*m/g, '').length
    console.log(
      style.dim(box.doubleVertical) +
        ' ' +
        line +
        (padding > 1 ? ' '.repeat(padding - 1) : '') +
        style.dim(box.doubleVertical)
    )
  }
  console.log(
    style.dim(box.doubleBottomLeft) +
      border.repeat(width) +
      style.dim(box.doubleBottomRight)
  )
  console.log()
}

function printVersion(): void {
  console.log()
  console.log(style.title(`v${pkg.version}`))
  console.log(style.dim('spaced repetition CLI'))
  console.log()
}

function printInvalidOptions(option: string): void {
  console.log()
  console.log(
    style.icon.cross + ' ' + style.overdue(`unknown command: ${option}`)
  )
  console.log()
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

  if (args.includes('list')) {
    const listIndex = args.indexOf('list')
    listCommand(args.slice(listIndex + 1))
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
