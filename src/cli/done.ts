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

  console.log()
  console.log(style.header('done') + style.dim(' · ') + style.muted(today))
  console.log(style.dim('─'.repeat(40)))
  console.log()

  if (!due.length) {
    console.log(style.muted('no revisions due today'))
    return
  }

  if (index < 1 || index > due.length) {
    console.log(style.overdue(`invalid index (1-${due.length})`))
    return
  }

  const selected = due[index - 1]
  selected.revision.done = true

  const remaining = selected.topic.schedule.some((r) => !r.done)
  if (!remaining) {
    selected.topic.completed = true
  }

  saveStore(store)

  console.log(
    style.success(`✓ marked`) +
      ` ${selected.topic.title} ` +
      style.dim(`day ${selected.revision.day}`)
  )
  console.log()

  if (selected.topic.completed) {
    console.log(style.header('✓ topic complete — well done'))
    console.log()
  }
}
