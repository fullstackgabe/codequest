import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useStreakStore } from '../streak'

describe('streak store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('first call sets streak to 1 and records today', () => {
    const s = useStreakStore()
    s.updateStreak(new Date(2026, 4, 17))
    expect(s.streakDays).toBe(1)
    expect(s.lastActivityDate).toBe('2026-05-17')
  })

  it('same-day calls are idempotent', () => {
    const s = useStreakStore()
    s.updateStreak(new Date(2026, 4, 17))
    s.updateStreak(new Date(2026, 4, 17))
    s.updateStreak(new Date(2026, 4, 17))
    expect(s.streakDays).toBe(1)
  })

  it('next-day call increments', () => {
    const s = useStreakStore()
    s.updateStreak(new Date(2026, 4, 17))
    s.updateStreak(new Date(2026, 4, 18))
    s.updateStreak(new Date(2026, 4, 19))
    expect(s.streakDays).toBe(3)
  })

  it('gap of 2+ days resets to 1', () => {
    const s = useStreakStore()
    s.updateStreak(new Date(2026, 4, 17))
    s.updateStreak(new Date(2026, 4, 20))
    expect(s.streakDays).toBe(1)
    expect(s.lastActivityDate).toBe('2026-05-20')
  })

  it('persists across store reinstantiation', () => {
    const a = useStreakStore()
    a.updateStreak(new Date(2026, 4, 17))
    a.updateStreak(new Date(2026, 4, 18))
    setActivePinia(createPinia())
    const b = useStreakStore()
    expect(b.streakDays).toBe(2)
    expect(b.lastActivityDate).toBe('2026-05-18')
  })

  it('reset clears streak and removes storage key', () => {
    const s = useStreakStore()
    s.updateStreak(new Date(2026, 4, 17))
    s.reset()
    expect(s.streakDays).toBe(0)
    expect(s.lastActivityDate).toBeNull()
    expect(localStorage.getItem('codequest_streak')).toBeNull()
  })
})
