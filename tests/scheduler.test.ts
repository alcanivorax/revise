import { describe, it, expect } from 'vitest'
import { createSchedule } from '../src/core/scheduler.js'

describe('scheduler', () => {
  it('creates correct spaced intervals', () => {
    const schedule = createSchedule('2026-02-10')

    expect(schedule.length).toBe(4)
    expect(schedule[0].date).toBe('2026-02-13')
    expect(schedule[1].date).toBe('2026-02-17')
    expect(schedule[2].date).toBe('2026-03-03')
    expect(schedule[3].date).toBe('2026-03-27')
  })
})
