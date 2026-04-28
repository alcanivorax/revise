import prompts from 'prompts'
import { todayISO } from '../core/dates.js'
import { createSchedule } from '../core/scheduler.js'
import { loadStore, saveStore } from '../core/storage.js'
import { style } from '../core/style.js'
import {
  boxBottom,
  boxLine,
  boxTop,
  visibleLength,
  wrapText,
} from './layout.js'

const INNER_WIDTH = 50

export async function addCommand(): Promise<void> {
  const store = loadStore()
  const today = todayISO()

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.rocket +
        ' ' +
        style.header('Add New Topic') +
        style.dim(' · ') +
        style.muted(today)
    )
  )
  console.log(boxBottom())
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
    console.log(boxTop())
    for (const title of added) {
      const prefix = '  ' + style.success(style.icon.check) + ' '
      const continuationPrefix = ' '.repeat(4)
      const titleWidth = INNER_WIDTH - visibleLength(continuationPrefix)

      for (const [lineIndex, line] of wrapText(title, titleWidth).entries()) {
        console.log(
          boxLine(
            (lineIndex === 0 ? prefix : continuationPrefix) + style.title(line)
          )
        )
      }
    }
    if (skipped.length > 0) {
      for (const title of skipped) {
        const prefix = '  ' + style.muted('↓') + ' '
        const continuationPrefix = ' '.repeat(4)
        const titleWidth = INNER_WIDTH - visibleLength(continuationPrefix)

        for (const [lineIndex, line] of wrapText(title, titleWidth).entries()) {
          console.log(
            boxLine(
              (lineIndex === 0 ? prefix : continuationPrefix) + style.dim(line)
            )
          )
        }
      }
    }
    console.log(boxBottom())
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
    console.log(boxTop())
    for (const title of skipped) {
      const prefix = '  ' + style.muted('↓') + ' '
      const continuationPrefix = ' '.repeat(4)
      const titleWidth = INNER_WIDTH - visibleLength(continuationPrefix)

      for (const [lineIndex, line] of wrapText(title, titleWidth).entries()) {
        console.log(
          boxLine(
            (lineIndex === 0 ? prefix : continuationPrefix) + style.dim(line)
          )
        )
      }
    }
    console.log(boxBottom())
    console.log()
    console.log(style.muted('  all topics already exist'))
  }
  console.log()
}
