import { addDaysISO, isDue, todayISO } from '../core/dates.js'
import { loadStore, saveStore } from '../core/storage.js'
import { style } from '../core/style.js'
import {
  boxBottom,
  boxLine,
  boxTop,
  visibleLength,
  wrapText,
} from './layout.js'

const INNER_WIDTH = 50

export function postponeCommand(index: number, days = 1): void {
  const store = loadStore()
  const today = todayISO()
  const delay = Number.isFinite(days) && days > 0 ? Math.floor(days) : 1
  const due = []

  for (const topic of store.topics) {
    if (topic.completed) continue

    const next = topic.schedule.find((revision) => !revision.done)
    if (next && isDue(next.date, today)) {
      due.push({ topic, revision: next })
    }
  }

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.clock +
        ' ' +
        style.header('Postpone') +
        style.dim(' · ') +
        style.muted(today)
    )
  )
  console.log(boxBottom())
  console.log()

  if (!due.length) {
    console.log(boxTop())
    console.log(boxLine('    ' + style.muted('no revisions due today')))
    console.log(boxBottom())
    console.log()
    return
  }

  if (index < 1 || index > due.length) {
    console.log(boxTop())
    console.log(
      boxLine('    ' + style.overdue(`invalid index (choose 1-${due.length})`))
    )
    console.log(boxBottom())
    console.log()
    return
  }

  const selected = due[index - 1]
  selected.revision.date = addDaysISO(today, delay)
  saveStore(store)

  const prefix = '    ' + style.success(style.icon.check) + ' '
  const continuationPrefix = ' '.repeat(6)
  const titleWidth = INNER_WIDTH - visibleLength(continuationPrefix)

  console.log(boxTop())
  for (const [lineIndex, line] of wrapText(
    selected.topic.title,
    titleWidth
  ).entries()) {
    console.log(
      boxLine(
        (lineIndex === 0 ? prefix : continuationPrefix) + style.title(line)
      )
    )
  }
  console.log(
    boxLine(
      '    ' +
        style.dim(`day ${selected.revision.day} moved to `) +
        style.info(selected.revision.date)
    )
  )
  console.log(boxBottom())
  console.log()
}
