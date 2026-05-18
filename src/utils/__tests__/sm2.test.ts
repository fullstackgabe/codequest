import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SM2_DEFAULT_EASE, SM2_MIN_EASE, sm2 } from '../sm2'
import type { SRSCard } from '@/types/srsCard'

const fresh = (): SRSCard => ({
  easeFactor: SM2_DEFAULT_EASE,
  interval: 1,
  repetitions: 0,
  nextReview: null,
})

describe('sm2', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('resets repetitions and interval on quality < 3', () => {
    const card: SRSCard = {
      easeFactor: 2.5,
      interval: 10,
      repetitions: 4,
      nextReview: null,
    }
    const result = sm2(card, 1)
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
  })

  it('first successful review: interval=1, repetitions=1', () => {
    const result = sm2(fresh(), 5)
    expect(result.interval).toBe(1)
    expect(result.repetitions).toBe(1)
  })

  it('second successful review: interval=6, repetitions=2', () => {
    const card: SRSCard = {
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      nextReview: null,
    }
    const result = sm2(card, 5)
    expect(result.interval).toBe(6)
    expect(result.repetitions).toBe(2)
  })

  it('third+ review grows via easeFactor', () => {
    const card: SRSCard = {
      easeFactor: 2.5,
      interval: 6,
      repetitions: 2,
      nextReview: null,
    }
    const result = sm2(card, 5)
    expect(result.interval).toBe(15) // 6 * 2.5
    expect(result.repetitions).toBe(3)
  })

  it('easeFactor never drops below SM2_MIN_EASE', () => {
    let card: SRSCard = { ...fresh(), easeFactor: 1.4 }
    for (let i = 0; i < 5; i++) {
      card = sm2(card, 0)
    }
    expect(card.easeFactor).toBe(SM2_MIN_EASE)
  })

  it('nextReview = now + interval days', () => {
    const now = Date.now()
    const result = sm2(fresh(), 5)
    expect(result.nextReview).toBe(now + 1 * 24 * 60 * 60 * 1000)
  })
})
