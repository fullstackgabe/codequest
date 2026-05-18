import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSRSStore } from '../srs'

describe('srs store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('registerCard is idempotent and creates fresh state', () => {
    const s = useSRSStore()
    s.registerCard('stub', 'fc-1')
    const first = s.getCard('stub', 'fc-1')
    expect(first?.repetitions).toBe(0)
    expect(first?.nextReview).toBeNull()

    s.registerCard('stub', 'fc-1') // no-op
    expect(s.getCard('stub', 'fc-1')).toEqual(first)
  })

  it('review applies SM-2 and updates nextReview', () => {
    const s = useSRSStore()
    s.registerCard('stub', 'fc-1')
    const result = s.review('stub', 'fc-1', 5)
    expect(result.repetitions).toBe(1)
    expect(result.interval).toBe(1)
    expect(result.nextReview).toBeGreaterThan(Date.now())
  })

  it('cards are namespaced per course', () => {
    const s = useSRSStore()
    s.registerCard('stub', 'fc-1')
    s.registerCard('other', 'fc-1') // same cardId, different course
    expect(s.getCard('stub', 'fc-1')).not.toBeNull()
    expect(s.getCard('other', 'fc-1')).not.toBeNull()
    s.review('stub', 'fc-1', 5)
    // 'other' bucket untouched
    expect(s.getCard('other', 'fc-1')?.repetitions).toBe(0)
  })

  it('dueCount counts new cards (nextReview null) as due', () => {
    const s = useSRSStore()
    expect(s.dueCount('stub')).toBe(0)
    s.registerCard('stub', 'a')
    s.registerCard('stub', 'b')
    expect(s.dueCount('stub')).toBe(2)
    s.review('stub', 'a', 5) // schedules into the future
    expect(s.dueCount('stub')).toBe(1)
  })

  it('persists across reinstantiation', () => {
    const a = useSRSStore()
    a.registerCard('stub', 'fc-1')
    setActivePinia(createPinia())
    const b = useSRSStore()
    expect(b.getCard('stub', 'fc-1')).not.toBeNull()
  })

  it('reset clears everything and removes storage key', () => {
    const s = useSRSStore()
    s.registerCard('stub', 'fc-1')
    s.reset()
    expect(s.getCard('stub', 'fc-1')).toBeNull()
    expect(localStorage.getItem('codequest_srs')).toBeNull()
  })
})
