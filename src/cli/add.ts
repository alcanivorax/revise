import prompts from 'prompts'
import { todayISO } from '../core/dates.js'
import { createSchedule } from '../core/scheduler.js'
import { loadStore, saveStore } from '../core/storage.js'
import { style } from '../core/style.js'

export async function addCommand(): Promise<void> {
  const store = loadStore()
  const today = todayISO()

  console.log()
  console.log(style.header('add') + style.dim(' · ') + style.muted(today))
  console.log(style.dim('─'.repeat(40)))
  console.log()

  const response = await prompts({
    type: 'text',
    name: 'topics',
    message: style.muted('what did you learn?'),
  })

  const raw = response.topics
  if (!raw || !raw.trim()) {
    console.log(style.dim('no topics added'))
    return
  }

  const topics = raw
    .split(',')
    .map((t: string) => t.trim())
    .filter(Boolean)
  let addedCount = 0

  for (const title of topics) {
    const exists = store.topics.some(
      (t) => t.title.toLowerCase() === title.toLowerCase() && !t.completed
    )

    if (exists) {
      console.log(style.muted(`  ↓ skipped "${title}" (already active)`))
      continue
    }

    store.topics.push({
      id: crypto.randomUUID(),
      title,
      createdOn: today,
      schedule: createSchedule(today),
      completed: false,
    })
    addedCount++
    console.log(style.success(`  + ${title}`))
  }

  if (addedCount > 0) {
    saveStore(store)
    console.log()
    console.log(
      style.dim(`saved ${addedCount} topic${addedCount > 1 ? 's' : ''}`)
    )
  }
  console.log()
}
