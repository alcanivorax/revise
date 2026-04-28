import { addDaysISO, isDue, todayISO } from '../core/dates.js'
import { loadStore } from '../core/storage.js'
import { style } from '../core/style.js'
import { boxBottom, boxDivider, boxLine, boxTop, wrapText } from './layout.js'

const INNER_WIDTH = 50
const BAR_WIDTH = 24

function currentStreak(dates: string[], today: string): number {
  const uniqueDates = new Set(dates)
  let streak = 0

  while (uniqueDates.has(addDaysISO(today, -streak))) {
    streak += 1
  }

  return streak
}

function bestStreak(dates: string[]): number {
  const sorted = Array.from(new Set(dates)).sort()
  let best = 0
  let current = 0
  let previous = ''

  for (const date of sorted) {
    if (!previous || addDaysISO(previous, 1) === date) {
      current += 1
    } else {
      current = 1
    }

    best = Math.max(best, current)
    previous = date
  }

  return best
}

function progressBar(value: number, total: number, width = BAR_WIDTH): string {
  const ratio = total > 0 ? Math.min(1, Math.max(0, value / total)) : 0
  const filled = Math.round(ratio * width)
  return (
    style.success('█'.repeat(filled)) + style.dim('░'.repeat(width - filled))
  )
}

function streakMessage(
  streak: number,
  due: number,
  overdue: number,
  completedToday: number
): string {
  if (overdue > 0) return `clear ${overdue} overdue to protect momentum`
  if (due > 0) return `finish ${due} today to extend the streak`
  if (completedToday > 0) return 'today is locked — come back tomorrow'
  if (streak >= 30) return 'elite consistency — keep the chain alive'
  if (streak >= 14) return 'two-week lock-in — do not break it'
  if (streak >= 7) return 'weekly rhythm built — keep stacking'
  if (streak > 0) return 'streak active — one review keeps it alive'
  return 'start today — one review begins the chain'
}

export function statsCommand(): void {
  const store = loadStore()
  const today = todayISO()
  const active = store.topics.filter((topic) => !topic.completed).length
  const completed = store.topics.length - active
  const completedRevisions = store.topics.reduce(
    (total, topic) =>
      total + topic.schedule.filter((revision) => revision.done).length,
    0
  )
  const totalRevisions = store.topics.reduce(
    (total, topic) => total + topic.schedule.length,
    0
  )
  const completionPercent =
    totalRevisions > 0
      ? Math.round((completedRevisions / totalRevisions) * 100)
      : 0
  const due = store.topics.filter((topic) => {
    if (topic.completed) return false
    const next = topic.schedule.find((revision) => !revision.done)
    return next?.date === today
  }).length
  const overdue = store.topics.filter((topic) => {
    if (topic.completed) return false
    const next = topic.schedule.find((revision) => !revision.done)
    return next ? isDue(next.date, today) && next.date !== today : false
  }).length
  const historyDates =
    store.history
      ?.filter((entry) => entry.type === 'done')
      .map((entry) => entry.date) ?? []
  const streak = currentStreak(historyDates, today)
  const record = bestStreak(historyDates)
  const completedToday = historyDates.filter((date) => date === today).length
  const remainingToday = due + overdue
  const message = streakMessage(streak, due, overdue, completedToday)

  const chain = Array.from({ length: 7 }, (_, i) => {
    const date = addDaysISO(today, i - 6)
    return historyDates.includes(date) ? style.success('●') : style.dim('○')
  }).join(' ')

  console.log()
  console.log(boxTop())
  console.log(
    boxLine(
      '  ' +
        style.icon.sparkles +
        ' ' +
        style.header('Grind Stats') +
        style.dim(' · ') +
        style.muted(today)
    )
  )
  console.log(
    boxLine(
      '  ' +
        style.dim('current streak ') +
        style.success(`${streak}d`) +
        style.dim(' · best ') +
        style.title(`${record}d`) +
        style.dim(' · ') +
        (remainingToday > 0
          ? style.dueToday('action needed')
          : style.success('locked in'))
    )
  )
  console.log(boxDivider())
  console.log(boxLine())
  console.log(
    boxLine('  ' + style.label('chain') + style.dim('  last 7 days  ') + chain)
  )
  console.log(
    boxLine(
      '  ' +
        style.label('focus') +
        style.dim('  ') +
        (remainingToday > 0
          ? style.dueToday(
              `${remainingToday} revision${remainingToday === 1 ? '' : 's'} waiting`
            )
          : style.success('all clear for today'))
    )
  )
  console.log(boxLine())
  console.log(
    boxLine(
      '  ' +
        style.dim('today ') +
        style.success(`${completedToday}`) +
        style.dim('   due ') +
        style.dueToday(`${due}`) +
        style.dim('   overdue ') +
        style.overdue(`${overdue}`)
    )
  )
  console.log(boxLine())
  console.log(
    boxLine(
      '  ' +
        style.dim('progress ') +
        progressBar(completedRevisions, totalRevisions) +
        style.dim('  ') +
        style.title(`${completionPercent}%`)
    )
  )
  console.log(
    boxLine(
      '  ' +
        style.muted('topics ') +
        style.title(`${store.topics.length}`) +
        style.dim(' · active ') +
        style.title(`${active}`) +
        style.dim(' · complete ') +
        style.title(`${completed}`) +
        style.dim(' · reps ') +
        style.title(`${completedRevisions}/${totalRevisions}`)
    )
  )
  console.log(boxLine())
  for (const [lineIndex, line] of wrapText(
    message,
    INNER_WIDTH - 5
  ).entries()) {
    console.log(
      boxLine(
        (lineIndex === 0 ? '  ' + style.icon.arrow + ' ' : '    ') +
          style.title(line)
      )
    )
  }
  console.log(boxLine())
  console.log(boxBottom())
  console.log()
}
