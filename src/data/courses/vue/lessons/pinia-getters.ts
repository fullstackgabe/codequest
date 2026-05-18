import type { Lesson } from '@/types/lesson'

const piniaGettersLesson: Lesson = {
  id: 'vue/pinia/getters',
  courseId: 'vue',
  moduleId: 'pinia',
  title: 'Getters (Pinia)',
  icon: '🧮',
  xpReward: 30,
  docUrl: 'https://pinia.vuejs.org/core-concepts/getters.html',

  theory: [
    {
      tag: 'pinia-getters-basic',
      title: 'Getters = computed do store',
      body: `Getters são valores derivados do state, com cache.
No setup-store, são exatamente computed() retornados no return.
Re-calculam só quando uma dependência reativa muda.`,
      code: `export const useCarrinho = defineStore('carrinho', () => {
  const itens = ref([
    { id: 1, preco: 10 },
    { id: 2, preco: 25 },
  ])

  const total = computed(() => itens.value.reduce((s, i) => s + i.preco, 0))

  return { itens, total }
})`,
    },
    {
      tag: 'pinia-getters-uso',
      title: 'Consumindo getters',
      body: `No componente, acesse igual qualquer propriedade do store.
storeToRefs também funciona pra getters — extrai como ref readonly.
Como tudo é computed por baixo, render é otimizado.`,
      code: `<script setup>
import { storeToRefs } from 'pinia'
import { useCarrinho } from '@/stores/carrinho'

const carrinho = useCarrinho()
const { total } = storeToRefs(carrinho)
</script>

<template>
  <p>Total: {{ total }}</p>
</template>`,
    },
    {
      tag: 'pinia-getters-params',
      title: 'Getter com parâmetro',
      body: `Computed não aceita parâmetro diretamente.
Pra ter "getter parametrizado", retorne uma função.
Ela não é cacheada por argumento — re-executa toda chamada.`,
      code: `export const useItens = defineStore('itens', () => {
  const lista = ref([
    { id: 1, nome: 'A' },
    { id: 2, nome: 'B' },
  ])

  const porId = computed(() => {
    return (id) => lista.value.find(i => i.id === id)
  })

  return { lista, porId }
})

// uso: carrinho.porId(2)`,
    },
    {
      tag: 'pinia-getters-cross',
      title: 'Getter usando outro getter / outro store',
      body: `No setup-store, getter é só uma função pura.
Pode usar outros computeds do mesmo store ou de outros (chamando useOutroStore()).`,
      code: `export const usePagamento = defineStore('pagamento', () => {
  const carrinho = useCarrinho()
  const desconto = ref(0.1)

  const totalComDesconto = computed(() =>
    carrinho.total * (1 - desconto.value)
  )

  return { desconto, totalComDesconto }
})`,
    },
  ],

  flashcards: [
    {
      id: 'vue/pinia/getters/fc-1',
      front: 'Como criar um getter em setup-store?',
      back: 'Use computed() exatamente como em um componente, e retorne no return.',
      requires: ['pinia-getters-basic'],
    },
    {
      id: 'vue/pinia/getters/fc-2',
      front: 'Como consumir um getter no componente?',
      back: 'Acesse como propriedade do store. storeToRefs() também funciona pra getters.',
      requires: ['pinia-getters-uso'],
    },
    {
      id: 'vue/pinia/getters/fc-3',
      front: 'Como criar getter com parâmetro?',
      back: 'Retorne uma função do computed. Trade-off: cada chamada re-executa (sem cache por arg).',
      code: `const porId = computed(() => (id) => lista.value.find(...))`,
      requires: ['pinia-getters-params'],
    },
    {
      id: 'vue/pinia/getters/fc-4',
      front: 'Posso usar outro store dentro de um getter?',
      back: 'Sim — chame use*() dentro do setup do seu store; o getter pode referenciar o outro.',
      requires: ['pinia-getters-cross'],
    },
  ],

  challenges: [
    {
      id: 'vue/pinia/getters/ch-1',
      type: 'fill-blank',
      title: 'Total do carrinho',
      description: 'Crie um getter "total" somando os preços dos itens.',
      xpReward: 20,
      requires: ['pinia-getters-basic'],
      template: `import { defineStore } from 'pinia'
import { ref, ___ } from 'vue'

export const useCarrinho = defineStore('carrinho', () => {
  const itens = ref([{ id: 1, preco: 10 }, { id: 2, preco: 20 }])
  const total = ___(() => itens.value.reduce((s, i) => s + i.preco, 0))
  return { itens, total }
})`,
      blanks: ['computed', 'computed'],
      solution: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCarrinho = defineStore('carrinho', () => {
  const itens = ref([{ id: 1, preco: 10 }, { id: 2, preco: 20 }])
  const total = computed(() => itens.value.reduce((s, i) => s + i.preco, 0))
  return { itens, total }
})`,
      hint: 'Getter no setup-store = computed do Vue.',
    },
    {
      id: 'vue/pinia/getters/ch-2',
      type: 'fill-blank',
      title: 'Quantidade de itens',
      description: 'Adicione getter "quantidade" = length da lista.',
      xpReward: 20,
      requires: ['pinia-getters-basic'],
      template: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCarrinho = defineStore('carrinho', () => {
  const itens = ref([])
  const quantidade = computed(() => itens.value.___)
  return { itens, quantidade }
})`,
      blanks: ['length'],
      solution: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCarrinho = defineStore('carrinho', () => {
  const itens = ref([])
  const quantidade = computed(() => itens.value.length)
  return { itens, quantidade }
})`,
      hint: 'Arrays têm .length.',
    },
    {
      id: 'vue/pinia/getters/ch-3',
      type: 'fill-blank',
      title: 'Getter com parâmetro',
      description: 'Crie "porId" que retorna função buscando item pelo id.',
      xpReward: 30,
      requires: ['pinia-getters-params'],
      template: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useItens = defineStore('itens', () => {
  const lista = ref([{ id: 1, nome: 'A' }, { id: 2, nome: 'B' }])
  const porId = computed(() => (id) => lista.value.find(i => i.___ === id))
  return { lista, porId }
})`,
      blanks: ['id'],
      solution: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useItens = defineStore('itens', () => {
  const lista = ref([{ id: 1, nome: 'A' }, { id: 2, nome: 'B' }])
  const porId = computed(() => (id) => lista.value.find(i => i.id === id))
  return { lista, porId }
})`,
      hint: 'Comparamos i.id com o argumento id.',
    },
    {
      id: 'vue/pinia/getters/ch-4',
      type: 'write-from-scratch',
      title: 'Getter cross-store',
      description: 'Em usePagamento, declare getter totalFinal = useCarrinho().total * (1 - desconto).',
      xpReward: 40,
      requires: ['pinia-getters-cross'],
      template: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCarrinho } from './carrinho'

export const usePagamento = defineStore('pagamento', () => {
  const desconto = ref(0.1)
  // declare carrinho e totalFinal aqui
})`,
      solution: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCarrinho } from './carrinho'

export const usePagamento = defineStore('pagamento', () => {
  const desconto = ref(0.1)
  const carrinho = useCarrinho()
  const totalFinal = computed(() => carrinho.total * (1 - desconto.value))
  return { desconto, totalFinal }
})`,
      hint: 'Chame useCarrinho() pra obter outro store; use no computed.',
    },
    {
      id: 'vue/pinia/getters/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine getters',
      description: 'Três problemas em getters. Corrija.',
      xpReward: 100,
      requires: ['pinia-getters-basic', 'pinia-getters-uso', 'pinia-getters-params'],
      buggyCode: `import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCarrinho = defineStore('carrinho', () => {
  const itens = ref([{ id: 1, preco: 10 }])

  // getter mas sem computed
  function total() {
    return itens.value.reduce((s, i) => s + i.preco, 0)
  }

  // getter por id mas como ref normal
  const porId = ref((id) => itens.value.find(i => i.id === id))

  return { itens, total, porId }
})

// no componente
const c = useCarrinho()
console.log(c.total)        // [Function]
console.log(c.porId(1))      // erro: undefined.value`,
      solution: `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCarrinho = defineStore('carrinho', () => {
  const itens = ref([{ id: 1, preco: 10 }])

  const total = computed(() => itens.value.reduce((s, i) => s + i.preco, 0))

  const porId = computed(() => (id) => itens.value.find(i => i.id === id))

  return { itens, total, porId }
})

// no componente
const c = useCarrinho()
console.log(c.total)         // 10
console.log(c.porId(1))      // { id: 1, preco: 10 }`,
      explanation: `Getter precisa ser computed pra ter cache e ser reativo.
Getter parametrizado: computed retornando função (não ref).
Acessar c.total dá o valor direto (computed já desembrulha no acesso de propriedade do store).`,
    },
  ],
}

export default piniaGettersLesson
