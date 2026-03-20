import chalk from 'chalk'

export const box = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
}

export const style = {
  border: chalk.gray,
  header: chalk.cyan.bold,
  title: chalk.white.bold,
  topic: chalk.white,
  index: chalk.cyan,
  dueToday: chalk.yellow,
  overdue: chalk.red,
  success: chalk.green,
  muted: chalk.gray,
  accent: chalk.cyan,
  dim: chalk.dim,
}
