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
    expect(s.completeLesson('stub', 'stub/intro/hello-world')).toBe(true)
    expect(s.completeLesson('stub', 'stub/intro/hello-world')).toBe(false)
    expect(s.isLessonComplete('stub', 'stub/intro/hello-world')).toBe(true)
  })

  it('progress is namespaced per course', () => {
    const s = useCourseProgressStore()
    s.completeLesson('stub', 'stub/intro/hello-world')
    expect(s.isLessonComplete('stub', 'stub/intro/hello-world')).toBe(true)
    expect(s.isLessonComplete('other-course', 'stub/intro/hello-world')).toBe(false)
  })

  it('completeChallenge and completeModule are also namespaced + idempotent', () => {
    const s = useCourseProgressStore()
    expect(s.completeChallenge('stub', 'ch-1')).toBe(true)
    expect(s.completeChallenge('stub', 'ch-1')).toBe(false)
    expect(s.isChallengeComplete('stub', 'ch-1')).toBe(true)
    expect(s.isChallengeComplete('other', 'ch-1')).toBe(false)

    expect(s.completeModule('stub', 'intro')).toBe(true)
    expect(s.completeModule('stub', 'intro')).toBe(false)
    expect(s.isModuleComplete('stub', 'intro')).toBe(true)
  })

  it('persists across reinstantiation', () => {
    const a = useCourseProgressStore()
    a.completeLesson('stub', 'stub/intro/hello-world')
    setActivePinia(createPinia())
    const b = useCourseProgressStore()
    expect(b.isLessonComplete('stub', 'stub/intro/hello-world')).toBe(true)
  })

  it('getCourseStats reports totals from registry and counts from store', () => {
    const s = useCourseProgressStore()
    // stub course has 2 lessons, 2 challenges, 1 module
    const fresh = s.getCourseStats('stub')
    expect(fresh.totalLessons).toBe(2)
    expect(fresh.totalChallenges).toBe(2)
    expect(fresh.totalModules).toBe(1)
    expect(fresh.percentComplete).toBe(0)

    s.completeLesson('stub', 'stub/intro/hello-world')
    const half = s.getCourseStats('stub')
    expect(half.completedLessons).toBe(1)
    expect(half.percentComplete).toBe(50)
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
    s.completeLesson('stub', 'stub/intro/hello-world')
    s.completeChallenge('stub', 'ch-1')
    s.reset()
    expect(s.isLessonComplete('stub', 'stub/intro/hello-world')).toBe(false)
    expect(s.isChallengeComplete('stub', 'ch-1')).toBe(false)
    expect(localStorage.getItem('codequest_course_progress')).toBeNull()
  })
})
