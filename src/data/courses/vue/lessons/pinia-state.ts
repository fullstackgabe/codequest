import type { Lesson } from '@/types/lesson'

const piniaStateLesson: Lesson = {
  id: 'vue/pinia/state',
  courseId: 'vue',
  moduleId: 'pinia',
  title: 'State (Pinia)',
  icon: '🍍',
  xpReward: 30,
  docUrl: 'https://pinia.vuejs.org/core-concepts/state.html',

  theory: [
    {
      tag: 'pinia-defineStore',
      title: 'defineStore — criando um store',
      body: `Pinia organiza estado em "stores" — defineStore('id', setup).
ID único identifica o store globalmente.
Há duas formas: Options API (objeto com state/getters/actions) e Setup API (função).
Setup é mais flexível e combina com a Composition API.`,
      code: `<script setup>
// stores/contador.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContador = defineStore('contador', () => {
  const valor = ref(0)
  return { valor }
})
</script>`,
    },
    {
      tag: 'pinia-state-refs',
      title: 'State no setup-store: refs e reactives',
      body: `No setup-store, o "state" é qualquer ref/reactive declarado dentro.
Tudo que você retornar do setup vira parte do store público.
Use ref pra primitivos e reactive pra objetos — exatamente como num componente.`,
      code: `<script setup>
export const useUsuario = defineStore('usuario', () => {
  const nome = ref('')
  const perfil = reactive({ tema: 'dark', idioma: 'pt-BR' })
  return { nome, perfil }
})
</script>`,
    },
    {
      tag: 'pinia-usar-componente',
      title: 'Consumindo o store',
      body: `Em qualquer componente, chame o use*() pra pegar a instância.
Acessa propriedades direto (sem .value no template).
No script, refs internos ainda exigem .value.`,
      code: `<script setup>
import { useContador } from '@/stores/contador'
const contador = useContador()
contador.valor++
</script>

<template>
  <p>{{ contador.valor }}</p>
</template>`,
    },
    {
      tag: 'pinia-storeToRefs',
      title: 'Desestruturação reativa com storeToRefs',
      body: `Desestruturar o store direto perde reatividade nos primitivos
(mesma armadilha de desestruturar reactive).
Use storeToRefs() — devolve refs reativos pra cada propriedade do state.`,
      code: `<script setup>
import { storeToRefs } from 'pinia'
import { useContador } from '@/stores/contador'

const store = useContador()

// ❌ perde reatividade
// const { valor } = store

// ✅ refs reativos
const { valor } = storeToRefs(store)
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/pinia/state/fc-1',
      front: 'O que é a 1ª string passada pra defineStore?',
      back: 'O ID único do store. Pinia usa para identificar no devtools e evitar duplicatas.',
      requires: ['pinia-defineStore'],
    },
    {
      id: 'vue/pinia/state/fc-2',
      front: 'O que é "state" em um setup-store?',
      back: 'Refs/reactives declarados dentro do setup function e retornados no return.',
      requires: ['pinia-state-refs'],
    },
    {
      id: 'vue/pinia/state/fc-3',
      front: 'Como acesso o store em um componente?',
      back: 'Chame use*() (ex: useContador()). Retorna o store; acesse propriedades direto.',
      requires: ['pinia-usar-componente'],
    },
    {
      id: 'vue/pinia/state/fc-4',
      front: 'Por que usar storeToRefs?',
      back: 'Desestruturar o store quebra reatividade em primitivos; storeToRefs gera refs reativos por propriedade.',
      requires: ['pinia-storeToRefs'],
    },
  ],

  challenges: [
    {
      id: 'vue/pinia/state/ch-1',
      type: 'fill-blank',
      title: 'Criar store básico',
      description: 'Crie um store "contador" com um ref valor=0.',
      xpReward: 20,
      requires: ['pinia-defineStore'],
      template: `import { ___ } from 'pinia'
import { ref } from 'vue'

export const useContador = ___('contador', () => {
  const valor = ref(0)
  return { valor }
})`,
      blanks: ['defineStore', 'defineStore'],
      solution: `import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContador = defineStore('contador', () => {
  const valor = ref(0)
  return { valor }
})`,
      hint: 'Importe defineStore de "pinia" e use como factory.',
    },
    {
      id: 'vue/pinia/state/ch-2',
      type: 'fill-blank',
      title: 'Múltiplas propriedades de estado',
      description: 'State com nome (string) e itens (array).',
      xpReward: 20,
      requires: ['pinia-state-refs'],
      template: `import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('app', () => {
  const nome = ref('')
  const itens = ref([])
  return { ___, ___ }
})`,
      blanks: ['nome', 'itens'],
      solution: `import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('app', () => {
  const nome = ref('')
  const itens = ref([])
  return { nome, itens }
})`,
      hint: 'Retorne todas as variáveis que devem ficar públicas.',
    },
    {
      id: 'vue/pinia/state/ch-3',
      type: 'fill-blank',
      title: 'Usar store no componente',
      description: 'Importe e use o store; faça o botão incrementar.',
      xpReward: 30,
      requires: ['pinia-usar-componente'],
      template: `<script setup>
import { useContador } from '@/stores/contador'
const ___ = useContador()
</script>

<template>
  <button @click="contador.valor++">{{ ___.valor }}</button>
</template>`,
      blanks: ['contador', 'contador'],
      solution: `<script setup>
import { useContador } from '@/stores/contador'
const contador = useContador()
</script>

<template>
  <button @click="contador.valor++">{{ contador.valor }}</button>
</template>`,
      hint: 'Mesma variável usada no template e no script.',
    },
    {
      id: 'vue/pinia/state/ch-4',
      type: 'fill-blank',
      title: 'Desestruturar com reatividade',
      description: 'Use storeToRefs pra extrair "valor" mantendo reatividade.',
      xpReward: 30,
      requires: ['pinia-storeToRefs'],
      template: `<script setup>
import { ___ } from 'pinia'
import { useContador } from '@/stores/contador'

const store = useContador()
const { valor } = ___(store)
</script>

<template>
  <p>{{ valor }}</p>
</template>`,
      blanks: ['storeToRefs', 'storeToRefs'],
      solution: `<script setup>
import { storeToRefs } from 'pinia'
import { useContador } from '@/stores/contador'

const store = useContador()
const { valor } = storeToRefs(store)
</script>

<template>
  <p>{{ valor }}</p>
</template>`,
      hint: 'storeToRefs converte props do store em refs reativos.',
    },
    {
      id: 'vue/pinia/state/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o state',
      description: 'Quatro problemas no store. Corrija.',
      xpReward: 100,
      requires: ['pinia-defineStore', 'pinia-state-refs', 'pinia-usar-componente', 'pinia-storeToRefs'],
      buggyCode: `// stores/usuario.js
import { defineStore } from 'pinia'

export const useUsuario = defineStore({
  state: () => ({
    nome: ''
  })
})

// Componente.vue
<script setup>
import { useUsuario } from '@/stores/usuario'

const usuario = useUsuario
const { nome } = usuario

function mudar() {
  nome = 'Bruno'
}
</script>

<template>
  <p>{{ nome }}</p>
  <button @click="mudar">trocar</button>
</template>`,
      solution: `// stores/usuario.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuario = defineStore('usuario', () => {
  const nome = ref('')
  return { nome }
})

// Componente.vue
<script setup>
import { storeToRefs } from 'pinia'
import { useUsuario } from '@/stores/usuario'

const usuario = useUsuario()
const { nome } = storeToRefs(usuario)

function mudar() {
  nome.value = 'Bruno'
}
</script>

<template>
  <p>{{ nome }}</p>
  <button @click="mudar">trocar</button>
</template>`,
      explanation: `defineStore exige ID como primeiro arg quando usa setup API; ou objeto na options API.
useUsuario é uma factory — chame como useUsuario().
Desestruturação direta perde reatividade — use storeToRefs.
Refs precisam de .value pra escrever.`,
    },
  ],
}

export default piniaStateLesson
