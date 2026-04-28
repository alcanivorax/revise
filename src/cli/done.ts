import { todayISO, isDue } from '../core/dates.js'
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
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.check +
        ' ' +
        style.header('Mark Complete') +
        style.dim(' · ') +
        style.muted(today)
    )
  )
  console.log(boxBottom())
  console.log()

  if (!due.length) {
    console.log(boxTop())
    console.log(boxLine('    ' + style.muted('no revisions due today')))
    console.log(boxBottom())
    console.log()
    return
  }

  if (index < 1 || index > due.length) {
    console.log(boxTop())
    console.log(
      boxLine('    ' + style.overdue(`invalid index (choose 1-${due.length})`))
    )
    console.log(boxBottom())
    console.log()
    return
  }

  const selected = due[index - 1]
  const completedBefore = selected.topic.completed
  selected.revision.done = true
  selected.revision.completedOn = today

  const remaining = selected.topic.schedule.some((r) => !r.done)
  if (!remaining) {
    selected.topic.completed = true
  }

  store.history ??= []
  store.history.push({
    type: 'done',
    topicId: selected.topic.id,
    revisionDay: selected.revision.day,
    completedBefore,
    date: today,
  })

  saveStore(store)

  console.log(boxTop())
  const titlePrefix = '    ' + style.success(style.icon.check) + ' '
  const continuationPrefix = ' '.repeat(6)
  const titleWidth = INNER_WIDTH - visibleLength(continuationPrefix)
  const titleLines = wrapText(selected.topic.title, titleWidth)

  titleLines.forEach((line, lineIndex) => {
    const prefix = lineIndex === 0 ? titlePrefix : continuationPrefix
    console.log(boxLine(prefix + style.title(line)))
  })

  console.log(
    boxLine('    ' + style.dim('day ' + selected.revision.day + ' complete'))
  )
  console.log(boxBottom())
  console.log()

  if (selected.topic.completed) {
    console.log(boxTop())
    console.log(
      boxLine(
        '  ' +
          style.icon.trophy +
          ' ' +
          style.title('Topic Complete!') +
          style.dim(' · great work!')
      )
    )
    console.log(boxBottom())
    console.log()
  }
}
