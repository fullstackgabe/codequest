import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAwardActivity } from '../useAwardActivity'
import { useCourseProgressStore } from '@/stores/courseProgress'
import { useXPStore } from '@/stores/xp'
import { useSRSStore } from '@/stores/srs'
import { useStreakStore } from '@/stores/streak'
import { XP_REWARDS } from '@/utils/xpRewards'

describe('useAwardActivity', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('completeLesson (first time) triggers all 4 side effects', () => {
    const award = useAwardActivity()
    const xp = useXPStore()
    const srs = useSRSStore()
    const streak = useStreakStore()
    const cp = useCourseProgressStore()

    const result = award.completeLesson('vue', 'vue/reactivity/ref')

    expect(result.awarded).toBe(true)
    expect(cp.isLessonComplete('vue', 'vue/reactivity/ref')).toBe(true)
    expect(xp.xp).toBe(XP_REWARDS.LESSON_COMPLETE)
    expect(streak.streakDays).toBeGreaterThan(0)
    expect(srs.getCard('vue', 'vue/reactivity/ref/fc-1')).not.toBeNull()
  })

  it('completeLesson (second time) does not re-award', () => {
    const award = useAwardActivity()
    const xp = useXPStore()
    award.completeLesson('vue', 'vue/reactivity/ref')
    const xpAfterFirst = xp.xp

    const result = award.completeLesson('vue', 'vue/reactivity/ref')
    expect(result.awarded).toBe(false)
    expect(xp.xp).toBe(xpAfterFirst) // no extra XP
  })

  it('completeChallenge firstTry awards CHALLENGE_FIRST_TRY', () => {
    const award = useAwardActivity()
    const xp = useXPStore()
    const result = award.completeChallenge('vue', 'vue/reactivity/ref/ch-1', true)
    expect(result.awarded).toBe(true)
    expect(xp.xp).toBe(XP_REWARDS.CHALLENGE_FIRST_TRY)
  })

  it('completeChallenge not-firstTry awards CHALLENGE_COMPLETE', () => {
    const award = useAwardActivity()
    const xp = useXPStore()
    const result = award.completeChallenge('vue', 'vue/reactivity/ref/ch-1', false)
    expect(result.awarded).toBe(true)
    expect(xp.xp).toBe(XP_REWARDS.CHALLENGE_COMPLETE)
  })

  it('completeChallenge replay does not re-award', () => {
    const award = useAwardActivity()
    const xp = useXPStore()
    award.completeChallenge('vue', 'vue/reactivity/ref/ch-1', true)
    const xpAfterFirst = xp.xp
    const result = award.completeChallenge('vue', 'vue/reactivity/ref/ch-1', false)
    expect(result.awarded).toBe(false)
    expect(xp.xp).toBe(xpAfterFirst)
  })

  it('completeLesson for unknown lesson returns awarded=false', () => {
    const award = useAwardActivity()
    const xp = useXPStore()
    const result = award.completeLesson('vue', 'vue/nope/missing')
    expect(result.awarded).toBe(false)
    expect(xp.xp).toBe(0)
  })
})
