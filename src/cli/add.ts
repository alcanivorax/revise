import prompts from 'prompts'
import { todayISO } from '../core/dates.js'
import { createSchedule } from '../core/scheduler.js'
import { loadStore, saveStore } from '../core/storage.js'
import { style, box } from '../core/style.js'

export async function addCommand(): Promise<void> {
  const store = loadStore()
  const today = todayISO()

  console.log()
  console.log(
    style.dim(box.lightTopLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightTopRight)
  )
  console.log(
    style.dim(box.lightVertical) +
      '  ' +
      style.icon.rocket +
      ' ' +
      style.header('Add New Topic') +
      style.dim(' · ') +
      style.muted(today) +
      ' '.repeat(20 - today.length) +
      style.dim(box.lightVertical)
  )
  console.log(
    style.dim(box.lightBottomLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightBottomRight)
  )
  console.log()

  const response = await prompts({
    type: 'text',
    name: 'topics',
    message: style.muted('  what did you learn?'),
  })

  const raw = response.topics
  if (!raw || !raw.trim()) {
    console.log(style.dim('  no topics added'))
    console.log()
    return
  }

  const topics = raw
    .split(',')
    .map((t: string) => t.trim())
    .filter(Boolean)

  console.log()

  const added: string[] = []
  const skipped: string[] = []

  for (const title of topics) {
    const exists = store.topics.some(
      (t) => t.title.toLowerCase() === title.toLowerCase() && !t.completed
    )

    if (exists) {
      skipped.push(title)
      continue
    }

    store.topics.push({
      id: crypto.randomUUID(),
      title,
      createdOn: today,
      schedule: createSchedule(today),
      completed: false,
    })
    added.push(title)
  }

  if (added.length > 0) {
    console.log(
      style.dim(box.lightTopLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightTopRight)
    )
    for (const title of added) {
      const pad = ' '.repeat(Math.max(0, 46 - title.length))
      console.log(
        style.dim(box.lightVertical) +
          '  ' +
          style.success(style.icon.check) +
          ' ' +
          style.title(title) +
          pad +
          style.dim(box.lightVertical)
      )
    }
    if (skipped.length > 0) {
      for (const title of skipped) {
        const pad = ' '.repeat(Math.max(0, 46 - title.length))
        console.log(
          style.dim(box.lightVertical) +
            '  ' +
            style.muted('↓') +
            ' ' +
            style.dim(title) +
            pad +
            style.dim(box.lightVertical)
        )
      }
    }
    console.log(
      style.dim(box.lightBottomLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightBottomRight)
    )
    saveStore(store)
    console.log()
    console.log(
      style.dim('  saved ') +
        style.success(`${added.length} topic${added.length > 1 ? 's' : ''}`) +
        (skipped.length > 0
          ? style.dim(' · ') + style.muted(`${skipped.length} skipped`)
          : '')
    )
  } else if (skipped.length > 0) {
    console.log(
      style.dim(box.lightTopLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightTopRight)
    )
    for (const title of skipped) {
      const pad = ' '.repeat(Math.max(0, 46 - title.length))
      console.log(
        style.dim(box.lightVertical) +
          '  ' +
          style.muted('↓') +
          ' ' +
          style.dim(title) +
          pad +
          style.dim(box.lightVertical)
      )
    }
    console.log(
      style.dim(box.lightBottomLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightBottomRight)
    )
    console.log()
    console.log(style.muted('  all topics already exist'))
  }
  console.log()
}
