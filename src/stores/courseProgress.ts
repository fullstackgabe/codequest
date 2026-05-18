import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loadJSON, removeKey, saveJSON } from '@/utils/storage'
import { getCourse } from '@/data/courses'

const STORAGE_KEY = 'codequest_course_progress'

export interface CourseProgress {
  completedLessons: string[]
  completedChallenges: string[]
  completedModules: string[]
}

export type CourseProgressMap = Record<string, CourseProgress>

export interface CourseStats {
  totalLessons: number
  totalChallenges: number
  totalModules: number
  completedLessons: number
  completedChallenges: number
  completedModules: number
  percentComplete: number
}

function emptyBucket(): CourseProgress {
  return {
    completedLessons: [],
    completedChallenges: [],
    completedModules: [],
  }
}

export const useCourseProgressStore = defineStore('courseProgress', () => {
  const coursesProgress = ref<CourseProgressMap>(
    loadJSON<CourseProgressMap>(STORAGE_KEY, {}),
  )

  function persist(): void {
    saveJSON(STORAGE_KEY, coursesProgress.value)
  }

  function ensureBucket(courseId: string): CourseProgress {
    let bucket = coursesProgress.value[courseId]
    if (!bucket) {
      bucket = emptyBucket()
      coursesProgress.value[courseId] = bucket
    }
    return bucket
  }

  function completeLesson(courseId: string, lessonId: string): boolean {
    const bucket = ensureBucket(courseId)
    if (bucket.completedLessons.includes(lessonId)) return false
    bucket.completedLessons.push(lessonId)
    persist()
    return true
  }

  function completeChallenge(courseId: string, challengeId: string): boolean {
    const bucket = ensureBucket(courseId)
    if (bucket.completedChallenges.includes(challengeId)) return false
    bucket.completedChallenges.push(challengeId)
    persist()
    return true
  }

  function completeModule(courseId: string, moduleId: string): boolean {
    const bucket = ensureBucket(courseId)
    if (bucket.completedModules.includes(moduleId)) return false
    bucket.completedModules.push(moduleId)
    persist()
    return true
  }

  function isLessonComplete(courseId: string, lessonId: string): boolean {
    return (
      coursesProgress.value[courseId]?.completedLessons.includes(lessonId) ?? false
    )
  }

  function isChallengeComplete(courseId: string, challengeId: string): boolean {
    return (
      coursesProgress.value[courseId]?.completedChallenges.includes(challengeId) ??
      false
    )
  }

  function isModuleComplete(courseId: string, moduleId: string): boolean {
    return (
      coursesProgress.value[courseId]?.completedModules.includes(moduleId) ?? false
    )
  }

  function getCourseStats(courseId: string): CourseStats {
    const course = getCourse(courseId)
    const bucket = coursesProgress.value[courseId] ?? emptyBucket()

    if (!course) {
      return {
        totalLessons: 0,
        totalChallenges: 0,
        totalModules: 0,
        completedLessons: bucket.completedLessons.length,
        completedChallenges: bucket.completedChallenges.length,
        completedModules: bucket.completedModules.length,
        percentComplete: 0,
      }
    }

    let totalLessons = 0
    let totalChallenges = 0
    const totalModules = course.modules.length

    for (const mod of course.modules) {
      totalLessons += mod.lessons.length
      for (const lesson of mod.lessons) {
        totalChallenges += lesson.challenges.length
      }
    }

    const percentComplete =
      totalLessons === 0
        ? 0
        : Math.round((bucket.completedLessons.length / totalLessons) * 100)

    return {
      totalLessons,
      totalChallenges,
      totalModules,
      completedLessons: bucket.completedLessons.length,
      completedChallenges: bucket.completedChallenges.length,
      completedModules: bucket.completedModules.length,
      percentComplete,
    }
  }

  function reset(): void {
    coursesProgress.value = {}
    removeKey(STORAGE_KEY)
  }

  return {
    coursesProgress,
    completeLesson,
    completeChallenge,
    completeModule,
    isLessonComplete,
    isChallengeComplete,
    isModuleComplete,
    getCourseStats,
    reset,
  }
})
