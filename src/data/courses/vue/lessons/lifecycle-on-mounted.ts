import type { Lesson } from '@/types/lesson'

const onMountedLesson: Lesson = {
  id: 'vue/lifecycle/on-mounted',
  courseId: 'vue',
  moduleId: 'lifecycle',
  title: 'onMounted',
  icon: '🟢',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/composition-api-lifecycle#onmounted',

  theory: [
    {
      tag: 'mounted-when',
      title: 'onMounted — "estou pronto"',
      body: `Chama o callback após o componente ter sido montado no DOM.
A essa altura, refs em elementos do template estão preenchidas e você pode interagir com o DOM real.
Roda uma vez por instância. SSR não dispara (só no cliente).`,
      code: `<script setup>
import { onMounted, ref } from 'vue'

const inputEl = ref(null)

onMounted(() => {
  inputEl.value.focus()
})
</script>

<template>
  <input ref="inputEl" />
</template>`,
    },
    {
      tag: 'mounted-async',
      title: 'Carregando dados ao montar',
      body: `Use onMounted pra buscar dados iniciais via fetch.
Mantenha refs de estado (carregando, erro) e atualize após o await.`,
      code: `<script setup>
import { onMounted, ref } from 'vue'

const dados = ref(null)
const carregando = ref(true)

onMounted(async () => {
  dados.value = await fetch('/api/x').then(r => r.json())
  carregando.value = false
})
</script>`,
    },
    {
      tag: 'mounted-multiple',
      title: 'Múltiplos onMounted',
      body: `Você pode chamar onMounted várias vezes — todos os callbacks rodam em ordem.
Útil pra compor: composables podem registrar seu próprio onMounted sem interferir.`,
      code: `<script setup>
import { onMounted } from 'vue'

onMounted(() => console.log('A'))
onMounted(() => console.log('B'))

// composable
function useAnalytics() {
  onMounted(() => console.log('analytics'))
}
useAnalytics()  // registra mais um
</script>`,
    },
    {
      tag: 'mounted-pair-unmounted',
      title: 'Sempre pareie com onUnmounted (recursos)',
      body: `Recursos criados em onMounted (timers, listeners globais, subscriptions)
DEVEM ser limpos em onUnmounted, senão vazam.
Regra: pra cada "criar" no mounted, um "limpar" no unmounted.`,
      code: `<script setup>
import { onMounted, onUnmounted } from 'vue'

let id

onMounted(() => {
  id = setInterval(() => console.log('tick'), 1000)
})

onUnmounted(() => {
  clearInterval(id)
})
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/lifecycle/on-mounted/fc-1',
      front: 'Quando o callback de onMounted roda?',
      back: 'Após o componente ser inserido no DOM. Refs de template já estão preenchidas.',
      requires: ['mounted-when'],
    },
    {
      id: 'vue/lifecycle/on-mounted/fc-2',
      front: 'Como buscar dados ao montar?',
      back: 'Use onMounted async () => { dados.value = await fetch(...) }.',
      requires: ['mounted-async'],
    },
    {
      id: 'vue/lifecycle/on-mounted/fc-3',
      front: 'Posso registrar mais de um onMounted?',
      back: 'Sim — todos os callbacks rodam em ordem. Composables podem registrar seu próprio.',
      requires: ['mounted-multiple'],
    },
    {
      id: 'vue/lifecycle/on-mounted/fc-4',
      front: 'Regra de ouro com recursos em onMounted?',
      back: 'Sempre pareie com onUnmounted pra limpar (timers, listeners) — senão vaza.',
      requires: ['mounted-pair-unmounted'],
    },
  ],

  challenges: [
    {
      id: 'vue/lifecycle/on-mounted/ch-1',
      type: 'fill-blank',
      title: 'Focar input ao montar',
      description: 'Dê foco ao input quando o componente for montado.',
      xpReward: 20,
      requires: ['mounted-when'],
      template: `<script setup>
import { ___, ref } from 'vue'

const inputEl = ref(null)

___(() => {
  inputEl.value.focus()
})
</script>

<template>
  <input ref="inputEl" />
</template>`,
      blanks: ['onMounted', 'onMounted'],
      solution: `<script setup>
import { onMounted, ref } from 'vue'

const inputEl = ref(null)

onMounted(() => {
  inputEl.value.focus()
})
</script>

<template>
  <input ref="inputEl" />
</template>`,
      hint: 'Importe onMounted e passe o callback.',
    },
    {
      id: 'vue/lifecycle/on-mounted/ch-2',
      type: 'fill-blank',
      title: 'Carregar dados',
      description: 'Busque /api/users e guarde em "lista".',
      xpReward: 30,
      requires: ['mounted-async'],
      template: `<script setup>
import { onMounted, ref } from 'vue'

const lista = ref([])

onMounted(___ () => {
  lista.value = ___ fetch('/api/users').then(r => r.json())
})
</script>`,
      blanks: ['async', 'await'],
      solution: `<script setup>
import { onMounted, ref } from 'vue'

const lista = ref([])

onMounted(async () => {
  lista.value = await fetch('/api/users').then(r => r.json())
})
</script>`,
      hint: 'O callback pode ser async; use await na chamada.',
    },
    {
      id: 'vue/lifecycle/on-mounted/ch-3',
      type: 'fill-blank',
      title: 'Setinterval ao montar',
      description: 'Inicie um timer que loga "tick" a cada segundo.',
      xpReward: 20,
      requires: ['mounted-pair-unmounted'],
      template: `<script setup>
import { onMounted, onUnmounted } from 'vue'

let id

onMounted(() => {
  id = ___(() => console.log('tick'), 1000)
})

onUnmounted(() => {
  ___(id)
})
</script>`,
      blanks: ['setInterval', 'clearInterval'],
      solution: `<script setup>
import { onMounted, onUnmounted } from 'vue'

let id

onMounted(() => {
  id = setInterval(() => console.log('tick'), 1000)
})

onUnmounted(() => {
  clearInterval(id)
})
</script>`,
      hint: 'setInterval ao montar; clearInterval ao desmontar.',
    },
    {
      id: 'vue/lifecycle/on-mounted/ch-4',
      type: 'write-from-scratch',
      title: 'Ler scrollTop ao montar',
      description: 'Loge o scrollTop do container quando o componente montar.',
      xpReward: 30,
      requires: ['mounted-when'],
      template: `<script setup>
import { onMounted, ref } from 'vue'

const containerEl = ref(null)

// logar containerEl.value.scrollTop em onMounted
</script>

<template>
  <div ref="containerEl" style="height: 100px; overflow: auto;">
    <p v-for="i in 30" :key="i">{{ i }}</p>
  </div>
</template>`,
      solution: `<script setup>
import { onMounted, ref } from 'vue'

const containerEl = ref(null)

onMounted(() => {
  console.log(containerEl.value.scrollTop)
})
</script>

<template>
  <div ref="containerEl" style="height: 100px; overflow: auto;">
    <p v-for="i in 30" :key="i">{{ i }}</p>
  </div>
</template>`,
      hint: 'Em onMounted o template ref já tem o elemento.',
    },
    {
      id: 'vue/lifecycle/on-mounted/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine onMounted',
      description: 'Três problemas com onMounted. Corrija.',
      xpReward: 100,
      requires: ['mounted-when', 'mounted-async', 'mounted-pair-unmounted'],
      buggyCode: `<script setup>
import { ref } from 'vue'

const inputEl = ref(null)
const lista = ref([])
let intervalId

// tentou no setup direto — DOM ainda não montou
inputEl.value.focus()

// fetch no setup sem aguardar
lista.value = fetch('/api/users')

// timer sem cleanup
intervalId = setInterval(() => console.log('tick'), 1000)
</script>

<template>
  <input ref="inputEl" />
</template>`,
      solution: `<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const inputEl = ref(null)
const lista = ref([])
let intervalId

onMounted(async () => {
  inputEl.value.focus()
  lista.value = await fetch('/api/users').then(r => r.json())
  intervalId = setInterval(() => console.log('tick'), 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <input ref="inputEl" />
</template>`,
      explanation: `Antes de onMounted, refs de template ainda são null — sempre coloque DOM access dentro do hook.
fetch retorna Promise — sem await, lista vira a Promise (não os dados).
Recursos criados precisam ser limpos em onUnmounted (clearInterval).`,
    },
  ],
}

export default onMountedLesson
