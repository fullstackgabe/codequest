import type { Course } from '@/types/course'

const stubCourse: Course = {
  id: 'stub',
  title: 'Curso Stub',
  description: 'Curso de exemplo usado durante o desenvolvimento. Será removido em F9.',
  icon: '🧪',
  color: '#8b5cf6',
  modules: [
    {
      id: 'intro',
      title: 'Introdução',
      icon: '🚀',
      description: 'Primeiros passos no curso stub.',
      color: '#8b5cf6',
      lessons: [
        {
          id: 'stub/intro/hello-world',
          courseId: 'stub',
          moduleId: 'intro',
          title: 'Hello World',
          icon: '👋',
          xpReward: 30,
          theory: [
            {
              tag: 'hello-world',
              title: 'O primeiro programa',
              body: 'Todo curso começa com um Hello World. É um ritual.',
              code: 'console.log("Hello, World!")',
            },
          ],
          flashcards: [
            {
              id: 'stub/intro/hello-world/fc-1',
              front: 'Qual a função usada pra imprimir no console?',
              back: 'console.log()',
              requires: ['hello-world'],
            },
          ],
          challenges: [
            {
              id: 'stub/intro/hello-world/ch-1',
              type: 'fill-blank',
              title: 'Imprima Hello, World',
              description: 'Complete o código para imprimir a saudação.',
              xpReward: 20,
              requires: ['hello-world'],
              solution: 'console.log("Hello, World!")',
              template: '___.log("Hello, World!")',
              blanks: ['console'],
            },
          ],
        },
        {
          id: 'stub/intro/variables',
          courseId: 'stub',
          moduleId: 'intro',
          title: 'Variáveis',
          icon: '📦',
          xpReward: 30,
          theory: [
            {
              tag: 'variables',
              title: 'Variáveis guardam dados',
              body: 'Em JS, use `let` para variáveis mutáveis e `const` para constantes.',
              code: 'const name = "Code Quest"\nlet count = 0',
            },
          ],
          flashcards: [
            {
              id: 'stub/intro/variables/fc-1',
              front: 'Qual keyword usar para valores que não mudam?',
              back: '`const` — porque garante imutabilidade da referência.',
              requires: ['variables'],
            },
          ],
          challenges: [
            {
              id: 'stub/intro/variables/ch-1',
              type: 'write-from-scratch',
              title: 'Declare uma constante',
              description: 'Declare uma constante chamada `name` com o valor "Code Quest".',
              xpReward: 30,
              requires: ['variables'],
              solution: 'const name = "Code Quest"',
            },
          ],
        },
      ],
    },
  ],
}

export default stubCourse
