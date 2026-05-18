import type { TheoryBlock } from './theory'
import type { Flashcard } from './flashcard'
import type { Challenge } from './challenge'

export interface Lesson {
  id: string
  courseId: string
  moduleId: string
  title: string
  icon: string
  xpReward: number
  docUrl?: string
  theory: TheoryBlock[]
  flashcards: Flashcard[]
  challenges: Challenge[]
}
