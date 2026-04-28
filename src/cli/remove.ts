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

export async function removeCommand(index: number): Promise<void> {
  const store = loadStore()
  const today = todayISO()
  const topic = store.topics[index - 1]

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.cross +
        ' ' +
        style.header('Remove Topic') +
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
    message: style.muted(`  remove "${topic.title}"?`),
    initial: false,
  })

  if (!response.confirmed) {
    console.log(style.dim('  remove cancelled'))
    console.log()
    return
  }

  const [removed] = store.topics.splice(index - 1, 1)
  saveStore(store)

  const prefix = '    ' + style.success(style.icon.check) + ' '
  const continuationPrefix = ' '.repeat(6)
  const titleWidth = INNER_WIDTH - visibleLength(continuationPrefix)

  console.log()
  console.log(boxTop())
  for (const [lineIndex, line] of wrapText(
    removed.title,
    titleWidth
  ).entries()) {
    console.log(
      boxLine(
        (lineIndex === 0 ? prefix : continuationPrefix) + style.title(line)
      )
    )
  }
  console.log(boxLine('    ' + style.dim('topic removed')))
  console.log(boxBottom())
  console.log()
}
