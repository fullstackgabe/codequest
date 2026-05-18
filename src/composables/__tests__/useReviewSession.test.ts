import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { SESSION_LIMIT, useReviewSession } from '../useReviewSession'
import { useSRSStore } from '@/stores/srs'
import { useXPStore } from '@/stores/xp'
import { XP_REWARDS } from '@/utils/xpRewards'

describe('useReviewSession', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  function registerStubCards() {
    const srs = useSRSStore()
    // Stub course has 2 flashcards
    srs.registerCard('vue', 'vue/reactivity/ref/fc-1')
    srs.registerCard('vue', 'vue/reactivity/ref/fc-2')
  }

  it('returns null currentCard when there are no due cards', () => {
    const session = useReviewSession('vue')
    expect(session.currentCard.value).toBeNull()
    expect(session.progress.value.total).toBe(0)
    expect(session.isFinished.value).toBe(false)
  })

  it('snapshots up to SESSION_LIMIT due cards', () => {
    registerStubCards()
    const session = useReviewSession('vue')
    expect(session.progress.value.total).toBeGreaterThan(0)
    expect(session.progress.value.total).toBeLessThanOrEqual(SESSION_LIMIT)
    expect(session.currentCard.value?.id).toBe('vue/reactivity/ref/fc-1')
  })

  it('rate(5) awards REVIEW_PERFECT XP, updates stats, advances cursor', () => {
    registerStubCards()
    const xp = useXPStore()
    const session = useReviewSession('vue')
    const before = session.progress.value.index

    session.rate(5)

    expect(xp.xp).toBe(XP_REWARDS.REVIEW_PERFECT)
    expect(session.sessionStats.value.perfect).toBe(1)
    expect(session.progress.value.index).toBe(before + 1)
  })

  it('rate(0) awards no XP, increments fail count', () => {
    registerStubCards()
    const xp = useXPStore()
    const session = useReviewSession('vue')

    session.rate(0)

    expect(xp.xp).toBe(0)
    expect(session.sessionStats.value.fail).toBe(1)
  })

  it('isFinished becomes true after rating all cards', () => {
    registerStubCards()
    const session = useReviewSession('vue')
    const total = session.progress.value.total
    for (let i = 0; i < total; i++) {
      session.rate(5)
    }
    expect(session.isFinished.value).toBe(true)
    expect(session.currentCard.value).toBeNull()
  })

  it('restart rebuilds the snapshot and resets stats', () => {
    registerStubCards()
    const session = useReviewSession('vue')
    session.rate(5)
    expect(session.sessionStats.value.perfect).toBe(1)

    session.restart()
    expect(session.sessionStats.value.perfect).toBe(0)
    expect(session.progress.value.index).toBe(0)
  })
})
