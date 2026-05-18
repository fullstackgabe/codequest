import type { Lesson } from '@/types/lesson'

const piniaActionsLesson: Lesson = {
  id: 'vue/pinia/actions',
  courseId: 'vue',
  moduleId: 'pinia',
  title: 'Actions (Pinia)',
  icon: '⚡',
  xpReward: 30,
  docUrl: 'https://pinia.vuejs.org/core-concepts/actions.html',

  theory: [
    {
      tag: 'pinia-actions-basic',
      title: 'Actions = funções do store',
      body: `Actions são funções que mutam state ou orquestram lógica.
No setup-store, são funções normais retornadas no return.
Diferente de Redux/Vuex, podem ser síncronas ou async — sem mutations.`,
      code: `<script setup>
export const useContador = defineStore('contador', () => {
  const valor = ref(0)
  function incrementar() {
    valor.value++
  }
  return { valor, incrementar }
})

// uso:
const c = useContador()
c.incrementar()
</script>`,
    },
    {
      tag: 'pinia-actions-async',
      title: 'Actions async — fetch, salvar, etc',
      body: `Actions podem ser async e usar await normalmente.
Atualize refs depois do await — Vue rastreia a mudança e UI re-renderiza.
Trate erros com try/catch.`,
      code: `<script setup>
export const useUsuarios = defineStore('usuarios', () => {
  const lista = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  async function carregar() {
    carregando.value = true
    erro.value = null
    try {
      lista.value = await fetch('/api/users').then(r => r.json())
    } catch (e) {
      erro.value = e
    } finally {
      carregando.value = false
    }
  }

  return { lista, carregando, erro, carregar }
})
</script>`,
    },
    {
      tag: 'pinia-actions-cross',
      title: 'Action chamando outro store',
      body: `Dentro de uma action, você pode usar outros stores: chame use*() (uma vez, no setup).
Útil pra orquestrar lógica entre domínios (ex: pagamento ↔ carrinho).`,
      code: `<script setup>
export const usePagamento = defineStore('pagamento', () => {
  const carrinho = useCarrinho()
  const status = ref('idle')

  async function pagar() {
    status.value = 'processando'
    await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(carrinho.itens),
    })
    carrinho.limpar()
    status.value = 'ok'
  }

  return { status, pagar }
})
</script>`,
    },
    {
      tag: 'pinia-actions-this',
      title: 'Setup vs Options: o "this"',
      body: `Em Options API, actions acessam state via this.valor (Pinia faz autobind).
Em Setup API, você lê/escreve diretamente o ref/reactive — nunca usa this.
Setup é mais idiomático com Composition API e elimina dúvidas sobre arrow vs regular.`,
      code: `<script setup>
// Options API
export const useContador = defineStore('contador', {
  state: () => ({ valor: 0 }),
  actions: {
    inc() { this.valor++ }
  }
})

// Setup API (preferido)
export const useContador = defineStore('contador', () => {
  const valor = ref(0)
  function inc() { valor.value++ }
  return { valor, inc }
})
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/pinia/actions/fc-1',
      front: 'O que é uma action no setup-store?',
      back: 'Uma função normal que muta refs/reactives do store e é retornada no return.',
      requires: ['pinia-actions-basic'],
    },
    {
      id: 'vue/pinia/actions/fc-2',
      front: 'Actions podem ser async?',
      back: 'Sim — Pinia não distingue mutations e actions. Use async/await normalmente.',
      requires: ['pinia-actions-async'],
    },
    {
      id: 'vue/pinia/actions/fc-3',
      front: 'Como uma action chama outro store?',
      back: 'Use use*() dentro do setup do store atual; salve numa const e use nas actions.',
      requires: ['pinia-actions-cross'],
    },
    {
      id: 'vue/pinia/actions/fc-4',
      front: 'Diferença de "this" entre Options e Setup?',
      back: 'Options: actions usam this.x (autobind). Setup: acesse refs direto — sem this.',
      requires: ['pinia-actions-this'],
    },
  ],

  challenges: [
    {
      id: 'vue/pinia/actions/ch-1',
      type: 'fill-blank',
      title: 'Incrementar',
      description: 'Crie a action incrementar.',
      xpReward: 20,
      requires: ['pinia-actions-basic'],
      template: `import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContador = defineStore('contador', () => {
  const valor = ref(0)
  function ___() {
    valor.value++
  }
  return { valor, incrementar }
})`,
      blanks: ['incrementar'],
      solution: `import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useContador = defineStore('contador', () => {
  const valor = ref(0)
  function incrementar() {
    valor.value++
  }
  return { valor, incrementar }
})`,
      hint: 'Declare a função e retorne junto com valor.',
    },
    {
      id: 'vue/pinia/actions/ch-2',
      type: 'fill-blank',
      title: 'Action async',
      description: 'Carregue usuários via fetch.',
      xpReward: 30,
      requires: ['pinia-actions-async'],
      template: `export const useUsuarios = defineStore('usuarios', () => {
  const lista = ref([])

  ___ function carregar() {
    lista.value = ___ fetch('/api/users').then(r => r.json())
  }

  return { lista, carregar }
})`,
      blanks: ['async', 'await'],
      solution: `export const useUsuarios = defineStore('usuarios', () => {
  const lista = ref([])

  async function carregar() {
    lista.value = await fetch('/api/users').then(r => r.json())
  }

  return { lista, carregar }
})`,
      hint: 'async function + await na chamada.',
    },
    {
      id: 'vue/pinia/actions/ch-3',
      type: 'fill-blank',
      title: 'Erro / loading',
      description: 'Adicione carregando e erro à action.',
      xpReward: 30,
      requires: ['pinia-actions-async'],
      template: `export const useUsuarios = defineStore('usuarios', () => {
  const lista = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  async function carregar() {
    carregando.___ = true
    erro.value = null
    try {
      lista.value = await fetch('/api/users').then(r => r.json())
    } catch (e) {
      erro.value = e
    } finally {
      carregando.value = false
    }
  }

  return { lista, carregando, erro, carregar }
})`,
      blanks: ['value'],
      solution: `export const useUsuarios = defineStore('usuarios', () => {
  const lista = ref([])
  const carregando = ref(false)
  const erro = ref(null)

  async function carregar() {
    carregando.value = true
    erro.value = null
    try {
      lista.value = await fetch('/api/users').then(r => r.json())
    } catch (e) {
      erro.value = e
    } finally {
      carregando.value = false
    }
  }

  return { lista, carregando, erro, carregar }
})`,
      hint: 'Refs precisam de .value.',
    },
    {
      id: 'vue/pinia/actions/ch-4',
      type: 'write-from-scratch',
      title: 'Cross-store action',
      description: 'Em usePagamento, crie action async pagar() que zera o carrinho ao final.',
      xpReward: 40,
      requires: ['pinia-actions-cross'],
      template: `import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCarrinho } from './carrinho'

export const usePagamento = defineStore('pagamento', () => {
  // declare carrinho, status e a action pagar
})`,
      solution: `import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCarrinho } from './carrinho'

export const usePagamento = defineStore('pagamento', () => {
  const carrinho = useCarrinho()
  const status = ref('idle')

  async function pagar() {
    status.value = 'processando'
    await fetch('/api/checkout', { method: 'POST' })
    carrinho.limpar()
    status.value = 'ok'
  }

  return { status, pagar }
})`,
      hint: 'Capture carrinho com useCarrinho() e chame carrinho.limpar() ao final.',
    },
    {
      id: 'vue/pinia/actions/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine actions',
      description: 'Quatro problemas em actions. Corrija.',
      xpReward: 100,
      requires: ['pinia-actions-basic', 'pinia-actions-async', 'pinia-actions-cross', 'pinia-actions-this'],
      buggyCode: `import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCarrinho } from './carrinho'

export const usePagamento = defineStore('pagamento', () => {
  const status = ref('idle')

  function pagar() {
    this.status = 'processando'  // 'this' não existe no setup
    fetch('/api/checkout')        // async sem await
    useCarrinho().limpar()         // chamando use no meio da action
    this.status.value = 'ok'
  }

  return { status, pagar }
})`,
      solution: `import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCarrinho } from './carrinho'

export const usePagamento = defineStore('pagamento', () => {
  const status = ref('idle')
  const carrinho = useCarrinho()

  async function pagar() {
    status.value = 'processando'
    await fetch('/api/checkout')
    carrinho.limpar()
    status.value = 'ok'
  }

  return { status, pagar }
})`,
      explanation: `Em setup-store não existe 'this' — use refs direto.
Operações I/O exigem async + await.
Use*() deve ser chamado no setup da store (não dentro de cada action) — capture uma vez.
Mutação de ref no setup-store é sempre .value.`,
    },
  ],
}

export default piniaActionsLesson
