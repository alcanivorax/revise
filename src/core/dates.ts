export function todayISO(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function addDaysISO(base: string, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function isDue(date: string, today: string): boolean {
  return date <= today
}

export function daysBetween(from: string, to: string): number {
  const a = new Date(from)
  const b = new Date(to)
  const diff = b.getTime() - a.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
