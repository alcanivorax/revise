import { todayISO, isDue } from '../core/dates.js'
import { loadStore } from '../core/storage.js'

export function todayCommand() {
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
    console.log('✅ Nothing to revise today. Go build.')
    return
  }

  console.log(`📌 Revisions due — ${today}\n`)
  due.forEach((d, i) => {
    console.log(
      `[${i + 1}] ${d.topic.title} — Day ${d.revision.day} (due ${d.revision.date})`
    )
  })
}
