import type { Course } from '@/types/course'
import { LARAVEL_SVG } from '../brandIcons'
import helloLesson from './lessons/fundamentos-hello'

const laravelCourse: Course = {
  id: 'laravel',
  title: 'Laravel',
  description: 'Framework PHP full-stack — rotas, controllers, Eloquent e Blade.',
  icon: LARAVEL_SVG,
  color: '#FF2D20',
  docUrl: 'https://laravel.com/docs',
  modules: [
    {
      id: 'fundamentos',
      title: 'Fundamentos',
      icon: '🧱',
      description: 'Roteamento básico, closures e controllers.',
      color: '#FF2D20',
      lessons: [helloLesson],
    },
  ],
}

export default laravelCourse
