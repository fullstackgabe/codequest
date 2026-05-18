export interface Flashcard {
  id: string
  front: string
  back: string
  code?: string
  requires: string[]
  lessonId?: string
  moduleId?: string
  courseId?: string
  lessonTitle?: string
}
