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

  if (!due.length) {
    console.log(style.success('✅ Nothing to revise today. Go build.'))
    return
  }

  console.log(style.header(`📌 Revisions due — ${today}\n`))
  due.forEach((d, i) => {
    const title = style.topic(d.topic.title)
    if (d.revision.date === today) {
      console.log(
        `[${i + 1}] ${title} — ${style.dueToday(
          `Day ${d.revision.day} (due today)`
        )}`
      )
    } else {
      const overdueBy = daysBetween(d.revision.date, today)
      console.log(
        `[${i + 1}] ${title} — ${style.overdue(
          `Day ${d.revision.day} (overdue by ${overdueBy} day${overdueBy > 1 ? 's' : ''})`
        )}`
      )
    }
  })
}
