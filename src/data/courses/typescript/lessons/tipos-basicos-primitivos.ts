import type { Lesson } from '@/types/lesson'

const primitivosLesson: Lesson = {
  id: 'typescript/tipos-basicos/primitivos',
  courseId: 'typescript',
  moduleId: 'tipos-basicos',
  title: 'Tipos primitivos',
  icon: '🔤',
  xpReward: 30,
  docUrl: 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html',

  theory: [
    {
      tag: 'ts-primitivos',
      title: 'string, number, boolean',
      body: `TypeScript adiciona tipos estáticos ao JavaScript.
Os primitivos básicos são string, number e boolean — mesmos do JS, agora verificados em tempo de compilação.
Anote tipos depois do nome da variável com :tipo.`,
      code: `let nome: string = 'Ana'
let idade: number = 30
let ativo: boolean = true

// erro: Type 'number' is not assignable to type 'string'
// nome = 42`,
    },
    {
      tag: 'ts-inferencia',
      title: 'Inferência de tipo',
      body: `Quando você inicializa uma variável, TS infere o tipo automaticamente.
Não precisa anotar em casos óbvios — código mais limpo, mesma segurança.
Anote quando o tipo não puder ser inferido ou quando quiser ser explícito.`,
      code: `// inferido como string
let nome = 'Ana'

// inferido como number
let idade = 30

// anotar quando inicia vazio
let lista: string[] = []`,
    },
  ],

  flashcards: [
    {
      id: 'typescript/tipos-basicos/primitivos/fc-1',
      front: 'Quais são os 3 tipos primitivos principais do TS?',
      back: `string, number e boolean.
Mesmos do JS, mas verificados estaticamente pelo compilador.`,
      requires: ['ts-primitivos'],
    },
    {
      id: 'typescript/tipos-basicos/primitivos/fc-2',
      front: 'Quando posso omitir a anotação de tipo?',
      back: `Quando o valor inicial já deixa o tipo claro — o TS infere.
Anote quando inicia vazio (ex: [], null) ou quer documentar o contrato.`,
      code: `let nome = 'Ana'         // inferido: string
let lista: string[] = []  // anotado: vazio`,
      requires: ['ts-inferencia'],
    },
  ],

  challenges: [
    {
      id: 'typescript/tipos-basicos/primitivos/ch-1',
      type: 'fill-blank',
      title: 'Anote os primitivos',
      description: 'Anote `nome` como string, `idade` como number e `ativo` como boolean.',
      xpReward: 20,
      requires: ['ts-primitivos'],
      template: `let nome: ___ = 'Ana'
let idade: ___ = 30
let ativo: ___ = true`,
      blanks: ['string', 'number', 'boolean'],
      solution: `let nome: string = 'Ana'
let idade: number = 30
let ativo: boolean = true`,
      hint: 'Os 3 primitivos têm nomes em minúsculo: string, number, boolean.',
    },
  ],
}

export default primitivosLesson
