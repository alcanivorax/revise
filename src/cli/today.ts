import { todayISO, isDue, daysBetween } from '../core/dates.js'
import { loadStore } from '../core/storage.js'
import { style, box } from '../core/style.js'

const INNER_WIDTH = 50

function visibleLength(str: string): number {
  const plain = str.replace(/\x1b\[[0-9;]*m/g, '')
  let width = 0

  for (const char of plain) {
    // Zero-width marks (accents/variation selectors/joiners).
    if (/[\p{Mark}\u200d\ufe00-\ufe0f]/u.test(char)) continue

    // Emoji and East Asian wide chars usually occupy two columns in terminals.
    if (
      /\p{Extended_Pictographic}/u.test(char) ||
      /[\u1100-\u115f\u2e80-\u303e\u3040-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe6f\uff00-\uff60\uffe0-\uffe6]/u.test(
        char
      )
    ) {
      width += 2
      continue
    }

    width += 1
  }

  return width
}

function boxLine(content = ''): string {
  const visible = visibleLength(content)
  const padded =
    visible >= INNER_WIDTH
      ? content
      : content + ' '.repeat(INNER_WIDTH - visible)
  return style.dim(box.lightVertical) + padded + style.dim(box.lightVertical)
}

function boxTop(): string {
  return (
    style.dim(box.lightTopLeft) +
    box.lightHorizontal.repeat(INNER_WIDTH) +
    style.dim(box.lightTopRight)
  )
}

function boxBottom(): string {
  return (
    style.dim(box.lightBottomLeft) +
    box.lightHorizontal.repeat(INNER_WIDTH) +
    style.dim(box.lightBottomRight)
  )
}

function wrapText(text: string, width: number): string[] {
  if (width <= 0) return ['']
  if (!text.trim()) return ['']

  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    if (!current.length) {
      if (word.length <= width) {
        current = word
      } else {
        for (let i = 0; i < word.length; i += width) {
          lines.push(word.slice(i, i + width))
        }
      }
      continue
    }

    if (current.length + 1 + word.length <= width) {
      current += ` ${word}`
      continue
    }

    lines.push(current)
    if (word.length <= width) {
      current = word
    } else {
      current = ''
      for (let i = 0; i < word.length; i += width) {
        const chunk = word.slice(i, i + width)
        if (chunk.length === width) lines.push(chunk)
        else current = chunk
      }
    }
  }

  if (current.length) lines.push(current)
  return lines.length ? lines : ['']
}

export function todayCommand(): void {
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
        style.icon.sparkles +
        ' ' +
        style.header("Today's Revisions") +
        style.dim(' · ') +
        style.muted(today)
    )
  )
  console.log(boxBottom())
  console.log(boxLine())

  if (!due.length) {
    console.log(
      boxLine(
        '  ' +
          style.success(style.icon.check) +
          '  ' +
          style.title('All caught up!') +
          style.dim(' · nothing due today')
      )
    )
    console.log(boxLine())
    console.log(boxBottom())
    console.log()
    return
  }

  due.forEach((d, i) => {
    const idx = style.index(`${i + 1}`.padStart(2, ' '))
    const firstPrefix = `  ${idx} `
    const nextPrefix = ' '.repeat(5)

    if (d.revision.date === today) {
      const badge = style.dueToday(' due ')
      const meta = style.dim(' · ') + badge
      const available = Math.max(
        1,
        INNER_WIDTH - visibleLength(nextPrefix) - visibleLength(meta)
      )
      const chunks = wrapText(d.topic.title, available)

      chunks.forEach((chunk, chunkIndex) => {
        const prefix = chunkIndex === 0 ? firstPrefix : nextPrefix
        const gap = ' '.repeat(Math.max(0, available - chunk.length))
        console.log(boxLine(prefix + style.title(chunk) + gap + meta))
      })
    } else {
      const overdueBy = daysBetween(d.revision.date, today)
      const badge = style.overdue(` ${overdueBy}d overdue `)
      const meta = style.dim(' · ') + badge
      const available = Math.max(
        1,
        INNER_WIDTH - visibleLength(nextPrefix) - visibleLength(meta)
      )
      const chunks = wrapText(d.topic.title, available)

      chunks.forEach((chunk, chunkIndex) => {
        const prefix = chunkIndex === 0 ? firstPrefix : nextPrefix
        const gap = ' '.repeat(Math.max(0, available - chunk.length))
        console.log(boxLine(prefix + style.title(chunk) + gap + meta))
      })
    }
  })

  console.log(boxLine())
  console.log(boxBottom())
  console.log(
    style.dim('  tip: run ') +
      style.title('revise done <n>') +
      style.dim(' to mark a revision complete')
  )
  console.log()
}
