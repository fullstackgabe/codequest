import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { Course } from '@/types/course'
import type { Module } from '@/types/module'
import type { Lesson } from '@/types/lesson'
import { getCourse, getLesson, getModule } from '@/data/courses'

export interface UseLessonReturn {
  lesson: ComputedRef<Lesson | null>
  module: ComputedRef<Module | null>
  course: ComputedRef<Course | null>
  notFound: ComputedRef<boolean>
}

export function useLesson(
  lessonIdRef: MaybeRefOrGetter<string>,
): UseLessonReturn {
  const lesson = computed<Lesson | null>(() =>
    getLesson(toValue(lessonIdRef)),
  )
  const module = computed<Module | null>(() => {
    const l = lesson.value
    return l ? getModule(l.courseId, l.moduleId) : null
  })
  const course = computed<Course | null>(() => {
    const l = lesson.value
    return l ? getCourse(l.courseId) : null
  })
  const notFound = computed(() => lesson.value === null)

  return { lesson, module, course, notFound }
}
