import type { Lesson } from '@/types/lesson'

const watchEffectLesson: Lesson = {
  id: 'vue/reactivity/watch-effect',
  courseId: 'vue',
  moduleId: 'reactivity',
  title: 'watchEffect()',
  icon: '⚙️',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/reactivity-core#watcheffect',

  theory: [
    {
      tag: 'wfx-auto-track',
      title: 'watchEffect — dependências automáticas',
      body: `Executa um efeito e re-executa quando qualquer ref/reactive usada dentro dele muda.
Diferente de watch, você não declara as fontes — Vue rastreia o que foi lido durante a execução.
Roda imediato no setup (sem precisar de option immediate).`,
      code: `<script setup>
import { ref, watchEffect } from 'vue'

const a = ref(1)
const b = ref(2)

watchEffect(() => {
  console.log('soma:', a.value + b.value)
})
// imprime "soma: 3" imediato
// a.value++ → "soma: 4"
</script>`,
    },
    {
      tag: 'wfx-no-old-value',
      title: 'Não recebe valor antigo',
      body: `watchEffect não dá novo/antigo — só executa o efeito.
Se precisar do valor antigo, use watch.
Regra geral: watch quando precisa do antigo; watchEffect quando só importa "rodar o efeito quando algo mudar".`,
      code: `// watchEffect: sem (novo, antigo)
watchEffect(() => {
  log(state.x)
})

// watch: com (novo, antigo)
watch(() => state.x, (novo, antigo) => {
  log(antigo, '->', novo)
})`,
    },
    {
      tag: 'wfx-cleanup',
      title: 'Limpeza com onCleanup',
      body: `O efeito recebe uma função onCleanup como argumento.
Use para cancelar timers, AbortController de fetch, ou subscrições antes da próxima execução
(e antes do componente desmontar).`,
      code: `<script setup>
import { ref, watchEffect } from 'vue'

const id = ref(1)

watchEffect(async (onCleanup) => {
  const ctrl = new AbortController()
  onCleanup(() => ctrl.abort())

  const data = await fetch('/api/' + id.value, { signal: ctrl.signal })
    .then(r => r.json())
  console.log(data)
})
</script>`,
    },
    {
      tag: 'wfx-stop',
      title: 'Parar manualmente',
      body: `watchEffect retorna um stop() que para a observação.
Por padrão, ele já é cancelado quando o componente desmonta.
Use stop() em casos raros onde precisa parar antes (ex: condição de negócio).`,
      code: `<script setup>
import { ref, watchEffect } from 'vue'

const ativo = ref(true)
const stop = watchEffect(() => {
  console.log('rodando')
})

if (!ativo.value) stop()
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/reactivity/watch-effect/fc-1',
      front: 'Como watchEffect descobre as dependências?',
      back: `Automaticamente: rastreia toda ref/reactive lida durante a execução do efeito.
Não é preciso declarar fontes como em watch.`,
      requires: ['wfx-auto-track'],
    },
    {
      id: 'vue/reactivity/watch-effect/fc-2',
      front: 'Diferença principal entre watch e watchEffect?',
      back: `watch declara as fontes e recebe (novo, antigo).
watchEffect rastreia automático e não recebe valor antigo.
Use watch quando precisa do valor antigo.`,
      requires: ['wfx-no-old-value'],
    },
    {
      id: 'vue/reactivity/watch-effect/fc-3',
      front: 'Para que serve `onCleanup` dentro de watchEffect?',
      back: `Cancelar recursos da execução anterior (fetch pendente, timer, listener)
antes da próxima rodada ou do unmount.`,
      code: `watchEffect((onCleanup) => {
  const t = setTimeout(...)
  onCleanup(() => clearTimeout(t))
})`,
      requires: ['wfx-cleanup'],
    },
    {
      id: 'vue/reactivity/watch-effect/fc-4',
      front: 'watchEffect precisa de option `immediate`?',
      back: 'Não — watchEffect já roda uma vez no setup pra coletar deps.',
      requires: ['wfx-auto-track'],
    },
  ],

  challenges: [
    {
      id: 'vue/reactivity/watch-effect/ch-1',
      type: 'fill-blank',
      title: 'Log automático',
      description: 'Logue a soma de a e b sempre que algum deles mudar.',
      xpReward: 20,
      requires: ['wfx-auto-track'],
      template: `<script setup>
import { ref, ___ } from 'vue'

const a = ref(1)
const b = ref(2)

___(() => {
  console.log('soma:', a.value + b.value)
})
</script>`,
      blanks: ['watchEffect', 'watchEffect'],
      solution: `<script setup>
import { ref, watchEffect } from 'vue'

const a = ref(1)
const b = ref(2)

watchEffect(() => {
  console.log('soma:', a.value + b.value)
})
</script>`,
      hint: 'watchEffect rastreia automaticamente o que você lê dentro.',
    },
    {
      id: 'vue/reactivity/watch-effect/ch-2',
      type: 'fill-blank',
      title: 'Persistir em localStorage',
      description: 'Salve o valor de state automaticamente sempre que mudar.',
      xpReward: 30,
      requires: ['wfx-auto-track'],
      template: `<script setup>
import { ref, watchEffect } from 'vue'

const state = ref({ tema: 'dark' })

watchEffect(() => {
  localStorage.setItem('cfg', JSON.stringify(state.___))
})
</script>`,
      blanks: ['value'],
      solution: `<script setup>
import { ref, watchEffect } from 'vue'

const state = ref({ tema: 'dark' })

watchEffect(() => {
  localStorage.setItem('cfg', JSON.stringify(state.value))
})
</script>`,
      hint: 'Refs continuam exigindo .value dentro do callback.',
    },
    {
      id: 'vue/reactivity/watch-effect/ch-3',
      type: 'fill-blank',
      title: 'Cleanup de timer',
      description: 'Use onCleanup pra zerar o timer antes da próxima execução.',
      xpReward: 30,
      requires: ['wfx-cleanup'],
      template: `<script setup>
import { ref, watchEffect } from 'vue'

const intervalo = ref(1000)

watchEffect((___) => {
  const t = setInterval(() => console.log('tick'), intervalo.value)
  ___(() => clearInterval(t))
})
</script>`,
      blanks: ['onCleanup', 'onCleanup'],
      solution: `<script setup>
import { ref, watchEffect } from 'vue'

const intervalo = ref(1000)

watchEffect((onCleanup) => {
  const t = setInterval(() => console.log('tick'), intervalo.value)
  onCleanup(() => clearInterval(t))
})
</script>`,
      hint: 'onCleanup é argumento do callback — passe uma função pra ela.',
    },
    {
      id: 'vue/reactivity/watch-effect/ch-4',
      type: 'write-from-scratch',
      title: 'Tema na raiz do DOM',
      description: 'Crie um watchEffect que aplica o tema no <html> sempre que tema mudar.',
      xpReward: 30,
      requires: ['wfx-auto-track'],
      template: `<script setup>
import { ref, watchEffect } from 'vue'

const tema = ref('dark')

// adicione o watchEffect aqui

</script>`,
      solution: `<script setup>
import { ref, watchEffect } from 'vue'

const tema = ref('dark')

watchEffect(() => {
  document.documentElement.dataset.theme = tema.value
})
</script>`,
      hint: 'Leia tema.value dentro do watchEffect e aplique no DOM.',
    },
    {
      id: 'vue/reactivity/watch-effect/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o watchEffect',
      description: 'Três bugs no uso de watchEffect. Corrija todos.',
      xpReward: 100,
      requires: ['wfx-auto-track', 'wfx-no-old-value', 'wfx-cleanup'],
      buggyCode: `<script setup>
import { ref, watchEffect } from 'vue'

const id = ref(1)

// quero (novo, antigo)
watchEffect((novo, antigo) => {
  console.log(antigo, '->', novo)
})

// rastrear ref de forma incorreta
const state = ref(0)
watchEffect(() => {
  console.log('state vale', state)
})

// timer que vaza
watchEffect(() => {
  setInterval(() => console.log('tick'), 1000)
})
</script>`,
      solution: `<script setup>
import { ref, watch, watchEffect } from 'vue'

const id = ref(1)

watch(id, (novo, antigo) => {
  console.log(antigo, '->', novo)
})

const state = ref(0)
watchEffect(() => {
  console.log('state vale', state.value)
})

watchEffect((onCleanup) => {
  const t = setInterval(() => console.log('tick'), 1000)
  onCleanup(() => clearInterval(t))
})
</script>`,
      explanation: `watchEffect não dá novo/antigo — quem dá é watch.
'state' direto é um Ref (objeto), não o valor — leia state.value.
Timer sem cleanup vaza a cada nova execução — use onCleanup pra clearInterval.`,
    },
  ],
}

export default watchEffectLesson
