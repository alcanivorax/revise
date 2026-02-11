import prompts from 'prompts'
import { todayISO } from '../core/dates.js'
import { createSchedule } from '../core/scheduler.js'
import { loadStore, saveStore } from '../core/storage.js'
import { style } from '../core/style.js'

export async function addCommand(): Promise<void> {
  const store = loadStore()
  const today = todayISO()

  const response = await prompts({
    type: 'list',
    name: 'topics',
    message: 'What did you learn today?',
    separator: ',',
  })

  const topics = response.topics

  if (!topics || topics.length === 0) {
    console.log(style.muted('No topics added.'))
    return
  }

  let addedCount = 0

  for (const rawTitle of topics) {
    const title = rawTitle.trim()

    if (!title) continue

    const exists = store.topics.some(
      (t) =>
        t.title.toLowerCase().trim() === title.toLowerCase() && !t.completed
    )

    if (exists) {
      console.log(
        style.muted(
          `⚠️  "${title}" already exists and is still active. Skipping.`
        )
      )
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
  }

  if (addedCount === 0) {
    console.log(style.muted('No new topics added.'))
    return
  }

  saveStore(store)
  console.log(
    style.success(`✅ ${addedCount} topic${addedCount > 1 ? 's' : ''} saved.`)
  )
}
