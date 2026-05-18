import type { Lesson } from '@/types/lesson'

const watchLesson: Lesson = {
  id: 'vue/reactivity/watch',
  courseId: 'vue',
  moduleId: 'reactivity',
  title: 'watch()',
  icon: '👀',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/reactivity-core#watch',

  theory: [
    {
      tag: 'watch-basics',
      title: 'watch() — efeito colateral em mudança',
      body: `Observa uma ou mais fontes reativas e roda um callback quando elas mudam.
Diferente de computed, watch é pra efeitos colaterais (fetch, log, persistência).
O callback recebe (novoValor, valorAntigo, onCleanup).`,
      code: `<script setup>
import { ref, watch } from 'vue'

const id = ref(1)

watch(id, (novo, antigo) => {
  console.log('id mudou', { antigo, novo })
})
</script>`,
    },
    {
      tag: 'watch-immediate',
      title: 'Opção immediate: rodar logo no setup',
      body: `Por padrão, watch só dispara na primeira mudança após o setup.
Para executar uma vez já no início (útil pra carregar dados), passe { immediate: true }.`,
      code: `<script setup>
import { ref, watch } from 'vue'

const userId = ref(1)

watch(userId, async (id) => {
  const user = await fetch('/api/users/' + id).then(r => r.json())
  console.log(user)
}, { immediate: true })
</script>`,
    },
    {
      tag: 'watch-deep',
      title: 'Opção deep: observar objetos aninhados',
      body: `Por padrão, watch detecta troca de referência — mutar propriedades de um objeto
não dispara o callback. Use { deep: true } para observar mudanças aninhadas.
Custa mais, então use só quando necessário.`,
      code: `<script setup>
import { reactive, watch } from 'vue'

const state = reactive({ user: { nome: 'Ana' } })

watch(state, () => {
  console.log('algo no state mudou')
}, { deep: true })

state.user.nome = 'Bruno' // dispara
</script>`,
    },
    {
      tag: 'watch-multiple-sources',
      title: 'Múltiplas fontes em um único watch',
      body: `Passe um array de fontes — o callback recebe arrays paralelos de [novosValores] e [antigosValores].
Útil para reagir a combinação de variáveis sem encadear vários watchs.`,
      code: `<script setup>
import { ref, watch } from 'vue'

const x = ref(0)
const y = ref(0)

watch([x, y], ([nx, ny], [ox, oy]) => {
  console.log(\`(\${ox},\${oy}) -> (\${nx},\${ny})\`)
})
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/reactivity/watch/fc-1',
      front: 'Qual a assinatura padrão do callback de watch?',
      back: '(novoValor, valorAntigo, onCleanup) — onCleanup recebe uma função pra desfazer recursos antes do próximo run.',
      requires: ['watch-basics'],
    },
    {
      id: 'vue/reactivity/watch/fc-2',
      front: 'O que faz a opção `immediate: true`?',
      back: 'Roda o callback uma vez logo no setup, antes de qualquer mudança real.',
      code: `<script setup>
watch(src, cb, { immediate: true })
</script>`,
      requires: ['watch-immediate'],
    },
    {
      id: 'vue/reactivity/watch/fc-3',
      front: 'Quando preciso de `deep: true`?',
      back: `Quando a fonte é um objeto/array reativo e você quer reagir a mutações de propriedades aninhadas
(não só substituições do objeto inteiro).`,
      requires: ['watch-deep'],
    },
    {
      id: 'vue/reactivity/watch/fc-4',
      front: 'Como observar várias fontes ao mesmo tempo?',
      back: `Passe um array: watch([a, b], ([na, nb], [oa, ob]) => …).
O callback recebe arrays paralelos de novos e antigos valores.`,
      requires: ['watch-multiple-sources'],
    },
  ],

  challenges: [
    {
      id: 'vue/reactivity/watch/ch-1',
      type: 'fill-blank',
      title: 'Watch básico',
      description: 'Logue antes e depois sempre que count mudar.',
      xpReward: 20,
      requires: ['watch-basics'],
      template: `<script setup>
import { ref, ___ } from 'vue'

const count = ref(0)

___(count, (novo, antigo) => {
  console.log(antigo, '->', novo)
})
</script>`,
      blanks: ['watch', 'watch'],
      solution: `<script setup>
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (novo, antigo) => {
  console.log(antigo, '->', novo)
})
</script>`,
      hint: 'Importe watch de "vue" e chame watch(fonte, callback).',
    },
    {
      id: 'vue/reactivity/watch/ch-2',
      type: 'fill-blank',
      title: 'Carregar usuário ao montar (immediate)',
      description: 'Use immediate para já carregar no setup, sem esperar mudança.',
      xpReward: 30,
      requires: ['watch-immediate'],
      template: `<script setup>
import { ref, watch } from 'vue'

const userId = ref(1)
const usuario = ref(null)

watch(userId, async (id) => {
  usuario.value = await fetch('/api/users/' + id).then(r => r.json())
}, { ___: true })
</script>`,
      blanks: ['immediate'],
      solution: `<script setup>
import { ref, watch } from 'vue'

const userId = ref(1)
const usuario = ref(null)

watch(userId, async (id) => {
  usuario.value = await fetch('/api/users/' + id).then(r => r.json())
}, { immediate: true })
</script>`,
      hint: 'A opção que faz o callback rodar logo de cara é { immediate: true }.',
    },
    {
      id: 'vue/reactivity/watch/ch-3',
      type: 'fill-blank',
      title: 'Watch profundo em objeto',
      description: 'Observe mutações em propriedades aninhadas do form.',
      xpReward: 30,
      requires: ['watch-deep'],
      template: `<script setup>
import { reactive, watch } from 'vue'

const form = reactive({ user: { nome: '' } })

watch(form, () => {
  console.log('form mudou')
}, { ___: true })
</script>`,
      blanks: ['deep'],
      solution: `<script setup>
import { reactive, watch } from 'vue'

const form = reactive({ user: { nome: '' } })

watch(form, () => {
  console.log('form mudou')
}, { deep: true })
</script>`,
      hint: 'Sem deep, watch não enxerga mudanças em propriedades aninhadas.',
    },
    {
      id: 'vue/reactivity/watch/ch-4',
      type: 'fill-blank',
      title: 'Múltiplas fontes',
      description: 'Logue x e y quando qualquer um deles mudar.',
      xpReward: 40,
      requires: ['watch-multiple-sources'],
      template: `<script setup>
import { ref, watch } from 'vue'

const x = ref(0)
const y = ref(0)

watch([___, ___], ([nx, ny]) => {
  console.log(nx, ny)
})
</script>`,
      blanks: ['x', 'y'],
      solution: `<script setup>
import { ref, watch } from 'vue'

const x = ref(0)
const y = ref(0)

watch([x, y], ([nx, ny]) => {
  console.log(nx, ny)
})
</script>`,
      hint: 'Array de fontes vai como primeiro argumento de watch.',
    },
    {
      id: 'vue/reactivity/watch/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o watch',
      description: 'Três bugs no uso de watch. Corrija todos.',
      xpReward: 100,
      requires: ['watch-basics', 'watch-immediate', 'watch-deep', 'watch-multiple-sources'],
      buggyCode: `<script setup>
import { reactive, ref, watch } from 'vue'

const x = ref(0)
const y = ref(0)
const form = reactive({ user: { nome: '' } })

// quero logar sempre que x OU y mudarem
watch(x, ([nx, ny]) => {
  console.log(nx, ny)
})

// quero rodar logo no setup pra carregar dados
const id = ref(1)
watch(id, async (i) => {
  console.log('load', i)
})

// quero observar mudanças aninhadas em form.user.nome
watch(form, () => {
  console.log('form mudou')
})
</script>`,
      solution: `<script setup>
import { reactive, ref, watch } from 'vue'

const x = ref(0)
const y = ref(0)
const form = reactive({ user: { nome: '' } })

watch([x, y], ([nx, ny]) => {
  console.log(nx, ny)
})

const id = ref(1)
watch(id, async (i) => {
  console.log('load', i)
}, { immediate: true })

watch(form, () => {
  console.log('form mudou')
}, { deep: true })
</script>`,
      explanation: `Pra observar várias fontes use array: watch([x, y], ...).
Pra rodar logo no setup, passe { immediate: true }.
Pra detectar mutações aninhadas em objeto reativo, use { deep: true }.`,
    },
  ],
}

export default watchLesson
