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

export async function resetCommand(index: number): Promise<void> {
  const store = loadStore()
  const today = todayISO()
  const topic = store.topics[index - 1]

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.clock +
        ' ' +
        style.header('Reset Topic') +
        style.dim(' · ') +
        style.muted(today)
    )
  )
  console.log(boxBottom())
  console.log()

  if (!topic) {
    console.log(boxTop())
    console.log(
      boxLine(
        '    ' +
          (store.topics.length
            ? style.overdue(`invalid index (choose 1-${store.topics.length})`)
            : style.muted('no topics yet'))
      )
    )
    console.log(boxBottom())
    console.log()
    return
  }

  const response = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message: style.muted(`  restart schedule for "${topic.title}"?`),
    initial: false,
  })

  if (!response.confirmed) {
    console.log(style.dim('  reset cancelled'))
    console.log()
    return
  }

  topic.createdOn = today
  topic.schedule = createSchedule(today)
  topic.completed = false
  saveStore(store)

  const prefix = '    ' + style.success(style.icon.check) + ' '
  const continuationPrefix = ' '.repeat(6)
  const titleWidth = INNER_WIDTH - visibleLength(continuationPrefix)

  console.log()
  console.log(boxTop())
  for (const [lineIndex, line] of wrapText(topic.title, titleWidth).entries()) {
    console.log(
      boxLine(
        (lineIndex === 0 ? prefix : continuationPrefix) + style.title(line)
      )
    )
  }
  console.log(boxLine('    ' + style.dim('schedule restarted from today')))
  console.log(boxBottom())
  console.log()
}
