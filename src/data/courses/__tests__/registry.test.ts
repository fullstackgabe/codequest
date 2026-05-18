import { describe, expect, it } from 'vitest'
import {
  getAllChallenges,
  getAllFlashcards,
  getCourse,
  getLesson,
  getModule,
  listCourses,
} from '../index'

describe('course registry', () => {
  it('listCourses includes the vue course', () => {
    const courses = listCourses()
    expect(courses.length).toBeGreaterThanOrEqual(1)
    expect(courses.some((c) => c.id === 'vue')).toBe(true)
  })

  it('getCourse returns the course or null', () => {
    expect(getCourse('vue')?.id).toBe('vue')
    expect(getCourse('nonexistent')).toBeNull()
  })

  it('getModule resolves a module within a course', () => {
    expect(getModule('vue', 'reactivity')?.id).toBe('reactivity')
    expect(getModule('vue', 'missing')).toBeNull()
    expect(getModule('missing', 'reactivity')).toBeNull()
  })

  it('getLesson parses courseId/moduleId/slug and returns the lesson', () => {
    const lesson = getLesson('vue/reactivity/ref')
    expect(lesson?.id).toBe('vue/reactivity/ref')
    expect(lesson?.courseId).toBe('vue')
    expect(lesson?.moduleId).toBe('reactivity')
  })

  it('getLesson returns null for malformed or unknown ids', () => {
    expect(getLesson('malformed')).toBeNull()
    expect(getLesson('stub/intro')).toBeNull() // too short
    expect(getLesson('stub/intro/nope')).toBeNull() // unknown slug
    expect(getLesson('xxx/intro/hello-world')).toBeNull() // unknown course
  })

  it('getAllFlashcards augments each card with course/module/lesson ids and title', () => {
    const cards = getAllFlashcards()
    expect(cards.length).toBeGreaterThan(0)
    const helloCard = cards.find((c) => c.id === 'vue/reactivity/ref/fc-1')
    expect(helloCard).toBeDefined()
    expect(helloCard?.courseId).toBe('vue')
    expect(helloCard?.moduleId).toBe('reactivity')
    expect(helloCard?.lessonId).toBe('vue/reactivity/ref')
    expect(helloCard?.lessonTitle).toBe('ref()')
  })

  it('getAllChallenges augments each challenge similarly', () => {
    const challenges = getAllChallenges()
    expect(challenges.length).toBeGreaterThan(0)
    const ch = challenges.find((c) => c.id === 'vue/reactivity/ref/ch-1')
    expect(ch).toBeDefined()
    expect(ch?.courseId).toBe('vue')
    expect(ch?.lessonTitle).toBe('ref()')
  })
})
