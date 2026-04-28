import chalk from 'chalk'

const palette = {
  ink: '#e7e5df',
  muted: '#9ca3a3',
  dim: '#6f7775',
  border: '#3b4442',
  line: '#6d7f78',
  sage: '#9bb89f',
  moss: '#7f9f86',
  clay: '#c89f7a',
  amber: '#d4b26a',
  rose: '#c98787',
  blue: '#8fa7b3',
  lavender: '#a79abf',
  surface: '#1f2423',
}

const dim = chalk.hex(palette.dim)
const muted = chalk.hex(palette.muted)

const brand = {
  primary: chalk.hex(palette.sage),
  secondary: chalk.hex(palette.lavender),
  border: chalk.hex(palette.border),
  line: chalk.hex(palette.line),
  surface: chalk.hex(palette.surface),
}

export const box = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
  leftT: '├',
  rightT: '┤',
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

// ✅ ANSI-safe length
function visibleLength(str: string): number {
  return str.replace(/\x1b\[[0-9;]*m/g, '').length
}

function gradientText(text: string): string {
  return brand.primary(text)
}

function heading(text: string): string {
  return brand.primary.bold(text)
}

export const style = {
  border: brand.border,
  header: heading,
  title: chalk.hex(palette.ink).bold,
  topic: chalk.hex(palette.ink),
  index: brand.primary,
  dueToday: chalk.hex(palette.amber).bold,
  overdue: chalk.hex(palette.rose).bold,
  success: chalk.hex(palette.moss).bold,
  muted: muted,
  accent: brand.line,
  dim: dim,
  gradient: gradientText,
  info: chalk.hex(palette.blue).bold,
  label: (text: string) => brand.secondary.bold(text.toUpperCase()),
  pill: (text: string) =>
    chalk.hex(palette.ink).bgHex(palette.surface)(` ${text} `),
  icon: {
    check: chalk.hex(palette.moss)('✓'),
    cross: chalk.hex(palette.rose)('✗'),
    bullet: brand.primary('•'),
    arrow: chalk.hex(palette.clay)('›'),
    star: chalk.hex(palette.amber)('★'),
    calendar: brand.secondary('◷'),
    clock: chalk.hex(palette.blue)('◰'),
    sparkles: brand.secondary('✦'),
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

  // ✅ Correct width calculation
  const maxContentWidth = Math.max(
    ...content.map((line) => visibleLength(line)),
    title ? visibleLength(title) + 2 : 0
  )

  const boxWidth = Math.min(
    Math.max(
      maxContentWidth + padding * 2,
      title ? visibleLength(title) + 4 : 0
    ),
    width
  )

  const horizontalLine = borderChar.repeat(boxWidth)
  const lines: string[] = []

  // ✅ Title (proper centering)
  if (title) {
    const paddedTitle = ` ${title} `
    const titleWidth = visibleLength(paddedTitle)

    const left = Math.floor((boxWidth - titleWidth) / 2)
    const right = boxWidth - titleWidth - left

    lines.push(
      topLeft +
        borderChar.repeat(left) +
        paddedTitle +
        borderChar.repeat(right) +
        topRight
    )
  } else {
    lines.push(topLeft + horizontalLine + topRight)
  }

  // ✅ Proper content alignment
  const paddedContent = content.map((line) => {
    const visible = visibleLength(line)
    const spaceRight = boxWidth - visible - padding * 2

    return (
      verticalChar +
      ' '.repeat(padding) +
      line +
      ' '.repeat(spaceRight) +
      ' '.repeat(padding) +
      verticalChar
    )
  })

  lines.push(...paddedContent)
  lines.push(bottomLeft + horizontalLine + bottomRight)

  return lines.join('\n')
}
