import type { Lesson } from '@/types/lesson'

const vShowLesson: Lesson = {
  id: 'vue/directives/v-show',
  courseId: 'vue',
  moduleId: 'directives',
  title: 'v-show',
  icon: '👁️',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/built-in-directives#v-show',

  theory: [
    {
      tag: 'v-show-display',
      title: 'v-show — alterna `display: none`',
      body: `v-show mantém o elemento sempre no DOM e alterna a CSS property "display".
Diferente de v-if, não destrói nem recria.
Listeners e estado interno do componente são preservados durante o toggle.`,
      code: `<template>
  <div v-show="aberto">Sempre no DOM, alterna display</div>
</template>`,
    },
    {
      tag: 'v-show-vs-v-if',
      title: 'v-show vs v-if: custo de toggle',
      body: `v-show: custo inicial maior (renderiza no mount) + toggle barato.
v-if: custo inicial baixo se condição é false + toggle caro (cria/destrói).
Regra: alterna muito → v-show. Alterna pouco → v-if.`,
      code: `<script setup>
<!-- toggle frequente: -->
<DropdownMenu v-show="aberto" />

<!-- raramente exibido: -->
<AdminPanel v-if="usuario.admin" />
</script>`,
    },
    {
      tag: 'v-show-no-template',
      title: 'Limitação: não funciona em <template>',
      body: `v-show só funciona em elementos reais.
Não use em <template>; <template v-show> é inválido — use v-if ou aplique nos filhos.`,
      code: `<script setup>
<!-- ❌ inválido -->
<template v-show="cond">
  <h1>oi</h1>
</template>

<!-- ✅ aplique no elemento ou use v-if -->
<h1 v-show="cond">oi</h1>
</script>`,
    },
    {
      tag: 'v-show-no-else',
      title: 'Limitação: não tem v-else',
      body: `v-show é binário: mostra ou esconde. Não existe v-show-else.
Para alternar entre dois elementos, use v-if/v-else.`,
      code: `<script setup>
<!-- ❌ não existe -->
<p v-show="ok">ok</p>
<p v-show-else>nok</p>

<!-- ✅ -->
<p v-if="ok">ok</p>
<p v-else>nok</p>
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/directives/v-show/fc-1',
      front: 'Como v-show esconde o elemento?',
      back: 'Aplicando display: none via style inline. O elemento permanece no DOM.',
      requires: ['v-show-display'],
    },
    {
      id: 'vue/directives/v-show/fc-2',
      front: 'Quando v-show é melhor que v-if?',
      back: 'Quando o estado alterna frequentemente — evita o custo de criar/destruir.',
      requires: ['v-show-vs-v-if'],
    },
    {
      id: 'vue/directives/v-show/fc-3',
      front: 'Posso usar v-show em <template>?',
      back: 'Não — v-show só funciona em elementos reais. Use v-if pra <template> ou aplique nos filhos.',
      requires: ['v-show-no-template'],
    },
    {
      id: 'vue/directives/v-show/fc-4',
      front: 'Existe v-show-else?',
      back: 'Não — v-show é binário. Pra alternar entre dois elementos, use v-if/v-else.',
      requires: ['v-show-no-else'],
    },
  ],

  challenges: [
    {
      id: 'vue/directives/v-show/ch-1',
      type: 'fill-blank',
      title: 'Dropdown com toggle',
      description: 'Use v-show pra alternar a visibilidade do dropdown.',
      xpReward: 20,
      requires: ['v-show-display'],
      template: `<script setup>
import { ref } from 'vue'
const aberto = ref(false)
</script>

<template>
  <button @click="aberto = !aberto">toggle</button>
  <ul ___="aberto">
    <li>opção</li>
  </ul>
</template>`,
      blanks: ['v-show'],
      solution: `<script setup>
import { ref } from 'vue'
const aberto = ref(false)
</script>

<template>
  <button @click="aberto = !aberto">toggle</button>
  <ul v-show="aberto">
    <li>opção</li>
  </ul>
</template>`,
      hint: 'v-show="cond" alterna display.',
    },
    {
      id: 'vue/directives/v-show/ch-2',
      type: 'fill-blank',
      title: 'Tooltip frequente',
      description: 'Tooltip aparece/some no hover (alterna muito).',
      xpReward: 20,
      requires: ['v-show-vs-v-if'],
      template: `<script setup>
import { ref } from 'vue'
const hover = ref(false)
</script>

<template>
  <span @mouseenter="hover = true" @mouseleave="hover = false">
    Passe o mouse
    <span ___="hover" class="tooltip">tooltip aqui</span>
  </span>
</template>`,
      blanks: ['v-show'],
      solution: `<script setup>
import { ref } from 'vue'
const hover = ref(false)
</script>

<template>
  <span @mouseenter="hover = true" @mouseleave="hover = false">
    Passe o mouse
    <span v-show="hover" class="tooltip">tooltip aqui</span>
  </span>
</template>`,
      hint: 'Toggle frequente → v-show.',
    },
    {
      id: 'vue/directives/v-show/ch-3',
      type: 'write-from-scratch',
      title: 'Loading spinner',
      description: 'Mostre o spinner enquanto carregando=true.',
      xpReward: 30,
      requires: ['v-show-display'],
      template: `<script setup>
import { ref } from 'vue'
const carregando = ref(true)
</script>

<template>
  <!-- spinner aqui -->
</template>`,
      solution: `<script setup>
import { ref } from 'vue'
const carregando = ref(true)
</script>

<template>
  <div v-show="carregando" class="spinner">⏳</div>
</template>`,
      hint: 'div v-show="carregando".',
    },
    {
      id: 'vue/directives/v-show/ch-4',
      type: 'fix-bug',
      title: 'v-show em template',
      description: 'Conserte o uso inválido de v-show em <template>.',
      xpReward: 30,
      requires: ['v-show-no-template'],
      buggyCode: `<script setup>
import { ref } from 'vue'
const aberto = ref(true)
</script>

<template>
  <template v-show="aberto">
    <h1>Modal</h1>
  </template>
</template>`,
      solution: `<script setup>
import { ref } from 'vue'
const aberto = ref(true)
</script>

<template>
  <template v-if="aberto">
    <h1>Modal</h1>
  </template>
</template>`,
      hint: 'v-show não funciona em <template> — use v-if (ou aplique nos filhos).',
    },
    {
      id: 'vue/directives/v-show/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o v-show',
      description: 'Três problemas misturando v-show e v-if. Corrija.',
      xpReward: 100,
      requires: ['v-show-display', 'v-show-vs-v-if', 'v-show-no-template', 'v-show-no-else'],
      buggyCode: `<script setup>
import { ref } from 'vue'
const aberto = ref(false)
const modalAberto = ref(false)
const ativo = ref(true)
</script>

<template>
  <button @click="aberto = !aberto">toggle</button>
  <div v-if="aberto">dropdown</div>

  <template v-show="modalAberto">
    <h1>Modal</h1>
  </template>

  <p v-show="ativo">ativo</p>
  <p v-show-else>inativo</p>
</template>`,
      solution: `<script setup>
import { ref } from 'vue'
const aberto = ref(false)
const modalAberto = ref(false)
const ativo = ref(true)
</script>

<template>
  <button @click="aberto = !aberto">toggle</button>
  <div v-show="aberto">dropdown</div>

  <template v-if="modalAberto">
    <h1>Modal</h1>
  </template>

  <p v-if="ativo">ativo</p>
  <p v-else>inativo</p>
</template>`,
      explanation: `Dropdown que alterna frequentemente: prefira v-show ao v-if.
v-show não pode ir em <template> — use v-if.
Não existe v-show-else; pra alternar entre dois elementos use v-if/v-else.`,
    },
  ],
}

export default vShowLesson
