import prompts from 'prompts'
import { todayISO } from '../core/dates.js'
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

export async function editCommand(index: number): Promise<void> {
  const store = loadStore()
  const today = todayISO()
  const topic = store.topics[index - 1]

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.arrow +
        ' ' +
        style.header('Edit Topic') +
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
    type: 'text',
    name: 'title',
    message: style.muted('  new topic title'),
    initial: topic.title,
  })

  const title = String(response.title ?? '').trim()
  if (!title) {
    console.log(style.dim('  no changes made'))
    console.log()
    return
  }

  topic.title = title
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
  console.log(boxLine('    ' + style.dim('topic updated')))
  console.log(boxBottom())
  console.log()
}
