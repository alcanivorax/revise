import chalk from 'chalk'

const dim = chalk.gray
const muted = chalk.gray

const brand = {
  primary: chalk.hex('#06b6d4'),
  secondary: chalk.hex('#8b5cf6'),
}

export const box = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  lightTopLeft: '┌',
  lightTopRight: '┐',
  lightBottomLeft: '└',
  lightBottomRight: '┘',
  lightHorizontal: '─',
  lightVertical: '│',
  heavyTopLeft: '┏',
  heavyTopRight: '┓',
  heavyBottomLeft: '┗',
  heavyBottomRight: '┛',
  heavyHorizontal: '━',
  heavyVertical: '┃',
  doubleTopLeft: '╔',
  doubleTopRight: '╗',
  doubleBottomLeft: '╚',
  doubleBottomRight: '╝',
  doubleHorizontal: '═',
  doubleVertical: '║',
}

function gradientText(text: string): string {
  return brand.primary(text)
}

function heading(text: string): string {
  return brand.primary.bold(text)
}

export const style = {
  border: dim,
  header: heading,
  title: chalk.white.bold,
  topic: chalk.white,
  index: brand.primary,
  dueToday: chalk.hex('#f59e0b'),
  overdue: chalk.hex('#ef4444'),
  success: chalk.hex('#10b981'),
  muted: muted,
  accent: brand.primary,
  dim: dim,
  gradient: gradientText,
  info: chalk.hex('#3b82f6'),
  icon: {
    check: chalk.green('✓'),
    cross: chalk.red('✗'),
    bullet: brand.primary('•'),
    arrow: brand.primary('›'),
    star: chalk.yellow('★'),
    calendar: brand.secondary('◷'),
    clock: brand.primary('◰'),
    sparkles: '✨',
    rocket: '🚀',
    trophy: '🏆',
  },
  effects: {
    fade: (text: string) => chalk.gray(text),
    bold: (text: string) => chalk.bold(text),
    italic: (text: string) => chalk.italic(text),
    underline: (text: string) => chalk.underline(text),
  },
}

export function createBox(
  content: string[],
  options: {
    title?: string
    width?: number
    padding?: number
    borderStyle?: 'light' | 'heavy' | 'double'
  } = {}
): string {
  const { title, width = 50, padding = 1, borderStyle = 'light' } = options

  const borderChar =
    borderStyle === 'heavy'
      ? box.heavyHorizontal
      : borderStyle === 'double'
        ? box.doubleHorizontal
        : box.lightHorizontal

  const verticalChar =
    borderStyle === 'heavy'
      ? box.heavyVertical
      : borderStyle === 'double'
        ? box.doubleVertical
        : box.lightVertical

  const topLeft =
    borderStyle === 'heavy'
      ? box.heavyTopLeft
      : borderStyle === 'double'
        ? box.doubleTopLeft
        : box.lightTopLeft

  const topRight =
    borderStyle === 'heavy'
      ? box.heavyTopRight
      : borderStyle === 'double'
        ? box.doubleTopRight
        : box.lightTopRight

  const bottomLeft =
    borderStyle === 'heavy'
      ? box.heavyBottomLeft
      : borderStyle === 'double'
        ? box.doubleBottomLeft
        : box.lightBottomLeft

  const bottomRight =
    borderStyle === 'heavy'
      ? box.heavyBottomRight
      : borderStyle === 'double'
        ? box.doubleBottomRight
        : box.lightBottomRight

  const maxContentWidth = Math.max(
    ...content.map((line) => line.replace(/\x1b\[[0-9;]*m/g, '').length),
    title ? title.length + 2 : 0
  )

  const boxWidth = Math.min(
    Math.max(maxContentWidth + padding * 2, title ? title.length + 4 : 0),
    width
  )

  const horizontalLine = borderChar.repeat(boxWidth)
  const paddedContent = content.map(
    (line) =>
      verticalChar +
      ' '.repeat(padding) +
      line +
      ' '.repeat(
        boxWidth - padding - (line.replace(/\x1b\[[0-9;]*m/g, '').length + 1)
      )
  )

  const lines: string[] = []

  if (title) {
    const paddedTitle = ` ${title} `
    const titleWidth = paddedTitle.length

    lines.push(
      topLeft +
        horizontalLine.slice(0, Math.floor((boxWidth - titleWidth) / 2)) +
        paddedTitle +
        horizontalLine.slice(0, Math.ceil((boxWidth - titleWidth) / 2)) +
        topRight
    )
  } else {
    lines.push(topLeft + horizontalLine + topRight)
  }

  lines.push(...paddedContent)
  lines.push(bottomLeft + horizontalLine + bottomRight)

  return lines.join('\n')
}
