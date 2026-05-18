import type { Lesson } from '@/types/lesson'

const exposeLesson: Lesson = {
  id: 'vue/communication/expose',
  courseId: 'vue',
  moduleId: 'communication',
  title: 'defineExpose',
  icon: '🪟',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/sfc-script-setup#defineexpose',

  theory: [
    {
      tag: 'expose-why',
      title: 'Por que defineExpose existe?',
      body: `<script setup> é fechado por padrão: nada é exposto pra fora.
Se o pai pegar uma ref do componente filho, não consegue ver as variáveis/métodos internos.
defineExpose abre seletivamente o que deve ser acessível externamente.`,
      code: `<!-- Filho.vue (sem expose) -->
<script setup>
import { ref } from 'vue'
const valor = ref(0)
function inc() { valor.value++ }
</script>

<!-- Pai.vue -->
<Filho ref="filho" />
filho.valor   // undefined — fechado!
filho.inc()   // undefined`,
    },
    {
      tag: 'expose-basic',
      title: 'defineExpose({ ... })',
      body: `defineExpose recebe um objeto com o que deve ficar público.
Refs continuam reativos lá fora, e métodos podem ser chamados via template ref.`,
      code: `<!-- Filho.vue -->
<script setup>
import { ref } from 'vue'
const valor = ref(0)
function inc() { valor.value++ }
defineExpose({ valor, inc })
</script>

<!-- Pai.vue -->
<Filho ref="filho" />
<script setup>
import { ref } from 'vue'
const filho = ref(null)
function disparar() {
  filho.value.inc()
  console.log(filho.value.valor)
}
</script>`,
    },
    {
      tag: 'expose-tipagem',
      title: 'Tipando o expose em TS',
      body: `Combinado com defineExpose, você pode declarar o tipo do que está sendo exposto
pra autocomplete no pai. Use ComponentExposed<T> ou InstanceType<typeof Filho>.`,
      code: `<!-- Filho.vue -->
<script setup lang="ts">
import { ref } from 'vue'
const valor = ref(0)
function inc() { valor.value++ }
defineExpose({ valor, inc })
</script>

<!-- Pai.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import type Filho from './Filho.vue'
const filhoRef = ref<InstanceType<typeof Filho> | null>(null)
filhoRef.value?.inc()  // tipado
</script>`,
    },
    {
      tag: 'expose-when-not',
      title: 'Quando NÃO usar defineExpose',
      body: `Expose deixa o componente acoplável demais — quem segura a ref pode chamar tudo.
Prefira eventos (emit) e props pra comunicação. Use expose só pra:
- imperativo de UI (focus, scrollIntoView, abrir modal)
- métodos que não combinam com fluxo declarativo`,
      code: `<!-- exemplos legítimos -->
<MeuInput ref="input" />
input.value.focus()

<MeuModal ref="modal" />
modal.value.abrir()`,
    },
  ],

  flashcards: [
    {
      id: 'vue/communication/expose/fc-1',
      front: 'Por padrão, o que do <script setup> é acessível pelo pai?',
      back: 'Nada. O setup é fechado — pai precisa de defineExpose pra acessar refs/métodos.',
      requires: ['expose-why'],
    },
    {
      id: 'vue/communication/expose/fc-2',
      front: 'Como expor "inc" pro pai?',
      back: 'defineExpose({ inc }). Depois o pai chama via filhoRef.value.inc().',
      requires: ['expose-basic'],
    },
    {
      id: 'vue/communication/expose/fc-3',
      front: 'Como tipar o ref do filho em TS?',
      back: 'ref<InstanceType<typeof Filho> | null>(null) — combinado com defineExpose dá autocomplete.',
      requires: ['expose-tipagem'],
    },
    {
      id: 'vue/communication/expose/fc-4',
      front: 'Quando expose é boa ideia?',
      back: 'Pra ações imperativas de UI: focus, abrir modal, scroll. Pra dados, prefira props/emit.',
      requires: ['expose-when-not'],
    },
  ],

  challenges: [
    {
      id: 'vue/communication/expose/ch-1',
      type: 'fill-blank',
      title: 'Expor um método',
      description: 'Permita o pai chamar focar() neste componente input.',
      xpReward: 20,
      requires: ['expose-basic'],
      template: `<script setup>
import { ref } from 'vue'
const inputEl = ref(null)
function focar() { inputEl.value?.focus() }

___({ focar })
</script>

<template>
  <input ref="inputEl" />
</template>`,
      blanks: ['defineExpose'],
      solution: `<script setup>
import { ref } from 'vue'
const inputEl = ref(null)
function focar() { inputEl.value?.focus() }

defineExpose({ focar })
</script>

<template>
  <input ref="inputEl" />
</template>`,
      hint: 'defineExpose({ ... }) expõe seletivamente.',
    },
    {
      id: 'vue/communication/expose/ch-2',
      type: 'fill-blank',
      title: 'Expor ref reativo',
      description: 'Permita o pai ler "valor" diretamente.',
      xpReward: 30,
      requires: ['expose-basic'],
      template: `<script setup>
import { ref } from 'vue'
const valor = ref(0)
function inc() { valor.value++ }

defineExpose({ ___, ___ })
</script>

<template>
  <button @click="inc">+1</button>
</template>`,
      blanks: ['valor', 'inc'],
      solution: `<script setup>
import { ref } from 'vue'
const valor = ref(0)
function inc() { valor.value++ }

defineExpose({ valor, inc })
</script>

<template>
  <button @click="inc">+1</button>
</template>`,
      hint: 'Inclua tanto a ref "valor" quanto o método "inc" no objeto.',
    },
    {
      id: 'vue/communication/expose/ch-3',
      type: 'fill-blank',
      title: 'Pai usando expose',
      description: 'Capture o filho via template ref e dispare focar() ao montar.',
      xpReward: 30,
      requires: ['expose-basic'],
      template: `<script setup>
import { ref, onMounted } from 'vue'
import MeuInput from './MeuInput.vue'

const filhoRef = ___(null)

onMounted(() => {
  filhoRef.value?.focar()
})
</script>

<template>
  <MeuInput ref="filhoRef" />
</template>`,
      blanks: ['ref'],
      solution: `<script setup>
import { ref, onMounted } from 'vue'
import MeuInput from './MeuInput.vue'

const filhoRef = ref(null)

onMounted(() => {
  filhoRef.value?.focar()
})
</script>

<template>
  <MeuInput ref="filhoRef" />
</template>`,
      hint: 'Crie um ref(null) e use o atributo ref="filhoRef" no template.',
    },
    {
      id: 'vue/communication/expose/ch-4',
      type: 'write-from-scratch',
      title: 'Modal com expose',
      description: 'Exponha métodos abrir() e fechar() que alternam um ref aberto.',
      xpReward: 30,
      requires: ['expose-basic', 'expose-when-not'],
      template: `<script setup>
import { ref } from 'vue'

const aberto = ref(false)
// declare abrir e fechar, depois exponha
</script>

<template>
  <div v-if="aberto">modal</div>
</template>`,
      solution: `<script setup>
import { ref } from 'vue'

const aberto = ref(false)
function abrir() { aberto.value = true }
function fechar() { aberto.value = false }

defineExpose({ abrir, fechar })
</script>

<template>
  <div v-if="aberto">modal</div>
</template>`,
      hint: 'Defina abrir/fechar e passe { abrir, fechar } pra defineExpose.',
    },
    {
      id: 'vue/communication/expose/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o expose',
      description: 'Três problemas no padrão pai/filho. Corrija.',
      xpReward: 100,
      requires: ['expose-why', 'expose-basic', 'expose-when-not'],
      buggyCode: `<!-- Pai.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import InputComFoco from './InputComFoco.vue'

const inputRef = null

onMounted(() => {
  inputRef.focar()
})
</script>

<template>
  <InputComFoco :ref="inputRef" />
</template>

<!-- InputComFoco.vue -->
<script setup>
import { ref } from 'vue'
const inputEl = ref(null)
function focar() {
  inputEl.value?.focus()
}
// faltou expor
</script>

<template>
  <input ref="inputEl" />
</template>`,
      solution: `<!-- Pai.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import InputComFoco from './InputComFoco.vue'

const inputRef = ref(null)

onMounted(() => {
  inputRef.value?.focar()
})
</script>

<template>
  <InputComFoco ref="inputRef" />
</template>

<!-- InputComFoco.vue -->
<script setup>
import { ref } from 'vue'
const inputEl = ref(null)
function focar() {
  inputEl.value?.focus()
}
defineExpose({ focar })
</script>

<template>
  <input ref="inputEl" />
</template>`,
      explanation: `inputRef precisa ser um ref(null) reativo — não null fixo.
Atributo ref="..." (sem :) referencia o nome do template ref.
Sem defineExpose, focar() não é visível externamente.
No pai, acessa via inputRef.value (não direto inputRef).`,
    },
  ],
}

export default exposeLesson
