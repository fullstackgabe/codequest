import type { Course } from '@/types/course'
import { NODE_SVG } from '../brandIcons'
import helloLesson from './lessons/fundamentos-hello'

const nodeCourse: Course = {
  id: 'node',
  title: 'Node.js',
  description: 'Runtime JavaScript no servidor — eventos, módulos e I/O não-bloqueante.',
  icon: NODE_SVG,
  color: '#43853d',
  docUrl: 'https://nodejs.org/en/learn',
  modules: [
    {
      id: 'fundamentos',
      title: 'Fundamentos',
      icon: '🧱',
      description: 'Primeiros passos: rodar um script, console.log, módulos.',
      color: '#43853d',
      lessons: [helloLesson],
    },
  ],
}

export default nodeCourse
