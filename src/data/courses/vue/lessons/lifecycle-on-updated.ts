import type { Lesson } from '@/types/lesson'

const onUpdatedLesson: Lesson = {
  id: 'vue/lifecycle/on-updated',
  courseId: 'vue',
  moduleId: 'lifecycle',
  title: 'onUpdated',
  icon: '🔄',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/composition-api-lifecycle#onupdated',

  theory: [
    {
      tag: 'updated-when',
      title: 'onUpdated — após cada re-render',
      body: `Roda quando state reativo mudou E o DOM foi re-renderizado.
Dispara em qualquer mudança que cause re-render, não só na que você mudou.
Use pra reagir ao DOM atualizado quando watch/watchEffect não bastam.`,
      code: `<script setup>
import { onUpdated, ref } from 'vue'

const valor = ref(0)

onUpdated(() => {
  console.log('DOM atualizado, valor agora:', valor.value)
})
</script>

<template>
  <button @click="valor++">{{ valor }}</button>
</template>`,
    },
    {
      tag: 'updated-vs-watch',
      title: 'onUpdated vs watch — qual escolher?',
      body: `watch reage a uma fonte específica.
onUpdated reage a qualquer re-render — pode disparar por coisas alheias.
Prefira watch se você sabe qual variável quer observar; use onUpdated só pra ler o DOM
após mudanças (ex: medir altura depois de inserir conteúdo).`,
      code: `<script setup>
// melhor: watch específico
watch(valor, (n) => log(n))

// onUpdated: dispara em qualquer re-render
onUpdated(() => log(valor.value, outraVar.value))
</script>`,
    },
    {
      tag: 'updated-no-mutation',
      title: 'Cuidado: não mutar state aqui',
      body: `Mudar refs dentro de onUpdated pode causar loop infinito de re-renders.
Se precisar derivar valor, use computed.
Se precisar reagir a uma mudança, use watch.`,
      code: `<script setup>
// ❌ pode causar loop infinito
onUpdated(() => {
  contador.value++
})

// ✅ se realmente precisar, condicione
onUpdated(() => {
  if (algumaCondicao && !jaFeito.value) {
    jaFeito.value = true
    contador.value++
  }
})
</script>`,
    },
    {
      tag: 'updated-dom-read',
      title: 'Caso de uso clássico: medir DOM após render',
      body: `onUpdated é o lugar pra ler dimensões DOM depois que mudanças visuais aconteceram.
Alternativa: watch + await nextTick — mais explícito sobre o que está observando.`,
      code: `<script setup>
import { onUpdated, ref } from 'vue'

const conteudo = ref('texto inicial')
const conteudoEl = ref(null)

onUpdated(() => {
  console.log('altura atual:', conteudoEl.value?.offsetHeight)
})
</script>

<template>
  <button @click="conteudo += '!'">+</button>
  <p ref="conteudoEl">{{ conteudo }}</p>
</template>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/lifecycle/on-updated/fc-1',
      front: 'Quando onUpdated dispara?',
      back: 'Após qualquer re-render do componente — quando state reativo mudou e o DOM foi atualizado.',
      requires: ['updated-when'],
    },
    {
      id: 'vue/lifecycle/on-updated/fc-2',
      front: 'Diferença entre onUpdated e watch?',
      back: 'watch é específico de uma fonte; onUpdated reage a qualquer re-render. Prefira watch quando você sabe o que quer observar.',
      requires: ['updated-vs-watch'],
    },
    {
      id: 'vue/lifecycle/on-updated/fc-3',
      front: 'Pode mudar refs dentro de onUpdated?',
      back: 'Cuidado — pode causar loop infinito. Use computed pra valores derivados ou watch com condições explícitas.',
      requires: ['updated-no-mutation'],
    },
    {
      id: 'vue/lifecycle/on-updated/fc-4',
      front: 'Quando onUpdated é a melhor opção?',
      back: 'Pra ler dimensões/estado do DOM depois de qualquer mudança que cause re-render.',
      requires: ['updated-dom-read'],
    },
  ],

  challenges: [
    {
      id: 'vue/lifecycle/on-updated/ch-1',
      type: 'fill-blank',
      title: 'Log após re-render',
      description: 'Loge "DOM atualizado" toda vez que algo re-renderizar.',
      xpReward: 20,
      requires: ['updated-when'],
      template: `<script setup>
import { ref, ___ } from 'vue'

const valor = ref(0)

___(() => {
  console.log('DOM atualizado')
})
</script>

<template>
  <button @click="valor++">{{ valor }}</button>
</template>`,
      blanks: ['onUpdated', 'onUpdated'],
      solution: `<script setup>
import { ref, onUpdated } from 'vue'

const valor = ref(0)

onUpdated(() => {
  console.log('DOM atualizado')
})
</script>

<template>
  <button @click="valor++">{{ valor }}</button>
</template>`,
      hint: 'Importe onUpdated e passe o callback.',
    },
    {
      id: 'vue/lifecycle/on-updated/ch-2',
      type: 'fill-blank',
      title: 'Medir altura',
      description: 'Loge offsetHeight do conteúdo após cada update.',
      xpReward: 30,
      requires: ['updated-dom-read'],
      template: `<script setup>
import { ref, onUpdated } from 'vue'

const texto = ref('a')
const el = ref(null)

onUpdated(() => {
  console.log(el.value?.___)
})
</script>

<template>
  <button @click="texto += 'a'">+</button>
  <p ref="el">{{ texto }}</p>
</template>`,
      blanks: ['offsetHeight'],
      solution: `<script setup>
import { ref, onUpdated } from 'vue'

const texto = ref('a')
const el = ref(null)

onUpdated(() => {
  console.log(el.value?.offsetHeight)
})
</script>

<template>
  <button @click="texto += 'a'">+</button>
  <p ref="el">{{ texto }}</p>
</template>`,
      hint: 'A propriedade DOM pra altura visível é offsetHeight.',
    },
    {
      id: 'vue/lifecycle/on-updated/ch-3',
      type: 'fill-blank',
      title: 'Trocando por watch',
      description: 'Substitua onUpdated por watch específico em "valor".',
      xpReward: 30,
      requires: ['updated-vs-watch'],
      template: `<script setup>
import { ref, ___ } from 'vue'

const valor = ref(0)

___(valor, (n) => console.log('valor:', n))
</script>

<template>
  <button @click="valor++">{{ valor }}</button>
</template>`,
      blanks: ['watch', 'watch'],
      solution: `<script setup>
import { ref, watch } from 'vue'

const valor = ref(0)

watch(valor, (n) => console.log('valor:', n))
</script>

<template>
  <button @click="valor++">{{ valor }}</button>
</template>`,
      hint: 'watch é mais específico que onUpdated.',
    },
    {
      id: 'vue/lifecycle/on-updated/ch-4',
      type: 'fix-bug',
      title: 'Loop infinito',
      description: 'O código causa loop infinito — corrija.',
      xpReward: 40,
      requires: ['updated-no-mutation'],
      buggyCode: `<script setup>
import { ref, onUpdated } from 'vue'

const valor = ref(0)
const dobro = ref(0)

onUpdated(() => {
  dobro.value = valor.value * 2
})
</script>

<template>
  <button @click="valor++">{{ valor }} → {{ dobro }}</button>
</template>`,
      solution: `<script setup>
import { ref, computed } from 'vue'

const valor = ref(0)
const dobro = computed(() => valor.value * 2)
</script>

<template>
  <button @click="valor++">{{ valor }} → {{ dobro }}</button>
</template>`,
      hint: 'Pra valor derivado, use computed — nunca mute refs dentro de onUpdated.',
    },
    {
      id: 'vue/lifecycle/on-updated/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine onUpdated',
      description: 'Três problemas com onUpdated. Corrija.',
      xpReward: 100,
      requires: ['updated-when', 'updated-vs-watch', 'updated-no-mutation', 'updated-dom-read'],
      buggyCode: `<script setup>
import { ref, onUpdated } from 'vue'

const a = ref(0)
const b = ref(0)
const log = ref([])

// log push causa re-render que dispara onUpdated novamente → loop
onUpdated(() => {
  log.value.push('atualizou')
})

// queria observar só "a"
onUpdated(() => {
  console.log('a:', a.value)
})

// queria reagir ao "b" mudar
onUpdated(() => {
  if (b.value > 10) {
    console.log('b ultrapassou 10')
  }
})
</script>

<template>
  <button @click="a++">a={{ a }}</button>
  <button @click="b++">b={{ b }}</button>
</template>`,
      solution: `<script setup>
import { ref, watch } from 'vue'

const a = ref(0)
const b = ref(0)

watch(a, (n) => console.log('a:', n))

watch(b, (n) => {
  if (n > 10) console.log('b ultrapassou 10')
})
</script>

<template>
  <button @click="a++">a={{ a }}</button>
  <button @click="b++">b={{ b }}</button>
</template>`,
      explanation: `Mutação dentro de onUpdated pode disparar novo render → loop infinito (remover esse hook).
Pra observar uma fonte específica, prefira watch.
Pra condicionar reação ao valor, watch também — mais claro que filtrar dentro de onUpdated.`,
    },
  ],
}

export default onUpdatedLesson
