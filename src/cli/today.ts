import { todayISO, isDue, daysBetween } from '../core/dates.js'
import { loadStore } from '../core/storage.js'
import { style } from '../core/style.js'

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
  console.log(style.header('revision') + style.dim(' · ') + style.muted(today))
  console.log(style.dim('─'.repeat(40)))
  console.log()

  if (!due.length) {
    console.log(style.success('✓') + style.dim(' nothing due today'))
    return
  }

  due.forEach((d, i) => {
    const idx = style.index(`${i + 1}`.padStart(2, ' '))
    const title = style.title(d.topic.title)
    if (d.revision.date === today) {
      const badge = style.dueToday('due')
      console.log(`  ${idx}  ${title}  ${style.dim('·')}  ${badge}`)
    } else {
      const overdueBy = daysBetween(d.revision.date, today)
      const badge = style.overdue(`overdue ${overdueBy}d`)
      console.log(`  ${idx}  ${title}  ${style.dim('·')}  ${badge}`)
    }
  })

  console.log()
}
