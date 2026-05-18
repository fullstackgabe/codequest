interface ChallengeBase {
  id: string
  title: string
  description: string
  xpReward: number
  requires: string[]
  solution: string
  hint?: string
  explanation?: string
  lessonId?: string
  moduleId?: string
  courseId?: string
  lessonTitle?: string
}

export interface FillBlankChallenge extends ChallengeBase {
  type: 'fill-blank'
  template: string
  blanks: string[]
}

export interface WriteFromScratchChallenge extends ChallengeBase {
  type: 'write-from-scratch'
  template?: string
}

export interface FixBugChallenge extends ChallengeBase {
  type: 'fix-bug'
  buggyCode: string
}

export type Challenge =
  | FillBlankChallenge
  | WriteFromScratchChallenge
  | FixBugChallenge

export type ChallengeType = Challenge['type']
