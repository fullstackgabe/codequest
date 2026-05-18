import type { Lesson } from '@/types/lesson'

const onUnmountedLesson: Lesson = {
  id: 'vue/lifecycle/on-unmounted',
  courseId: 'vue',
  moduleId: 'lifecycle',
  title: 'onUnmounted',
  icon: '🔴',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/composition-api-lifecycle#onunmounted',

  theory: [
    {
      tag: 'unmounted-when',
      title: 'onUnmounted — "último desejo"',
      body: `Dispara após o componente ter sido removido do DOM.
Todas as crianças já foram desmontadas; refs do template estão limpas.
Bom pra disparar cleanups que NÃO dependem do DOM nem do estado vigente.`,
      code: `<script setup>
import { onUnmounted } from 'vue'

onUnmounted(() => {
  console.log('componente saiu')
})
</script>`,
    },
    {
      tag: 'unmounted-cleanup',
      title: 'Cleanup pareado com onMounted',
      body: `Recursos criados em onMounted (intervals, timeouts, subscriptions, observers)
têm seu par natural em onUnmounted.
Padrão: pra cada "criar", um "limpar".`,
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
    {
      tag: 'unmounted-composable',
      title: 'Reuso em composables',
      body: `Composables encapsulam lógica + lifecycle.
useMousePosition, useEventListener etc registram listeners no setup e os limpam em onUnmounted.
O usuário do composable não precisa pensar em cleanup.`,
      code: `<script setup>
// composables/useMousePosition.ts
import { onMounted, onUnmounted, ref } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function update(e) {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
</script>`,
    },
    {
      tag: 'unmounted-state-gone',
      title: 'Cuidado: estado pode não ser confiável',
      body: `Refs e DOM já podem ter sido limpos em onUnmounted.
Se você precisa do estado atual, use onBeforeUnmount.
Se só precisa "soltar recurso externo" (timer, listener, ws), onUnmounted resolve.`,
      code: `<script setup>
// ❌ pode pegar valor stale
onUnmounted(() => {
  localStorage.setItem('valor', valor.value)
})

// ✅ leitura segura
onBeforeUnmount(() => {
  localStorage.setItem('valor', valor.value)
})
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/lifecycle/on-unmounted/fc-1',
      front: 'Quando onUnmounted roda?',
      back: 'Depois do componente ser removido do DOM. Refs do template estão limpas.',
      requires: ['unmounted-when'],
    },
    {
      id: 'vue/lifecycle/on-unmounted/fc-2',
      front: 'Padrão de cleanup com onMounted?',
      back: 'Pra cada recurso criado em onMounted (timer, listener, subscription), libere em onUnmounted.',
      requires: ['unmounted-cleanup'],
    },
    {
      id: 'vue/lifecycle/on-unmounted/fc-3',
      front: 'Por que composables usam onUnmounted?',
      back: 'Pra esconder o cleanup do consumidor — quem usa o composable não precisa pensar em remover listeners.',
      requires: ['unmounted-composable'],
    },
    {
      id: 'vue/lifecycle/on-unmounted/fc-4',
      front: 'Quando preferir onBeforeUnmount em vez de onUnmounted?',
      back: 'Quando você precisa ler refs/DOM válidos antes de tudo ser limpo.',
      requires: ['unmounted-state-gone'],
    },
  ],

  challenges: [
    {
      id: 'vue/lifecycle/on-unmounted/ch-1',
      type: 'fill-blank',
      title: 'Log ao sair',
      description: 'Loge "fim" quando o componente for desmontado.',
      xpReward: 20,
      requires: ['unmounted-when'],
      template: `<script setup>
import { ___ } from 'vue'

___(() => {
  console.log('fim')
})
</script>`,
      blanks: ['onUnmounted', 'onUnmounted'],
      solution: `<script setup>
import { onUnmounted } from 'vue'

onUnmounted(() => {
  console.log('fim')
})
</script>`,
      hint: 'onUnmounted recebe o callback final.',
    },
    {
      id: 'vue/lifecycle/on-unmounted/ch-2',
      type: 'fill-blank',
      title: 'ClearInterval ao desmontar',
      description: 'Pare o timer criado no onMounted.',
      xpReward: 20,
      requires: ['unmounted-cleanup'],
      template: `<script setup>
import { onMounted, onUnmounted } from 'vue'

let id

onMounted(() => {
  id = setInterval(() => console.log('tick'), 1000)
})

onUnmounted(() => {
  ___(id)
})
</script>`,
      blanks: ['clearInterval'],
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
      hint: 'O par de setInterval é clearInterval.',
    },
    {
      id: 'vue/lifecycle/on-unmounted/ch-3',
      type: 'write-from-scratch',
      title: 'Composable de janela',
      description: 'Crie useWindowSize() que mantém width/height reativos e limpa o listener no unmount.',
      xpReward: 40,
      requires: ['unmounted-composable'],
      template: `import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  // implemente aqui
}`,
      solution: `import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { width, height }
}`,
      hint: 'Listener em onMounted, removeEventListener em onUnmounted, refs reativos.',
    },
    {
      id: 'vue/lifecycle/on-unmounted/ch-4',
      type: 'fix-bug',
      title: 'Recurso esquecido',
      description: 'O componente vaza um listener. Conserte.',
      xpReward: 30,
      requires: ['unmounted-cleanup'],
      buggyCode: `<script setup>
import { onMounted } from 'vue'

function onResize() {
  console.log(window.innerWidth)
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})
</script>`,
      solution: `<script setup>
import { onMounted, onUnmounted } from 'vue'

function onResize() {
  console.log(window.innerWidth)
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>`,
      hint: 'Listener em onMounted precisa de removeEventListener no unmount.',
    },
    {
      id: 'vue/lifecycle/on-unmounted/ch-boss',
      type: 'fix-bug',
      title: 'Boss: setInterval ao montar / clearInterval ao desmontar',
      description: 'Boss board: aplique o padrão setInterval/clearInterval corretamente.',
      xpReward: 100,
      requires: ['unmounted-when', 'unmounted-cleanup', 'unmounted-composable', 'unmounted-state-gone'],
      buggyCode: `<script setup>
import { onMounted } from 'vue'

const id = setInterval(() => console.log('tick'), 1000) // cria fora do hook

onMounted(() => {
  // se montar duas vezes na mesma sessão, cria interval duplicado
  setInterval(() => console.log('outro tick'), 500)
})

// sem nenhuma limpeza
</script>`,
      solution: `<script setup>
import { onMounted, onUnmounted } from 'vue'

let id
let outroId

onMounted(() => {
  id = setInterval(() => console.log('tick'), 1000)
  outroId = setInterval(() => console.log('outro tick'), 500)
})

onUnmounted(() => {
  clearInterval(id)
  clearInterval(outroId)
})
</script>`,
      explanation: `Criar setInterval fora de hooks roda em qualquer parse — pior se houver SSR ou hot reload.
Criar dois intervals sem guardar referência impede limpá-los.
Sempre crie recursos em onMounted e libere em onUnmounted (par "setInterval ao montar / clearInterval ao desmontar").`,
    },
  ],
}

export default onUnmountedLesson
