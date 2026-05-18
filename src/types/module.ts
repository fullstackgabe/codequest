import type { Lesson } from './lesson'

export interface Module {
  id: string
  title: string
  icon: string
  description: string
  color: string
  lessons: Lesson[]
}
