import { args, index } from './args.js'
import pkg from '../../package.json' with { type: 'json' }
import { addCommand } from './add.js'
import { doneCommand } from './done.js'
import { editCommand } from './edit.js'
import { listCommand } from './list.js'
import { postponeCommand } from './postpone.js'
import { removeCommand } from './remove.js'
import { resetCommand } from './reset.js'
import { statsCommand } from './stats.js'
import { todayCommand } from './today.js'
import { undoCommand } from './undo.js'
import { style } from '../core/style.js'
import { boxBottom, boxLine, boxTop } from './layout.js'

const HELP_WIDTH = 58
const HELP_COMMAND_WIDTH = 30

function helpRow(command: string, description: string): string {
  const gap = ' '.repeat(Math.max(1, HELP_COMMAND_WIDTH - command.length))
  return style.title(`  ${command}`) + style.muted(gap) + style.dim(description)
}

function printHelp(): void {
  const lines = [
    helpRow('revise', 'show due revisions'),
    helpRow('revise list', 'show all topics'),
    helpRow('revise list --upcoming', 'filter topics'),
    helpRow('revise add', 'add new topic'),
    helpRow('revise done <n>', 'mark revision n done'),
    helpRow('revise undo', 'undo last done action'),
    helpRow('revise postpone <n> [days]', 'postpone due revision'),
    helpRow('revise edit <n>', 'rename a topic'),
    helpRow('revise remove <n>', 'delete a topic'),
    helpRow('revise reset <n>', 'restart a topic schedule'),
    helpRow('revise stats', 'show progress summary'),
  ]

  const optionLines = [
    helpRow('-h, --help', 'show this help'),
    helpRow('-v, --version', 'show version'),
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

  console.log()
  console.log(boxTop(HELP_WIDTH))
  for (const line of helpContent) {
    console.log(boxLine(' ' + line, HELP_WIDTH))
  }
  console.log(boxBottom(HELP_WIDTH))
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

  if (args.includes('undo')) {
    undoCommand()
    process.exit(0)
  }

  if (args.includes('postpone')) {
    postponeCommand(index, Number(args[2]))
    process.exit(0)
  }

  if (args.includes('edit')) {
    await editCommand(index)
    process.exit(0)
  }

  if (args.includes('remove')) {
    await removeCommand(index)
    process.exit(0)
  }

  if (args.includes('reset')) {
    await resetCommand(index)
    process.exit(0)
  }

  if (args.includes('stats')) {
    statsCommand()
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
