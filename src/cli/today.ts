import { todayISO, isDue, daysBetween } from '../core/dates.js'
import { loadStore } from '../core/storage.js'
import { style, box } from '../core/style.js'

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
  console.log(
    style.dim(box.lightTopLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightTopRight)
  )
  console.log(
    style.dim(box.lightVertical) +
      '  ' +
      style.icon.sparkles +
      ' ' +
      style.header("Today's Revisions") +
      style.dim(' · ') +
      style.muted(today) +
      ' '.repeat(25 - today.length) +
      style.dim(box.lightVertical)
  )
  console.log(
    style.dim(box.lightBottomLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightBottomRight)
  )
  console.log(
    style.dim(box.lightVertical) + ' '.repeat(50) + style.dim(box.lightVertical)
  )

  if (!due.length) {
    console.log(
      style.dim(box.lightVertical) +
        '  ' +
        style.success(style.icon.check) +
        '  ' +
        style.title('All caught up!') +
        style.dim(' · nothing due today') +
        ' '.repeat(11) +
        style.dim(box.lightVertical)
    )
    console.log(
      style.dim(box.lightVertical) +
        ' '.repeat(50) +
        style.dim(box.lightVertical)
    )
    console.log(
      style.dim(box.lightBottomLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightBottomRight)
    )
    console.log()
    return
  }

  due.forEach((d, i) => {
    const idx = style.index(`${i + 1}`.padStart(2, ' '))
    const title = style.title(d.topic.title)
    const titlePad = ' '.repeat(Math.max(0, 30 - d.topic.title.length))

    if (d.revision.date === today) {
      const badge = style.dueToday('  due  ')
      console.log(
        style.dim(box.lightVertical) +
          '  ' +
          idx +
          titlePad +
          title +
          style.dim('·') +
          badge +
          style.dim(box.lightVertical)
      )
    } else {
      const overdueBy = daysBetween(d.revision.date, today)
      const badge = style.overdue(` ${overdueBy}d overdue `)
      console.log(
        style.dim(box.lightVertical) +
          '  ' +
          idx +
          titlePad +
          title +
          style.dim('·') +
          badge +
          style.dim(box.lightVertical)
      )
    }
  })

  console.log(
    style.dim(box.lightVertical) + ' '.repeat(52) + style.dim(box.lightVertical)
  )
  console.log(
    style.dim(box.lightBottomLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightBottomRight)
  )
  console.log(
    style.dim('  tip: run ') +
      style.title('revise done <n>') +
      style.dim(' to mark a revision complete')
  )
  console.log()
}
