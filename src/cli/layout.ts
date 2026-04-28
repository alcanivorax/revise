import { box, style } from '../core/style.js'

export const DEFAULT_INNER_WIDTH = 50

export function visibleLength(str: string): number {
  const plain = str.replace(/\x1b\[[0-9;]*m/g, '')
  let width = 0

  for (const char of plain) {
    if (/[\p{Mark}\u200d\ufe00-\ufe0f]/u.test(char)) continue
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

export function boxLine(content = '', width = DEFAULT_INNER_WIDTH): string {
  const visible = visibleLength(content)
  const padded =
    visible >= width ? content : content + ' '.repeat(width - visible)
  return style.border(box.vertical) + padded + style.border(box.vertical)
}

export function boxTop(width = DEFAULT_INNER_WIDTH): string {
  return (
    style.border(box.topLeft) +
    style.accent(box.horizontal.repeat(width)) +
    style.border(box.topRight)
  )
}

export function boxBottom(width = DEFAULT_INNER_WIDTH): string {
  return (
    style.border(box.bottomLeft) +
    style.border(box.horizontal.repeat(width)) +
    style.border(box.bottomRight)
  )
}

export function boxDivider(width = DEFAULT_INNER_WIDTH): string {
  return (
    style.border(box.leftT) +
    style.border(box.horizontal.repeat(width)) +
    style.border(box.rightT)
  )
}

export function wrapText(text: string, width: number): string[] {
  if (width <= 0) return ['']
  if (!text.trim()) return ['']

  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    if (!current.length) {
      if (visibleLength(word) <= width) {
        current = word
      } else {
        for (let i = 0; i < word.length; i += width) {
          lines.push(word.slice(i, i + width))
        }
      }
      continue
    }

    if (visibleLength(current) + 1 + visibleLength(word) <= width) {
      current += ` ${word}`
      continue
    }

    lines.push(current)
    if (visibleLength(word) <= width) {
      current = word
    } else {
      current = ''
      for (let i = 0; i < word.length; i += width) {
        const chunk = word.slice(i, i + width)
        if (visibleLength(chunk) === width) lines.push(chunk)
        else current = chunk
      }
    }
  }

  if (current.length) lines.push(current)
  return lines.length ? lines : ['']
}
