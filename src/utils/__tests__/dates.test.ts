import { describe, expect, it } from 'vitest'
import { daysFromNow, isYesterday, toDateString } from '../dates'

describe('dates', () => {
  it('toDateString formats as YYYY-MM-DD with zero-padding', () => {
    expect(toDateString(new Date(2026, 4, 17))).toBe('2026-05-17')
    expect(toDateString(new Date(2026, 0, 3))).toBe('2026-01-03')
  })

  it('isYesterday recognises the previous day only', () => {
    const today = new Date(2026, 4, 17)
    expect(isYesterday('2026-05-16', today)).toBe(true)
    expect(isYesterday('2026-05-15', today)).toBe(false)
    expect(isYesterday('2026-05-17', today)).toBe(false)
  })

  it('daysFromNow returns ceiling of remaining day diff', () => {
    const now = new Date(2026, 4, 17, 12, 0, 0).getTime()
    const oneDay = 24 * 60 * 60 * 1000
    expect(daysFromNow(now + oneDay, now)).toBe(1)
    expect(daysFromNow(now + 2.5 * oneDay, now)).toBe(3)
    expect(daysFromNow(now - oneDay, now)).toBe(0)
    expect(daysFromNow(now, now)).toBe(0)
  })
})
