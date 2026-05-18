import type { Course } from '@/types/course'
import type { Module } from '@/types/module'
import type { Lesson } from '@/types/lesson'
import type { Flashcard } from '@/types/flashcard'
import type { Challenge } from '@/types/challenge'

import stubCourse from './stub'

// Adding a new course:
// 1. Create src/data/courses/<id>/index.ts that default-exports a `Course`
// 2. Add an import here and append to `courses` below
const courses: Course[] = [stubCourse]

// Warn (DEV only) about duplicate course IDs — first registration wins.
if (import.meta.env?.DEV) {
  const seen = new Set<string>()
  for (const c of courses) {
    if (seen.has(c.id)) {
      console.warn(`[course-registry] Duplicate course id: "${c.id}". First wins.`)
    }
    seen.add(c.id)
  }
}

function augmentFlashcards(): Flashcard[] {
  const out: Flashcard[] = []
  for (const course of courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        for (const fc of lesson.flashcards) {
          out.push({
            ...fc,
            courseId: course.id,
            moduleId: mod.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
          })
        }
      }
    }
  }
  return out
}

function augmentChallenges(): Challenge[] {
  const out: Challenge[] = []
  for (const course of courses) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        for (const ch of lesson.challenges) {
          // Spread is type-safe because we only set augmentation fields (no type narrowing change).
          out.push({
            ...ch,
            courseId: course.id,
            moduleId: mod.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
          })
        }
      }
    }
  }
  return out
}

const augmentedFlashcards = augmentFlashcards()
const augmentedChallenges = augmentChallenges()

export function listCourses(): Course[] {
  return courses
}

export function getCourse(courseId: string): Course | null {
  return courses.find((c) => c.id === courseId) ?? null
}

export function getModule(courseId: string, moduleId: string): Module | null {
  const course = getCourse(courseId)
  if (!course) return null
  return course.modules.find((m) => m.id === moduleId) ?? null
}

export function getLesson(lessonId: string): Lesson | null {
  // Format: 'courseId/moduleId/slug' — slug may contain extra segments,
  // but the first 2 are always courseId/moduleId, and the full string is the lesson id.
  const parts = lessonId.split('/')
  if (parts.length < 3) return null
  const courseId = parts[0]
  const moduleId = parts[1]
  if (!courseId || !moduleId) return null
  const mod = getModule(courseId, moduleId)
  if (!mod) return null
  return mod.lessons.find((l) => l.id === lessonId) ?? null
}

export function getAllFlashcards(): Flashcard[] {
  return augmentedFlashcards
}

export function getAllChallenges(): Challenge[] {
  return augmentedChallenges
}
