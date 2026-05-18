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
  it('listCourses includes the stub course', () => {
    const courses = listCourses()
    expect(courses.length).toBeGreaterThanOrEqual(1)
    expect(courses.some((c) => c.id === 'stub')).toBe(true)
  })

  it('getCourse returns the course or null', () => {
    expect(getCourse('stub')?.id).toBe('stub')
    expect(getCourse('nonexistent')).toBeNull()
  })

  it('getModule resolves a module within a course', () => {
    expect(getModule('stub', 'intro')?.id).toBe('intro')
    expect(getModule('stub', 'missing')).toBeNull()
    expect(getModule('missing', 'intro')).toBeNull()
  })

  it('getLesson parses courseId/moduleId/slug and returns the lesson', () => {
    const lesson = getLesson('stub/intro/hello-world')
    expect(lesson?.id).toBe('stub/intro/hello-world')
    expect(lesson?.courseId).toBe('stub')
    expect(lesson?.moduleId).toBe('intro')
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
    const helloCard = cards.find((c) => c.id === 'stub/intro/hello-world/fc-1')
    expect(helloCard).toBeDefined()
    expect(helloCard?.courseId).toBe('stub')
    expect(helloCard?.moduleId).toBe('intro')
    expect(helloCard?.lessonId).toBe('stub/intro/hello-world')
    expect(helloCard?.lessonTitle).toBe('Hello World')
  })

  it('getAllChallenges augments each challenge similarly', () => {
    const challenges = getAllChallenges()
    expect(challenges.length).toBeGreaterThan(0)
    const ch = challenges.find((c) => c.id === 'stub/intro/hello-world/ch-1')
    expect(ch).toBeDefined()
    expect(ch?.courseId).toBe('stub')
    expect(ch?.lessonTitle).toBe('Hello World')
  })
})
