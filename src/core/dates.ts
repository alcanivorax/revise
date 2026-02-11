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
