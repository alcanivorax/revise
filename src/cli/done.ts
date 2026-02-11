import { todayISO, isDue } from '../core/dates.js'
import { loadStore, saveStore } from '../core/storage.js'
import { style } from '../core/style.js'

export function doneCommand(index: number): void {
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
    console.log(style.muted('❌ No revisions due today.'))
    return
  }

  if (index < 1 || index > due.length) {
    console.log(style.muted('❌ Invalid revision number.'))
    return
  }

  const selected = due[index - 1]

  // Mark revision as done
  selected.revision.done = true

  // Check if topic is completed
  const remaining = selected.topic.schedule.some((r) => !r.done)
  if (!remaining) {
    selected.topic.completed = true
  }

  saveStore(store)

  console.log(
    style.success(
      `✅ Marked "${selected.topic.title}" — Day ${selected.revision.day} as done`
    )
  )
  if (selected.topic.completed) {
    console.log(style.header('🎉 Topic fully revised. Respect.'))
  }
}
