import type { Course } from '@/types/course'
import { BOAS_PRATICAS_SVG } from '../brandIcons'
import principiosFundamentos from './lessons/principios-fundamentos'

const boasPraticasCourse: Course = {
  id: 'boas-praticas',
  title: 'Boas Práticas',
  description: 'DRY, KISS, YAGNI, SOLID, Clean Code, Design Patterns e testes.',
  icon: BOAS_PRATICAS_SVG,
  color: '#7C3AED',
  docUrl: 'https://en.wikipedia.org/wiki/SOLID',
  modules: [
    {
      id: 'principios',
      title: 'Princípios',
      icon: '📐',
      description: 'Fundamentos universais: DRY, KISS, YAGNI.',
      color: '#7C3AED',
      lessons: [principiosFundamentos],
    },
  ],
}

export default boasPraticasCourse
