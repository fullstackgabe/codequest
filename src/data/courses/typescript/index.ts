import type { Course } from '@/types/course'
import { TYPESCRIPT_SVG } from '../brandIcons'
import primitivosLesson from './lessons/tipos-basicos-primitivos'

const typescriptCourse: Course = {
  id: 'typescript',
  title: 'TypeScript',
  description: 'Tipos estáticos sobre JavaScript — segurança em tempo de compilação.',
  icon: TYPESCRIPT_SVG,
  color: '#3178c6',
  docUrl: 'https://www.typescriptlang.org/docs/',
  modules: [
    {
      id: 'tipos-basicos',
      title: 'Tipos Básicos',
      icon: '🔤',
      description: 'string, number, boolean e inferência de tipo.',
      color: '#3178c6',
      lessons: [primitivosLesson],
    },
  ],
}

export default typescriptCourse
