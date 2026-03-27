import { addDaysISO } from './dates.js'

const INTERVALS = [1, 3, 7, 14, 30, 45, 90]

export function createSchedule(createdOn: string) {
  return INTERVALS.map((day) => ({
    day,
    date: addDaysISO(createdOn, day),
    done: false,
  }))
}
