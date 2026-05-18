import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCourseProgressStore } from '../courseProgress'

describe('courseProgress store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('completeLesson is idempotent (returns false on second call)', () => {
    const s = useCourseProgressStore()
    expect(s.completeLesson('vue', 'vue/reactivity/ref')).toBe(true)
    expect(s.completeLesson('vue', 'vue/reactivity/ref')).toBe(false)
    expect(s.isLessonComplete('vue', 'vue/reactivity/ref')).toBe(true)
  })

  it('progress is namespaced per course', () => {
    const s = useCourseProgressStore()
    s.completeLesson('vue', 'vue/reactivity/ref')
    expect(s.isLessonComplete('vue', 'vue/reactivity/ref')).toBe(true)
    expect(s.isLessonComplete('other-course', 'vue/reactivity/ref')).toBe(false)
  })

  it('completeChallenge and completeModule are also namespaced + idempotent', () => {
    const s = useCourseProgressStore()
    expect(s.completeChallenge('vue', 'ch-1')).toBe(true)
    expect(s.completeChallenge('vue', 'ch-1')).toBe(false)
    expect(s.isChallengeComplete('vue', 'ch-1')).toBe(true)
    expect(s.isChallengeComplete('other', 'ch-1')).toBe(false)

    expect(s.completeModule('vue', 'reactivity')).toBe(true)
    expect(s.completeModule('vue', 'reactivity')).toBe(false)
    expect(s.isModuleComplete('vue', 'reactivity')).toBe(true)
  })

  it('persists across reinstantiation', () => {
    const a = useCourseProgressStore()
    a.completeLesson('vue', 'vue/reactivity/ref')
    setActivePinia(createPinia())
    const b = useCourseProgressStore()
    expect(b.isLessonComplete('vue', 'vue/reactivity/ref')).toBe(true)
  })

  it('getCourseStats reports totals from registry and counts from store', () => {
    const s = useCourseProgressStore()
    const fresh = s.getCourseStats('vue')
    expect(fresh.totalLessons).toBeGreaterThan(0)
    expect(fresh.totalChallenges).toBeGreaterThan(0)
    expect(fresh.totalModules).toBe(5)
    expect(fresh.percentComplete).toBe(0)

    s.completeLesson('vue', 'vue/reactivity/ref')
    const partial = s.getCourseStats('vue')
    expect(partial.completedLessons).toBe(1)
    expect(partial.percentComplete).toBeGreaterThan(0)
    expect(partial.percentComplete).toBeLessThanOrEqual(100)
  })

  it('getCourseStats for unknown course returns zero totals', () => {
    const s = useCourseProgressStore()
    const stats = s.getCourseStats('does-not-exist')
    expect(stats.totalLessons).toBe(0)
    expect(stats.totalChallenges).toBe(0)
    expect(stats.totalModules).toBe(0)
    expect(stats.percentComplete).toBe(0)
  })

  it('reset clears all course progress and removes storage', () => {
    const s = useCourseProgressStore()
    s.completeLesson('vue', 'vue/reactivity/ref')
    s.completeChallenge('vue', 'ch-1')
    s.reset()
    expect(s.isLessonComplete('vue', 'vue/reactivity/ref')).toBe(false)
    expect(s.isChallengeComplete('vue', 'ch-1')).toBe(false)
    expect(localStorage.getItem('codequest_course_progress')).toBeNull()
  })
})
