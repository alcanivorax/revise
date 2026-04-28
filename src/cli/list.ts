import { daysBetween, isDue, todayISO } from '../core/dates.js'
import { loadStore } from '../core/storage.js'
import { style } from '../core/style.js'
import {
  boxBottom as renderBoxBottom,
  boxDivider as renderBoxDivider,
  boxLine as renderBoxLine,
  boxTop as renderBoxTop,
  wrapText,
} from './layout.js'

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

function boxLine(content = ''): string {
  return renderBoxLine(content, INNER_WIDTH)
}

function boxTop(): string {
  return renderBoxTop(INNER_WIDTH)
}

function boxBottom(): string {
  return renderBoxBottom(INNER_WIDTH)
}

function boxDivider(): string {
  return renderBoxDivider(INNER_WIDTH)
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
  console.log(boxDivider())
  console.log(boxLine())

  if (invalid.length) {
    console.log(
      boxLine(
        '  ' +
          style.overdue(`invalid filter: ${invalid.join(', ')}`) +
          style.dim(
            ' · use --all|--active|--completed|--due|--overdue|--upcoming'
          )
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
      boxLine(
        '  ' + style.muted('no topics yet') + style.dim(' · run revise add')
      )
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
