import { todayISO, isDue } from '../core/dates.js'
import { loadStore, saveStore } from '../core/storage.js'
import { style, box } from '../core/style.js'

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
  console.log(
    style.dim(box.lightTopLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightTopRight)
  )
  console.log(
    style.dim(box.lightVertical) +
      '  ' +
      style.icon.check +
      ' ' +
      style.header('Mark Complete') +
      style.dim(' · ') +
      style.muted(today) +
      ' '.repeat(30 - today.length) +
      style.dim(box.lightVertical)
  )
  console.log(
    style.dim(box.lightBottomLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightBottomRight)
  )
  console.log()

  if (!due.length) {
    console.log(
      style.dim(box.lightTopLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightTopRight)
    )
    console.log(
      style.dim(box.lightVertical) +
        '    ' +
        style.muted('no revisions due today') +
        ' '.repeat(24) +
        style.dim(box.lightVertical)
    )
    console.log(
      style.dim(box.lightBottomLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightBottomRight)
    )
    console.log()
    return
  }

  if (index < 1 || index > due.length) {
    console.log(
      style.dim(box.lightTopLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightTopRight)
    )
    console.log(
      style.dim(box.lightVertical) +
        '    ' +
        style.overdue(`invalid index (choose 1-${due.length})`) +
        ' '.repeat(14) +
        style.dim(box.lightVertical)
    )
    console.log(
      style.dim(box.lightBottomLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightBottomRight)
    )
    console.log()
    return
  }

  const selected = due[index - 1]
  selected.revision.done = true

  const remaining = selected.topic.schedule.some((r) => !r.done)
  if (!remaining) {
    selected.topic.completed = true
  }

  saveStore(store)

  console.log(
    style.dim(box.lightTopLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightTopRight)
  )
  console.log(
    style.dim(box.lightVertical) +
      '    ' +
      style.success(style.icon.check) +
      ' ' +
      style.title(selected.topic.title) +
      ' '.repeat(Math.max(0, 30 - selected.topic.title.length)) +
      style.dim(box.lightVertical)
  )
  console.log(
    style.dim(box.lightVertical) +
      '    ' +
      style.dim('day ' + selected.revision.day + ' complete') +
      ' '.repeat(24) +
      style.dim(box.lightVertical)
  )
  console.log(
    style.dim(box.lightBottomLeft) +
      box.lightHorizontal.repeat(50) +
      style.dim(box.lightBottomRight)
  )
  console.log()

  if (selected.topic.completed) {
    console.log(
      style.dim(box.lightTopLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightTopRight)
    )
    console.log(
      style.dim(box.lightVertical) +
        '  ' +
        style.icon.trophy +
        ' ' +
        style.title('Topic Complete!') +
        style.dim(' · great work!') +
        ' '.repeat(21) +
        style.dim(box.lightVertical)
    )
    console.log(
      style.dim(box.lightBottomLeft) +
        box.lightHorizontal.repeat(50) +
        style.dim(box.lightBottomRight)
    )
    console.log()
  }
}
