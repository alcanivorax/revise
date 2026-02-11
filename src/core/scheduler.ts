import { addDaysISO } from './dates.js'

const INTERVALS = [3, 7, 21, 45]

export function createSchedule(createdOn: string) {
  return INTERVALS.map((day) => ({
    day,
    date: addDaysISO(createdOn, day),
    done: false,
  }))
}
