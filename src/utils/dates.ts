function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

export function toDateString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function isYesterday(
  dateString: string,
  today: Date = new Date(),
): boolean {
  const y = new Date(today)
  y.setDate(y.getDate() - 1)
  return toDateString(y) === dateString
}

export function daysFromNow(timestamp: number, now: number = Date.now()): number {
  const ms = timestamp - now
  if (ms <= 0) return 0
  return Math.ceil(ms / (24 * 60 * 60 * 1000))
}
