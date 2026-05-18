import type { Lesson } from '@/types/lesson'

const emitsLesson: Lesson = {
  id: 'vue/communication/emits',
  courseId: 'vue',
  moduleId: 'communication',
  title: 'emits / defineEmits',
  icon: '📣',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/sfc-script-setup#defineemits',

  theory: [
    {
      tag: 'emit-basic',
      title: 'defineEmits — filho avisa o pai',
      body: `Componentes filhos comunicam o pai emitindo eventos.
defineEmits declara quais eventos o componente dispara.
emit(nome, payload) envia o evento; o pai ouve com @nome.`,
      code: `<!-- Filho.vue -->
<script setup>
const emit = defineEmits(['fechar'])
function fechar() {
  emit('fechar')
}
</script>

<!-- Pai.vue -->
<template>
  <Filho @fechar="aberto = false" />
</template>`,
    },
    {
      tag: 'emit-payload',
      title: 'Emitindo com payload',
      body: `O segundo argumento (e seguintes) de emit() vira o(s) parâmetro(s) do handler no pai.
Use pra mandar dados — id do item clicado, novo valor, etc.`,
      code: `<!-- Filho.vue -->
<script setup>
const emit = defineEmits(['selecionar'])
function escolher(id) {
  emit('selecionar', id)
}
</script>

<!-- Pai.vue -->
<template>
  <Lista @selecionar="(id) => idAtual = id" />
</template>`,
    },
    {
      tag: 'emit-typed',
      title: 'Tipando eventos com defineEmits<>',
      body: `Em TS, declare a forma dos eventos como type literal.
Vue valida payload em DEV e o IDE autocompleta no pai.`,
      code: `<script setup lang="ts">
const emit = defineEmits<{
  (e: 'fechar'): void
  (e: 'selecionar', id: number): void
}>()
</script>`,
    },
    {
      tag: 'emit-vs-direct-mutation',
      title: 'Por que emit em vez de mutar prop?',
      body: `Props são one-way (pai → filho). Mutar uma prop direto:
- Quebra rastreabilidade ("quem mudou esse dado?")
- Avisa em DEV e pode ser sobrescrito no próximo render
emit mantém o pai como dono do dado — ele decide se aceita.`,
      code: `<!-- ❌ ruim: muta prop -->
<script setup>
const props = defineProps(['valor'])
function inc() { props.valor++ }
</script>

<!-- ✅ bom: emite, pai decide -->
<script setup>
defineProps(['valor'])
const emit = defineEmits(['update:valor'])
function inc() { emit('update:valor', props.valor + 1) }
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/communication/emits/fc-1',
      front: 'Pra que serve defineEmits?',
      back: 'Declarar quais eventos o componente filho dispara (documentação + validação em DEV).',
      requires: ['emit-basic'],
    },
    {
      id: 'vue/communication/emits/fc-2',
      front: 'Como mandar dados junto do evento?',
      back: 'emit(nome, payload). O handler no pai recebe payload como argumento.',
      code: `emit('selecionar', id)
// pai: @selecionar="(id) => ..."`,
      requires: ['emit-payload'],
    },
    {
      id: 'vue/communication/emits/fc-3',
      front: 'Como tipar eventos em <script setup lang="ts">?',
      back: `defineEmits<{ (e: 'nome', payload: T): void }>()
Vue valida em DEV e o IDE autocompleta.`,
      requires: ['emit-typed'],
    },
    {
      id: 'vue/communication/emits/fc-4',
      front: 'Por que não mutar prop direto no filho?',
      back: 'Props são one-way; mutação avisa em DEV e pode ser sobrescrita. Use emit pra avisar o pai mudar.',
      requires: ['emit-vs-direct-mutation'],
    },
  ],

  challenges: [
    {
      id: 'vue/communication/emits/ch-1',
      type: 'fill-blank',
      title: 'Botão fechar',
      description: 'Declare e emita o evento "fechar".',
      xpReward: 20,
      requires: ['emit-basic'],
      template: `<script setup>
const emit = ___(['fechar'])
function fechar() {
  emit('___')
}
</script>

<template>
  <button @click="fechar">×</button>
</template>`,
      blanks: ['defineEmits', 'fechar'],
      solution: `<script setup>
const emit = defineEmits(['fechar'])
function fechar() {
  emit('fechar')
}
</script>

<template>
  <button @click="fechar">×</button>
</template>`,
      hint: 'defineEmits(["nomes"]) declara; emit("nome") dispara.',
    },
    {
      id: 'vue/communication/emits/ch-2',
      type: 'fill-blank',
      title: 'Selecionar com payload',
      description: 'Emita "selecionar" com o id do item.',
      xpReward: 20,
      requires: ['emit-payload'],
      template: `<script setup>
defineProps(['itens'])
const emit = defineEmits(['selecionar'])

function escolher(item) {
  emit('selecionar', item.___)
}
</script>

<template>
  <button v-for="i in itens" :key="i.id" @click="escolher(i)">{{ i.nome }}</button>
</template>`,
      blanks: ['id'],
      solution: `<script setup>
defineProps(['itens'])
const emit = defineEmits(['selecionar'])

function escolher(item) {
  emit('selecionar', item.id)
}
</script>

<template>
  <button v-for="i in itens" :key="i.id" @click="escolher(i)">{{ i.nome }}</button>
</template>`,
      hint: 'Passe o id como segundo argumento de emit().',
    },
    {
      id: 'vue/communication/emits/ch-3',
      type: 'fill-blank',
      title: 'Eventos tipados (TS)',
      description: 'Tipe o evento "submit" com payload string.',
      xpReward: 30,
      requires: ['emit-typed'],
      template: `<script setup lang="ts">
const emit = defineEmits<{
  (e: '___', valor: string): void
}>()

function enviar() {
  emit('submit', 'oi')
}
</script>`,
      blanks: ['submit'],
      solution: `<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit', valor: string): void
}>()

function enviar() {
  emit('submit', 'oi')
}
</script>`,
      hint: 'Cada linha do tipo é (e: "nome", payload: tipo): void.',
    },
    {
      id: 'vue/communication/emits/ch-4',
      type: 'write-from-scratch',
      title: 'Contador via emit',
      description: 'Filho com botão +1 que emite "incrementar" (sem payload). Não declare prop nem mute nada.',
      xpReward: 30,
      requires: ['emit-basic', 'emit-vs-direct-mutation'],
      template: `<script setup>
// declare emit aqui
</script>

<template>
  <button>+1</button>
</template>`,
      solution: `<script setup>
const emit = defineEmits(['incrementar'])
</script>

<template>
  <button @click="emit('incrementar')">+1</button>
</template>`,
      hint: 'defineEmits + @click="emit(...)".',
    },
    {
      id: 'vue/communication/emits/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine emits',
      description: 'Três problemas no fluxo de eventos. Corrija.',
      xpReward: 100,
      requires: ['emit-basic', 'emit-payload', 'emit-typed', 'emit-vs-direct-mutation'],
      buggyCode: `<script setup>
const props = defineProps(['contador'])
// emit não está declarado
function inc() {
  props.contador++
}

function escolher(item) {
  emit('select', item)
}
</script>

<template>
  <button @click="inc">+1</button>
  <li v-for="i in props.itens" :key="i.id" @click="escolher(i)">{{ i.nome }}</li>
</template>`,
      solution: `<script setup>
const props = defineProps(['contador', 'itens'])
const emit = defineEmits(['incrementar', 'select'])

function inc() {
  emit('incrementar')
}

function escolher(item) {
  emit('select', item.id)
}
</script>

<template>
  <button @click="inc">+1</button>
  <li v-for="i in props.itens" :key="i.id" @click="escolher(i)">{{ i.nome }}</li>
</template>`,
      explanation: `Mutar prop direto é proibido — emit e o pai decide.
emit precisa ser obtido via defineEmits antes de usar.
Pra payload pequeno, prefira mandar só o id (não o objeto inteiro) — fica mais explícito.`,
    },
  ],
}

export default emitsLesson
