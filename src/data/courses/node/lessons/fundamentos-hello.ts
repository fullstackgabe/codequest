import type { Lesson } from '@/types/lesson'

const helloLesson: Lesson = {
  id: 'node/fundamentos/hello',
  courseId: 'node',
  moduleId: 'fundamentos',
  title: 'Hello, Node',
  icon: '👋',
  xpReward: 30,
  docUrl: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',

  theory: [
    {
      tag: 'node-intro',
      title: 'O que é Node.js',
      body: `Node.js é um runtime JavaScript construído sobre a engine V8 do Chrome.
Roda JS fora do navegador — no servidor, em CLIs, em build tools.
Tudo é orientado a eventos e não-bloqueante por padrão.`,
      code: `// hello.js
console.log('Olá do Node!')

// terminal
// $ node hello.js
// Olá do Node!`,
    },
    {
      tag: 'node-modules',
      title: 'Módulos: CommonJS vs ESM',
      body: `Node suporta dois sistemas de módulo.
CommonJS usa require()/module.exports (legado, ainda comum).
ESM usa import/export (padrão moderno; requer "type": "module" no package.json).`,
      code: `// CommonJS
const fs = require('fs')
module.exports = { ola: () => 'oi' }

// ESM
import fs from 'node:fs'
export const ola = () => 'oi'`,
    },
  ],

  flashcards: [
    {
      id: 'node/fundamentos/hello/fc-1',
      front: 'O que é Node.js em uma frase?',
      back: `Um runtime que executa JavaScript fora do navegador,
sobre a engine V8, com I/O orientado a eventos e não-bloqueante.`,
      requires: ['node-intro'],
    },
    {
      id: 'node/fundamentos/hello/fc-2',
      front: 'Qual a diferença entre CommonJS e ESM?',
      back: `CommonJS: require()/module.exports, síncrono, padrão antigo.
ESM: import/export, assíncrono no carregamento, padrão moderno
(precisa de "type": "module" no package.json ou extensão .mjs).`,
      code: `// CommonJS
const x = require('x')

// ESM
import x from 'x'`,
      requires: ['node-modules'],
    },
  ],

  challenges: [
    {
      id: 'node/fundamentos/hello/ch-1',
      type: 'fill-blank',
      title: 'Primeiro log',
      description: 'Imprima "Olá do Node!" no terminal.',
      xpReward: 20,
      requires: ['node-intro'],
      template: `// hello.js
___.log('Olá do Node!')`,
      blanks: ['console'],
      solution: `// hello.js
console.log('Olá do Node!')`,
      hint: 'O objeto global `console` tem o método .log().',
    },
  ],
}

export default helloLesson
