import type { Course } from '@/types/course'

const javascriptCourse: Course = {
  id: 'javascript',
  title: 'JavaScript',
  description: 'Fundamentos modernos de JavaScript — sintaxe, escopo, async e ES6+.',
  icon: '🟨',
  color: '#f7df1e',
  docUrl: 'https://developer.mozilla.org/docs/Web/JavaScript',
  modules: [
    {
      id: 'basics',
      title: 'Fundamentos',
      icon: '📐',
      description: 'Variáveis, tipos primitivos e operadores básicos.',
      color: '#f7df1e',
      lessons: [
        {
          id: 'javascript/basics/let-const',
          courseId: 'javascript',
          moduleId: 'basics',
          title: 'let, const e var',
          icon: '🔤',
          xpReward: 30,
          docUrl:
            'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/let',
          theory: [
            {
              tag: 'let-const-block',
              title: 'Escopo de bloco',
              body: `\`let\` e \`const\` têm escopo de bloco — só existem dentro do { ... }
em que foram declarados.
\`var\` tem escopo de função (legado, evite).`,
              code: `{
  const dentro = 1
  let tambemDentro = 2
}
// dentro e tambemDentro não existem aqui`,
            },
            {
              tag: 'const-immutable-ref',
              title: 'const = referência imutável',
              body: `\`const\` impede reatribuir a variável.
Não impede mutar propriedades de objetos/arrays.`,
              code: `const lista = []
lista.push(1)      // ✅ ok — mutação
// lista = [1]      ❌ TypeError`,
            },
          ],
          flashcards: [
            {
              id: 'javascript/basics/let-const/fc-1',
              front: 'Diferença principal entre `let` e `const`?',
              back: '`let` permite reatribuir; `const` não — embora propriedades mutáveis sigam mutáveis.',
              code: `let a = 1; a = 2          // ok
const b = 1; b = 2        // ❌ TypeError`,
              requires: ['const-immutable-ref'],
            },
          ],
          challenges: [
            {
              id: 'javascript/basics/let-const/ch-1',
              type: 'fill-blank',
              title: 'Escolha a keyword certa',
              description: 'Use a keyword apropriada: `total` é fixo; `acumulado` muda a cada iteração.',
              xpReward: 20,
              requires: ['const-immutable-ref'],
              template: `___ total = 100
___ acumulado = 0
for (___ i = 0; i < 3; i++) {
  acumulado += total
}`,
              blanks: ['const', 'let', 'let'],
              solution: `const total = 100
let acumulado = 0
for (let i = 0; i < 3; i++) {
  acumulado += total
}`,
              hint: 'Variáveis que nunca recebem novo valor: const. Variáveis que mudam (incluindo o `i` do for): let.',
            },
          ],
        },
      ],
    },
    {
      id: 'functions',
      title: 'Funções',
      icon: '🪝',
      description: 'Declaração, expressão, arrow e closures.',
      color: '#f7df1e',
      lessons: [],
    },
    {
      id: 'async',
      title: 'Async & Promises',
      icon: '⏳',
      description: 'async/await, Promises e o event loop.',
      color: '#f7df1e',
      lessons: [],
    },
  ],
}

export default javascriptCourse
