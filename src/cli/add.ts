import prompts from 'prompts'
import { todayISO } from '../core/dates.js'
import { createSchedule } from '../core/scheduler.js'
import { loadStore, saveStore } from '../core/storage.js'

export async function addCommand() {
  const store = loadStore()
  const today = todayISO()

  const { topics } = await prompts({
    type: 'list',
    name: 'topics',
    message: 'What did you learn today?',
    separator: ',',
  })

  for (const rawTitle of topics) {
    const title = rawTitle.trim()

    if (!title) continue

    const exists = store.topics.some((t) => {
      t.title.toLowerCase().trim() === title.toLowerCase() && !t.completed
    })

    if (exists) {
      console.log(
        `⚠️  "${title}" already exists and is still active. Skipping.`
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
  }

  saveStore(store)
  console.log('✅ Topics saved. Future-you will thank you.')
}
