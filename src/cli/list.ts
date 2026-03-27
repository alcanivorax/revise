import { daysBetween, isDue, todayISO } from '../core/dates.js'
import { loadStore } from '../core/storage.js'
import { style, box } from '../core/style.js'

const INNER_WIDTH = 64
const VALID_FILTERS = new Set([
  '--all',
  '--active',
  '--completed',
  '--due',
  '--overdue',
  '--upcoming',
])

type TopicStatus = 'completed' | 'due' | 'overdue' | 'upcoming'

function visibleLength(str: string): number {
  const plain = str.replace(/\x1b\[[0-9;]*m/g, '')
  let width = 0

  for (const char of plain) {
    if (/[\p{Mark}\u200d\ufe00-\ufe0f]/u.test(char)) continue
    if (
      /\p{Extended_Pictographic}/u.test(char) ||
      /[\u1100-\u115f\u2e80-\u303e\u3040-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe6f\uff00-\uff60\uffe0-\uffe6]/u.test(
        char
      )
    ) {
      width += 2
      continue
    }
    width += 1
  }

  return width
}

function boxLine(content = ''): string {
  const visible = visibleLength(content)
  const padded =
    visible >= INNER_WIDTH ? content : content + ' '.repeat(INNER_WIDTH - visible)
  return style.dim(box.lightVertical) + padded + style.dim(box.lightVertical)
}

function boxTop(): string {
  return (
    style.dim(box.lightTopLeft) +
    box.lightHorizontal.repeat(INNER_WIDTH) +
    style.dim(box.lightTopRight)
  )
}

function boxBottom(): string {
  return (
    style.dim(box.lightBottomLeft) +
    box.lightHorizontal.repeat(INNER_WIDTH) +
    style.dim(box.lightBottomRight)
  )
}

function wrapText(text: string, width: number): string[] {
  if (width <= 0) return ['']
  if (!text.trim()) return ['']

  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    if (!current.length) {
      if (word.length <= width) {
        current = word
      } else {
        for (let i = 0; i < word.length; i += width) {
          lines.push(word.slice(i, i + width))
        }
      }
      continue
    }

    if (current.length + 1 + word.length <= width) {
      current += ` ${word}`
      continue
    }

    lines.push(current)
    if (word.length <= width) {
      current = word
    } else {
      current = ''
      for (let i = 0; i < word.length; i += width) {
        const chunk = word.slice(i, i + width)
        if (chunk.length === width) lines.push(chunk)
        else current = chunk
      }
    }
  }

  if (current.length) lines.push(current)
  return lines.length ? lines : ['']
}

export function listCommand(flags: string[] = []): void {
  const store = loadStore()
  const today = todayISO()
  const requested = flags.filter((f) => f.startsWith('--'))
  const invalid = requested.filter((f) => !VALID_FILTERS.has(f))

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' + style.header('All Topics') + style.dim(' · ') + style.muted(today)
    )
  )
  console.log(boxBottom())
  console.log(boxLine())

  if (invalid.length) {
    console.log(
      boxLine(
        '  ' +
          style.overdue(`invalid filter: ${invalid.join(', ')}`) +
          style.dim(' · use --all|--active|--completed|--due|--overdue|--upcoming')
      )
    )
    console.log(boxLine())
    console.log(boxBottom())
    console.log()
    return
  }

  const filters = requested.length ? new Set(requested) : new Set(['--all'])
  if (store.topics.length === 0) {
    console.log(
      boxLine('  ' + style.muted('no topics yet') + style.dim(' · run revise add'))
    )
    console.log(boxLine())
    console.log(boxBottom())
    console.log()
    return
  }

  const active = store.topics.filter((t) => !t.completed).length
  const completed = store.topics.length - active
  const titleWidth = INNER_WIDTH - 6
  const rows = store.topics.map((topic, i) => {
    const next = topic.schedule.find((r) => !r.done)
    let status: TopicStatus = 'upcoming'

    if (topic.completed || !next) status = 'completed'
    else if (next.date === today) status = 'due'
    else if (isDue(next.date, today)) status = 'overdue'

    return { topic, i, next, status }
  })

  const filtered = rows.filter((row) => {
    if (filters.has('--all')) return true
    if (filters.has('--active') && row.status !== 'completed') return true
    if (filters.has('--completed') && row.status === 'completed') return true
    if (filters.has('--due') && row.status === 'due') return true
    if (filters.has('--overdue') && row.status === 'overdue') return true
    if (filters.has('--upcoming') && row.status === 'upcoming') return true
    return false
  })

  if (filtered.length === 0) {
    console.log(
      boxLine(
        '  ' +
          style.muted('no topics match filter') +
          style.dim(` · selected: ${Array.from(filters).join(', ')}`)
      )
    )
    console.log(boxLine())
    console.log(boxBottom())
    console.log()
    return
  }

  filtered.forEach(({ topic, i, next, status }, rowIndex) => {
    const firstPrefix = `  ${style.index(`${i + 1}.`)} `
    const continuationPrefix = ' '.repeat(5)
    const titleLines = wrapText(topic.title, titleWidth)

    titleLines.forEach((line, lineIndex) => {
      const prefix = lineIndex === 0 ? firstPrefix : continuationPrefix
      console.log(boxLine(prefix + style.title(line)))
    })

    if (status === 'completed' || !next) {
      console.log(boxLine('     ' + style.success('status: completed')))
    } else if (status === 'due') {
      console.log(
        boxLine(
          '     ' +
            style.dim(`next: day ${next.day} on ${next.date} · `) +
            style.dueToday('due today')
        )
      )
    } else if (status === 'overdue') {
      const overdueBy = daysBetween(next.date, today)
      console.log(
        boxLine(
          '     ' +
            style.dim(`next: day ${next.day} on ${next.date} · `) +
            style.overdue(`${overdueBy}d overdue`)
        )
      )
    } else {
      const inDays = daysBetween(today, next.date)
      console.log(
        boxLine(
          '     ' +
            style.dim(`next: day ${next.day} on ${next.date} · `) +
            style.info(`in ${inDays}d`)
        )
      )
    }

    if (rowIndex < filtered.length - 1) {
      console.log(boxLine())
    }
  })

  console.log(boxLine())
  console.log(
    boxLine(
      '  ' +
        style.muted('total: ') +
        style.title(`${store.topics.length}`) +
        style.dim(' · active: ') +
        style.title(`${active}`) +
        style.dim(' · completed: ') +
        style.title(`${completed}`)
    )
  )
  console.log(boxBottom())
  console.log()
}
