import type { Lesson } from '@/types/lesson'

const propsLesson: Lesson = {
  id: 'vue/communication/props',
  courseId: 'vue',
  moduleId: 'communication',
  title: 'props / defineProps',
  icon: '📥',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/sfc-script-setup#defineprops',

  theory: [
    {
      tag: 'props-basic',
      title: 'defineProps — herança de dados do pai',
      body: `Pais passam dados pra filhos via props.
defineProps declara o contrato. No <script setup>, retorna um objeto reativo com as props.
No template, use direto como variável.`,
      code: `<!-- Filho.vue -->
<script setup>
const props = defineProps(['nome', 'idade'])
console.log(props.nome)
</script>

<template>
  <p>{{ nome }} — {{ idade }}</p>
</template>

<!-- Pai.vue -->
<Filho nome="Ana" :idade="30" />`,
    },
    {
      tag: 'props-types',
      title: 'Tipando props (objeto)',
      body: `Passe um objeto com tipo + opções (required, default, validator).
Vue valida em DEV — aviso no console se receber tipo errado.`,
      code: `<script setup>
const props = defineProps({
  nome: { type: String, required: true },
  idade: { type: Number, default: 0 },
  papeis: { type: Array, default: () => [] },
})
</script>`,
    },
    {
      tag: 'props-ts',
      title: 'Tipando props em TS — defineProps<>',
      body: `Em <script setup lang="ts">, defina o tipo em angle brackets.
Use withDefaults pra ter valores default em props opcionais.`,
      code: `<script setup lang="ts">
interface Props {
  nome: string
  idade?: number
  papeis?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  idade: 0,
  papeis: () => [],
})
</script>`,
    },
    {
      tag: 'props-readonly',
      title: 'Props são readonly',
      body: `Você não pode mutar props no filho — gera aviso em DEV e pode ser sobrescrito no próximo render.
Pra modificar, emit pro pai (update:xxx) ou faça cópia local com ref().`,
      code: `<script setup>
import { ref, watch } from 'vue'
const props = defineProps(['inicial'])

// cópia local mutável
const valor = ref(props.inicial)

// se o pai trocar, atualiza local
watch(() => props.inicial, (n) => { valor.value = n })
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/communication/props/fc-1',
      front: 'Direção do fluxo de props?',
      back: 'Pai → filho. Filhos leem mas não mutam.',
      requires: ['props-basic'],
    },
    {
      id: 'vue/communication/props/fc-2',
      front: 'Como declarar prop com valor default em JS?',
      back: 'defineProps({ idade: { type: Number, default: 0 } }).',
      code: `defineProps({
  idade: { type: Number, default: 0 }
})`,
      requires: ['props-types'],
    },
    {
      id: 'vue/communication/props/fc-3',
      front: 'Como dar defaults em TS?',
      back: 'withDefaults(defineProps<Props>(), { ... }). Funções pra arrays/objetos: () => [].',
      requires: ['props-ts'],
    },
    {
      id: 'vue/communication/props/fc-4',
      front: 'Posso mutar uma prop no filho?',
      back: `Não — props são readonly. Pra modificar, emit "update:xxx" e o pai decide, ou crie cópia local com ref().`,
      requires: ['props-readonly'],
    },
  ],

  challenges: [
    {
      id: 'vue/communication/props/ch-1',
      type: 'fill-blank',
      title: 'Receber prop',
      description: 'Receba a prop "titulo" e mostre no h1.',
      xpReward: 20,
      requires: ['props-basic'],
      template: `<script setup>
___(['titulo'])
</script>

<template>
  <h1>{{ ___ }}</h1>
</template>`,
      blanks: ['defineProps', 'titulo'],
      solution: `<script setup>
defineProps(['titulo'])
</script>

<template>
  <h1>{{ titulo }}</h1>
</template>`,
      hint: 'defineProps(["nomes"]) — depois use a variável no template.',
    },
    {
      id: 'vue/communication/props/ch-2',
      type: 'fill-blank',
      title: 'Tipo + default',
      description: 'Declare "idade" como Number com default 0.',
      xpReward: 20,
      requires: ['props-types'],
      template: `<script setup>
defineProps({
  idade: { type: ___, default: ___ },
})
</script>`,
      blanks: ['Number', '0'],
      solution: `<script setup>
defineProps({
  idade: { type: Number, default: 0 },
})
</script>`,
      hint: 'type é o construtor (Number, String, ...) e default o valor inicial.',
    },
    {
      id: 'vue/communication/props/ch-3',
      type: 'fill-blank',
      title: 'TS com defaults',
      description: 'Declare props "nome" (string) e "idade" (opcional com default 0).',
      xpReward: 30,
      requires: ['props-ts'],
      template: `<script setup lang="ts">
interface Props { nome: string; idade?: number }
const props = ___(defineProps<Props>(), { idade: 0 })
</script>`,
      blanks: ['withDefaults'],
      solution: `<script setup lang="ts">
interface Props { nome: string; idade?: number }
const props = withDefaults(defineProps<Props>(), { idade: 0 })
</script>`,
      hint: 'withDefaults envolve defineProps em TS pra adicionar valores default.',
    },
    {
      id: 'vue/communication/props/ch-4',
      type: 'fill-blank',
      title: 'Cópia local pra mutar',
      description: 'O filho precisa modificar — crie cópia local de "inicial".',
      xpReward: 30,
      requires: ['props-readonly'],
      template: `<script setup>
import { ref } from 'vue'

const props = defineProps(['inicial'])
const valor = ___(props.inicial)

function inc() {
  valor.value++
}
</script>

<template>
  <button @click="inc">{{ valor }}</button>
</template>`,
      blanks: ['ref'],
      solution: `<script setup>
import { ref } from 'vue'

const props = defineProps(['inicial'])
const valor = ref(props.inicial)

function inc() {
  valor.value++
}
</script>

<template>
  <button @click="inc">{{ valor }}</button>
</template>`,
      hint: 'Crie um ref() inicializado com o valor da prop.',
    },
    {
      id: 'vue/communication/props/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine props',
      description: 'Quatro problemas. Corrija.',
      xpReward: 100,
      requires: ['props-basic', 'props-types', 'props-ts', 'props-readonly'],
      buggyCode: `<script setup lang="ts">
import { ref } from 'vue'

// props não declaradas
function mostrarNome() {
  return nome.toUpperCase()
}

// tenta mutar prop
function inc() {
  idade++
}

// default sem withDefaults em TS
defineProps<{ nome: string; idade?: number }>()
</script>

<template>
  <p>{{ mostrarNome() }}</p>
  <p>idade: {{ idade }}</p>
  <button @click="inc">+1</button>
</template>`,
      solution: `<script setup lang="ts">
import { ref } from 'vue'

interface Props { nome: string; idade?: number }
const props = withDefaults(defineProps<Props>(), { idade: 0 })
const idadeLocal = ref(props.idade)

function mostrarNome() {
  return props.nome.toUpperCase()
}

function inc() {
  idadeLocal.value++
}
</script>

<template>
  <p>{{ mostrarNome() }}</p>
  <p>idade: {{ idadeLocal }}</p>
  <button @click="inc">+1</button>
</template>`,
      explanation: `defineProps precisa ser chamado pra ter acesso ao valor.
Props são readonly — pra mutar, crie cópia local com ref().
Em TS, defaults vão via withDefaults().
Acesse props via objeto retornado (props.nome) pra clareza.`,
    },
  ],
}

export default propsLesson
