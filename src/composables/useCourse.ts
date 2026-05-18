import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { Course } from '@/types/course'
import { getCourse } from '@/data/courses'

export interface UseCourseReturn {
  course: ComputedRef<Course | null>
  notFound: ComputedRef<boolean>
}

export function useCourse(courseIdRef: MaybeRefOrGetter<string>): UseCourseReturn {
  const course = computed<Course | null>(() => getCourse(toValue(courseIdRef)))
  const notFound = computed(() => course.value === null)
  return { course, notFound }
}
