import type { Lesson } from '@/types/lesson'

const onBeforeUnmountLesson: Lesson = {
  id: 'vue/lifecycle/on-before-unmount',
  courseId: 'vue',
  moduleId: 'lifecycle',
  title: 'onBeforeUnmount',
  icon: '🟠',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/composition-api-lifecycle#onbeforeunmount',

  theory: [
    {
      tag: 'before-unmount-when',
      title: 'onBeforeUnmount — logo antes de desmontar',
      body: `Dispara imediatamente antes do componente ser removido.
A essa altura, o componente ainda está totalmente funcional: refs preenchidas,
estado acessível, DOM ainda no documento. É o último momento pra ler o estado atual.`,
      code: `<script setup>
import { onBeforeUnmount, ref } from 'vue'

const valor = ref(42)

onBeforeUnmount(() => {
  // ainda dá pra ler o estado e o DOM
  console.log('saindo com valor =', valor.value)
})
</script>`,
    },
    {
      tag: 'before-vs-after-unmount',
      title: 'onBeforeUnmount vs onUnmounted',
      body: `onBeforeUnmount: o componente ainda existe — bom pra ler estado/DOM antes de sumir.
onUnmounted: o componente já foi removido — bom pra disparar limpezas que não precisam do estado.
Cleanup de listeners e timers pode ir em qualquer um; preferimos onBeforeUnmount quando precisamos do contexto atual.`,
      code: `<script setup>
import { onBeforeUnmount, onUnmounted } from 'vue'

onBeforeUnmount(() => {
  // ainda posso ler ref + DOM
  console.log('saindo')
})

onUnmounted(() => {
  // já foi
  console.log('saiu')
})
</script>`,
    },
    {
      tag: 'before-unmount-save',
      title: 'Caso de uso: salvar rascunho ao sair',
      body: `Antes de desmontar (ex: usuário navega pra outra rota), persistir estado
em localStorage ou enviar uma chamada beacon. O ref ainda está acessível.`,
      code: `<script setup>
import { onBeforeUnmount, ref } from 'vue'

const rascunho = ref('')

onBeforeUnmount(() => {
  localStorage.setItem('rascunho', rascunho.value)
})
</script>

<template>
  <textarea v-model="rascunho" />
</template>`,
    },
    {
      tag: 'before-unmount-listeners',
      title: 'Caso de uso: remover listeners globais',
      body: `Listeners registrados em window/document devem ser removidos antes do unmount
pra evitar leaks e callbacks fantasmas em refs que vão sumir.`,
      code: `<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

function handleResize() {
  console.log(window.innerWidth)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/lifecycle/on-before-unmount/fc-1',
      front: 'Em que momento onBeforeUnmount dispara?',
      back: 'Imediatamente antes do componente ser desmontado — ainda dá pra ler estado e DOM.',
      requires: ['before-unmount-when'],
    },
    {
      id: 'vue/lifecycle/on-before-unmount/fc-2',
      front: 'Diferença prática entre onBeforeUnmount e onUnmounted?',
      back: 'Before: componente ainda existe (lê estado/DOM). After: já foi removido (cleanup puro).',
      requires: ['before-vs-after-unmount'],
    },
    {
      id: 'vue/lifecycle/on-before-unmount/fc-3',
      front: 'Caso de uso clássico de onBeforeUnmount?',
      back: 'Persistir estado (rascunho em localStorage, enviar beacon, etc.) com o ref ainda acessível.',
      requires: ['before-unmount-save'],
    },
    {
      id: 'vue/lifecycle/on-before-unmount/fc-4',
      front: 'Onde remover listeners de window?',
      back: 'Em onBeforeUnmount (ou onUnmounted) — sempre pareie com o addEventListener.',
      requires: ['before-unmount-listeners'],
    },
  ],

  challenges: [
    {
      id: 'vue/lifecycle/on-before-unmount/ch-1',
      type: 'fill-blank',
      title: 'Logar ao sair',
      description: 'Loge "tchau" antes do componente desmontar.',
      xpReward: 20,
      requires: ['before-unmount-when'],
      template: `<script setup>
import { ___ } from 'vue'

___(() => {
  console.log('tchau')
})
</script>`,
      blanks: ['onBeforeUnmount', 'onBeforeUnmount'],
      solution: `<script setup>
import { onBeforeUnmount } from 'vue'

onBeforeUnmount(() => {
  console.log('tchau')
})
</script>`,
      hint: 'Importe e chame com um callback.',
    },
    {
      id: 'vue/lifecycle/on-before-unmount/ch-2',
      type: 'fill-blank',
      title: 'Salvar rascunho',
      description: 'Salve o conteúdo do textarea em localStorage antes de sair.',
      xpReward: 30,
      requires: ['before-unmount-save'],
      template: `<script setup>
import { onBeforeUnmount, ref } from 'vue'

const rascunho = ref('')

onBeforeUnmount(() => {
  localStorage.setItem('rascunho', rascunho.___)
})
</script>

<template>
  <textarea v-model="rascunho" />
</template>`,
      blanks: ['value'],
      solution: `<script setup>
import { onBeforeUnmount, ref } from 'vue'

const rascunho = ref('')

onBeforeUnmount(() => {
  localStorage.setItem('rascunho', rascunho.value)
})
</script>

<template>
  <textarea v-model="rascunho" />
</template>`,
      hint: 'Refs ainda precisam de .value.',
    },
    {
      id: 'vue/lifecycle/on-before-unmount/ch-3',
      type: 'fill-blank',
      title: 'Remover listener',
      description: 'Remova o listener de resize antes do unmount.',
      xpReward: 30,
      requires: ['before-unmount-listeners'],
      template: `<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

function handleResize() {
  console.log(window.innerWidth)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.___('resize', handleResize)
})
</script>`,
      blanks: ['removeEventListener'],
      solution: `<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

function handleResize() {
  console.log(window.innerWidth)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>`,
      hint: 'Par de addEventListener é removeEventListener.',
    },
    {
      id: 'vue/lifecycle/on-before-unmount/ch-4',
      type: 'write-from-scratch',
      title: 'Beacon ao sair',
      description: 'Envie um POST /api/telemetria com `tempo` em milissegundos antes do unmount.',
      xpReward: 30,
      requires: ['before-unmount-save'],
      template: `<script setup>
import { onBeforeUnmount, ref } from 'vue'

const tempo = ref(0)
// envie beacon em onBeforeUnmount
</script>`,
      solution: `<script setup>
import { onBeforeUnmount, ref } from 'vue'

const tempo = ref(0)

onBeforeUnmount(() => {
  navigator.sendBeacon('/api/telemetria', JSON.stringify({ tempo: tempo.value }))
})
</script>`,
      hint: 'navigator.sendBeacon é ideal pra "fire-and-forget" antes de sair.',
    },
    {
      id: 'vue/lifecycle/on-before-unmount/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine onBeforeUnmount',
      description: 'Três problemas. Corrija.',
      xpReward: 100,
      requires: ['before-unmount-when', 'before-vs-after-unmount', 'before-unmount-save', 'before-unmount-listeners'],
      buggyCode: `<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const rascunho = ref('')

function handleResize() {
  console.log(window.innerWidth)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

// salva DEPOIS de desmontar — rascunho ref já foi
onUnmounted(() => {
  localStorage.setItem('rascunho', rascunho.value)
})

// nenhuma chamada a removeEventListener
</script>

<template>
  <textarea v-model="rascunho" />
</template>`,
      solution: `<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const rascunho = ref('')

function handleResize() {
  console.log(window.innerWidth)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  localStorage.setItem('rascunho', rascunho.value)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <textarea v-model="rascunho" />
</template>`,
      explanation: `Pra ler estado/DOM no final, use onBeforeUnmount (refs ainda válidas).
Falta o par removeEventListener — gera leak de handler.
Combinando: persistir + cleanup no mesmo hook simplifica.`,
    },
  ],
}

export default onBeforeUnmountLesson
