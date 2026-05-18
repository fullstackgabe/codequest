import type { Lesson } from '@/types/lesson'

const computedLesson: Lesson = {
  id: 'vue/reactivity/computed',
  courseId: 'vue',
  moduleId: 'reactivity',
  title: 'computed()',
  icon: '🧮',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/reactivity-core#computed',

  theory: [
    {
      tag: 'computed-derived',
      title: 'computed() — valor derivado com cache',
      body: `Cria um Ref readonly cujo valor é calculado a partir de outras refs/reactives.
Vue rastreia as dependências automaticamente e re-calcula só quando uma delas muda.
Entre mudanças, o valor é cacheado — múltiplos acessos não re-executam.`,
      code: `<script setup>
import { ref, computed } from 'vue'

const nome = ref('ana')
const nomeMaiusculo = computed(() => nome.value.toUpperCase())

console.log(nomeMaiusculo.value) // 'ANA' — calcula
console.log(nomeMaiusculo.value) // 'ANA' — cache, não recalcula
</script>`,
    },
    {
      tag: 'computed-vs-method',
      title: 'computed vs. método: o cache',
      body: `Tanto computed quanto métodos retornam valores derivados.
A diferença é o cache: computed só re-executa quando deps mudam;
método executa toda vez que é chamado no template.
Use computed quando o cálculo é caro ou referenciado várias vezes.`,
      code: `<script setup>
import { ref, computed } from 'vue'

const lista = ref([1, 2, 3, 4, 5])

// computed: 1 cálculo, cache até lista mudar
const soma = computed(() => lista.value.reduce((a, b) => a + b, 0))

// método: re-executa em cada render que usa
function somaMetodo() {
  return lista.value.reduce((a, b) => a + b, 0)
}
</script>`,
    },
    {
      tag: 'computed-getter-setter',
      title: 'computed() escritável (getter + setter)',
      body: `Por padrão, computed é readonly — atribuir .value lança erro em DEV.
Para casos onde você precisa "desfazer" uma transformação ao escrever,
passe um objeto { get, set } em vez de uma função.`,
      code: `<script setup>
import { ref, computed } from 'vue'

const nome = ref('Ana Silva')

const nomeCompleto = computed({
  get: () => nome.value,
  set: (novo) => { nome.value = novo.trim() },
})

nomeCompleto.value = '  Bruno  '
console.log(nome.value) // 'Bruno'
</script>`,
    },
    {
      tag: 'computed-no-side-effects',
      title: 'Regra: sem efeitos colaterais no getter',
      body: `O getter de computed deve ser puro — só transformar e retornar.
NÃO mude refs, não chame APIs, não modifique o DOM.
Para efeitos colaterais, use watch ou watchEffect.`,
      code: `<script setup>
// ❌ ruim: mutação dentro do getter
const total = computed(() => {
  contador.value++  // efeito colateral!
  return lista.value.length
})

// ✅ bom: puro
const total = computed(() => lista.value.length)
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/reactivity/computed/fc-1',
      front: 'Qual a vantagem de computed sobre um método?',
      back: `Cache: computed só re-executa quando dependências reativas mudam.
Método executa em cada render que o chama.`,
      requires: ['computed-vs-method'],
    },
    {
      id: 'vue/reactivity/computed/fc-2',
      front: 'Como acesso o valor de um computed?',
      back: `Via .value no script (igual ref).
No template, Vue desembrulha — use sem .value.`,
      code: `<script setup>
// script: nomeMaiusculo.value
// template: {{ nomeMaiusculo }}
</script>`,
      requires: ['computed-derived'],
    },
    {
      id: 'vue/reactivity/computed/fc-3',
      front: 'Como criar um computed escritável?',
      back: `Passe { get, set } em vez de uma função.
O setter recebe o novo valor e pode atualizar refs subjacentes.`,
      code: `<script setup>
const c = computed({
  get: () => state.value,
  set: (v) => { state.value = v }
})
</script>`,
      requires: ['computed-getter-setter'],
    },
    {
      id: 'vue/reactivity/computed/fc-4',
      front: 'Pode ter efeitos colaterais dentro de computed?',
      back: `Não. Getter de computed deve ser puro — só transformar e retornar.
Para efeitos colaterais, use watch ou watchEffect.`,
      requires: ['computed-no-side-effects'],
    },
  ],

  challenges: [
    {
      id: 'vue/reactivity/computed/ch-1',
      type: 'fill-blank',
      title: 'Total derivado de um array',
      description: 'Calcule a soma dos itens de uma lista reativa.',
      xpReward: 20,
      requires: ['computed-derived'],
      template: `<script setup>
import { ref, ___ } from 'vue'

const itens = ref([10, 20, 30])
const total = ___(() => itens.value.reduce((a, b) => a + b, 0))
</script>

<template>
  <p>Total: {{ total }}</p>
</template>`,
      blanks: ['computed', 'computed'],
      solution: `<script setup>
import { ref, computed } from 'vue'

const itens = ref([10, 20, 30])
const total = computed(() => itens.value.reduce((a, b) => a + b, 0))
</script>

<template>
  <p>Total: {{ total }}</p>
</template>`,
      hint: 'Importe computed e passe uma função que retorna o cálculo.',
    },
    {
      id: 'vue/reactivity/computed/ch-2',
      type: 'fill-blank',
      title: 'Filtro derivado',
      description: 'Filtre apenas os números pares da lista.',
      xpReward: 20,
      requires: ['computed-derived'],
      template: `<script setup>
import { ref, computed } from 'vue'

const numeros = ref([1, 2, 3, 4, 5, 6])
const pares = computed(() => numeros.___.filter(n => n % 2 === 0))
</script>

<template>
  <p>{{ pares.join(', ') }}</p>
</template>`,
      blanks: ['value'],
      solution: `<script setup>
import { ref, computed } from 'vue'

const numeros = ref([1, 2, 3, 4, 5, 6])
const pares = computed(() => numeros.value.filter(n => n % 2 === 0))
</script>

<template>
  <p>{{ pares.join(', ') }}</p>
</template>`,
      hint: 'Refs ainda precisam de .value dentro de funções no script.',
    },
    {
      id: 'vue/reactivity/computed/ch-3',
      type: 'fill-blank',
      title: 'Computed escritável',
      description: 'Crie um computed escritável que trima o nome ao atribuir.',
      xpReward: 30,
      requires: ['computed-getter-setter'],
      template: `<script setup>
import { ref, computed } from 'vue'

const nome = ref('Ana')

const nomeProcessado = computed({
  ___: () => nome.value,
  ___: (novo) => { nome.value = novo.trim() },
})
</script>

<template>
  <input v-model="nomeProcessado" />
</template>`,
      blanks: ['get', 'set'],
      solution: `<script setup>
import { ref, computed } from 'vue'

const nome = ref('Ana')

const nomeProcessado = computed({
  get: () => nome.value,
  set: (novo) => { nome.value = novo.trim() },
})
</script>

<template>
  <input v-model="nomeProcessado" />
</template>`,
      hint: 'Objeto com duas keys: get (lê) e set (escreve).',
    },
    {
      id: 'vue/reactivity/computed/ch-4',
      type: 'write-from-scratch',
      title: 'Nome completo',
      description: 'Crie um computed "fullName" que junta firstName e lastName com um espaço.',
      xpReward: 30,
      requires: ['computed-derived'],
      template: `<script setup>
import { ref, computed } from 'vue'

const firstName = ref('Ada')
const lastName = ref('Lovelace')

// declare aqui o computed fullName

</script>

<template>
  <p>{{ fullName }}</p>
</template>`,
      solution: `<script setup>
import { ref, computed } from 'vue'

const firstName = ref('Ada')
const lastName = ref('Lovelace')

const fullName = computed(() => firstName.value + ' ' + lastName.value)
</script>

<template>
  <p>{{ fullName }}</p>
</template>`,
      hint: 'computed(() => firstName.value + " " + lastName.value).',
    },
    {
      id: 'vue/reactivity/computed/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o computed',
      description: 'Quatro bugs misturam mau uso de computed. Corrija todos.',
      xpReward: 100,
      requires: ['computed-derived', 'computed-vs-method', 'computed-getter-setter', 'computed-no-side-effects'],
      buggyCode: `<script setup>
import { ref, computed } from 'vue'

const lista = ref([1, 2, 3])
let total = 0

const soma = computed(() => {
  total++
  return lista.value.reduce((a, b) => a + b, 0)
})

const dobro = computed(() => lista.reduce((a, b) => a + b, 0) * 2)

const nome = ref('Ana')
const upper = computed(() => nome.value.toUpperCase())

function reset() {
  upper.value = ''
}
</script>

<template>
  <p>Soma: {{ soma }} · Dobro: {{ dobro }}</p>
  <p>Nome: {{ upper }} (recalculou {{ total }}x)</p>
  <button @click="reset">reset</button>
</template>`,
      solution: `<script setup>
import { ref, computed } from 'vue'

const lista = ref([1, 2, 3])

const soma = computed(() => lista.value.reduce((a, b) => a + b, 0))
const dobro = computed(() => lista.value.reduce((a, b) => a + b, 0) * 2)

const nome = ref('Ana')
const upper = computed({
  get: () => nome.value.toUpperCase(),
  set: (v) => { nome.value = v },
})

function reset() {
  upper.value = ''
}
</script>

<template>
  <p>Soma: {{ soma }} · Dobro: {{ dobro }}</p>
  <p>Nome: {{ upper }}</p>
  <button @click="reset">reset</button>
</template>`,
      explanation: `Mutar 'total' dentro do getter é efeito colateral — getter deve ser puro.
'lista.reduce' sem .value não acessa o array do ref.
Atribuir a computed readonly lança erro — declare como { get, set } se precisar escrever.
Acessos seguidos de computed usam cache; não há contador legítimo de "recálculos" no getter.`,
    },
  ],
}

export default computedLesson
