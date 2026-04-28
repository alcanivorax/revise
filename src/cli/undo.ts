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

export function undoCommand(): void {
  const store = loadStore()
  const today = todayISO()
  const action = store.history?.pop()

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.arrow +
        ' ' +
        style.header('Undo') +
        style.dim(' · ') +
        style.muted(today)
    )
  )
  console.log(boxBottom())
  console.log()

  if (!action) {
    console.log(boxTop())
    console.log(boxLine('    ' + style.muted('nothing to undo')))
    console.log(boxBottom())
    console.log()
    return
  }

  const topic = store.topics.find((item) => item.id === action.topicId)
  const revision = topic?.schedule.find(
    (item) => item.day === action.revisionDay
  )

  if (!topic || !revision) {
    saveStore(store)
    console.log(boxTop())
    console.log(
      boxLine('    ' + style.overdue('last action no longer applies'))
    )
    console.log(boxBottom())
    console.log()
    return
  }

  revision.done = false
  delete revision.completedOn
  topic.completed = action.completedBefore
  saveStore(store)

  const prefix = '    ' + style.success(style.icon.check) + ' '
  const continuationPrefix = ' '.repeat(6)
  const titleWidth = INNER_WIDTH - visibleLength(continuationPrefix)

  console.log(boxTop())
  for (const [lineIndex, line] of wrapText(topic.title, titleWidth).entries()) {
    console.log(
      boxLine(
        (lineIndex === 0 ? prefix : continuationPrefix) + style.title(line)
      )
    )
  }
  console.log(
    boxLine('    ' + style.dim(`day ${revision.day} marked incomplete`))
  )
  console.log(boxBottom())
  console.log()
}
