import { describe, it, expect } from 'vitest'
import { addDaysISO, isDue, daysBetween } from '../src/core/dates.js'

describe('date utilities', () => {
  it('adds days correctly', () => {
    const result = addDaysISO('2026-02-10', 3)
    expect(result).toBe('2026-02-13')
  })

  it('detects due correctly', () => {
    expect(isDue('2026-02-10', '2026-02-10')).toBe(true)
    expect(isDue('2026-02-09', '2026-02-10')).toBe(true)
    expect(isDue('2026-02-11', '2026-02-10')).toBe(false)
  })

  it('calculates days between', () => {
    expect(daysBetween('2026-02-10', '2026-02-12')).toBe(2)
  })
})
