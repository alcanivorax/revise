import { todayISO, isDue, daysBetween } from '../core/dates.js'
import { loadStore } from '../core/storage.js'
import { style } from '../core/style.js'
import {
  boxBottom,
  boxDivider,
  boxLine,
  boxTop,
  visibleLength,
  wrapText,
} from './layout.js'

const INNER_WIDTH = 50

export function todayCommand(): void {
  const store = loadStore()
  const today = todayISO()

  const due = []

  for (const topic of store.topics) {
    if (topic.completed) continue

    const next = topic.schedule.find((r) => !r.done)
    if (next && isDue(next.date, today)) {
      due.push({ topic, revision: next })
    }
  }

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.sparkles +
        ' ' +
        style.header("Today's Revisions") +
        style.dim(' · ') +
        style.muted(today)
    )
  )
  console.log(boxDivider())
  console.log(boxLine())

  if (!due.length) {
    console.log(
      boxLine(
        '  ' +
          style.success(style.icon.check) +
          '  ' +
          style.title('All caught up!') +
          style.dim(' · nothing due today')
      )
    )
    console.log(boxLine())
    console.log(boxBottom())
    console.log()
    return
  }

  due.forEach((d, i) => {
    const idx = style.index(`${i + 1}`.padStart(2, ' '))
    const firstPrefix = `  ${idx} `
    const nextPrefix = ' '.repeat(5)

    if (d.revision.date === today) {
      const badge = style.dueToday(' due ')
      const meta = style.dim(' · ') + badge
      const available = Math.max(
        1,
        INNER_WIDTH - visibleLength(nextPrefix) - visibleLength(meta)
      )
      const chunks = wrapText(d.topic.title, available)

      chunks.forEach((chunk, chunkIndex) => {
        const prefix = chunkIndex === 0 ? firstPrefix : nextPrefix
        const suffix = chunkIndex === 0 ? meta : ''
        const gap = ' '.repeat(
          Math.max(
            0,
            available -
              visibleLength(chunk) +
              visibleLength(meta) -
              visibleLength(suffix)
          )
        )
        console.log(boxLine(prefix + style.title(chunk) + gap + suffix))
      })
    } else {
      const overdueBy = daysBetween(d.revision.date, today)
      const badge = style.overdue(` ${overdueBy}d overdue `)
      const meta = style.dim(' · ') + badge
      const available = Math.max(
        1,
        INNER_WIDTH - visibleLength(nextPrefix) - visibleLength(meta)
      )
      const chunks = wrapText(d.topic.title, available)

      chunks.forEach((chunk, chunkIndex) => {
        const prefix = chunkIndex === 0 ? firstPrefix : nextPrefix
        const suffix = chunkIndex === 0 ? meta : ''
        const gap = ' '.repeat(
          Math.max(
            0,
            available -
              visibleLength(chunk) +
              visibleLength(meta) -
              visibleLength(suffix)
          )
        )
        console.log(boxLine(prefix + style.title(chunk) + gap + suffix))
      })
    }
  })

  console.log(boxLine())
  console.log(boxBottom())
  console.log(
    style.dim('  tip: run ') +
      style.title('revise done <n>') +
      style.dim(' to mark a revision complete')
  )
  console.log()
}
