import { useCourseProgressStore } from '@/stores/courseProgress'
import { useXPStore } from '@/stores/xp'
import type { AddXPResult } from '@/stores/xp'
import { useStreakStore } from '@/stores/streak'
import { useSRSStore } from '@/stores/srs'
import { getLesson } from '@/data/courses'
import { XP_REWARDS } from '@/utils/xpRewards'
// XP_REWARDS used by completeChallenge; completeLesson awards no XP.

export interface AwardResult {
  awarded: boolean
  xpResult: AddXPResult
}

const NOOP_XP: AddXPResult = { levelUp: false }

export function useAwardActivity() {
  const courseProgress = useCourseProgressStore()
  const xp = useXPStore()
  const streak = useStreakStore()
  const srs = useSRSStore()

  // Lesson completion no longer awards XP — only challenges do (the user's rule).
  // This still registers flashcards in SRS and bumps the streak.
  function completeLesson(courseId: string, lessonId: string): AwardResult {
    const lesson = getLesson(lessonId)
    if (!lesson) return { awarded: false, xpResult: NOOP_XP }

    const wasNew = courseProgress.completeLesson(courseId, lessonId)
    if (!wasNew) return { awarded: false, xpResult: NOOP_XP }

    streak.updateStreak()
    for (const card of lesson.flashcards) {
      srs.registerCard(courseId, card.id)
    }
    return { awarded: true, xpResult: NOOP_XP }
  }

  function completeChallenge(
    courseId: string,
    challengeId: string,
    firstTry: boolean,
  ): AwardResult {
    const wasNew = courseProgress.completeChallenge(courseId, challengeId)
    if (!wasNew) return { awarded: false, xpResult: NOOP_XP }

    const amount = firstTry
      ? XP_REWARDS.CHALLENGE_FIRST_TRY
      : XP_REWARDS.CHALLENGE_COMPLETE
    const xpResult = xp.addXP(amount)
    streak.updateStreak()
    return { awarded: true, xpResult }
  }

  return { completeLesson, completeChallenge }
}
