import type { Lesson } from '@/types/lesson'

const vModelLesson: Lesson = {
  id: 'vue/directives/v-model',
  courseId: 'vue',
  moduleId: 'directives',
  title: 'v-model',
  icon: '🔄',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/built-in-directives#v-model',

  theory: [
    {
      tag: 'v-model-two-way',
      title: 'v-model — two-way data binding',
      body: `Açúcar sintático para :value + @input.
Em <input>, <textarea> e <select>, mantém o ref sincronizado com o valor digitado.
Direção: input → ref (digita atualiza ref) e ref → input (mudar ref atualiza UI).`,
      code: `<script setup>
import { ref } from 'vue'
const nome = ref('')
</script>

<template>
  <!-- estes dois são equivalentes -->
  <input v-model="nome" />
  <input :value="nome" @input="nome = $event.target.value" />
  <p>Olá {{ nome }}</p>
</template>`,
    },
    {
      tag: 'v-model-trim-number',
      title: 'Modificadores .trim e .number',
      body: `.trim → remove espaços nas pontas após digitar
.number → converte string pra number automaticamente (parseFloat)
Útil pra inputs numéricos e campos de texto que ignoram espaço inicial/final.`,
      code: `<template>
  <input v-model.trim="nome" />        <!-- "  Ana  " → "Ana" -->
  <input v-model.number="idade" />     <!-- "30" → 30 (number) -->
</template>`,
    },
    {
      tag: 'v-model-lazy',
      title: 'Modificador .lazy — atualiza no change',
      body: `Por padrão, v-model sincroniza a cada input.
.lazy troca pro evento change (atualiza quando o usuário sai do campo).
Útil pra evitar re-renders a cada tecla em campos longos.`,
      code: `<template>
  <textarea v-model.lazy="biografia"></textarea>
  <!-- biografia só atualiza quando o textarea perder foco -->
</template>`,
    },
    {
      tag: 'v-model-component',
      title: 'v-model em componente custom',
      body: `Pra um componente aceitar v-model, ele declara prop modelValue + emit 'update:modelValue'.
Vue mapeia v-model="x" automaticamente.
Múltiplos v-model: use argumento — v-model:nome="..." mapeia pra :nome e @update:nome.`,
      code: `<script setup>
<!-- pai -->
<MeuInput v-model="texto" />

<!-- filho (MeuInput.vue) -->
<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/directives/v-model/fc-1',
      front: 'v-model em <input> é açúcar pra quê?',
      back: ':value="x" + @input="x = $event.target.value"',
      requires: ['v-model-two-way'],
    },
    {
      id: 'vue/directives/v-model/fc-2',
      front: 'O que .number faz em v-model?',
      back: 'Converte a string digitada pra Number (parseFloat). Útil em inputs type="number".',
      requires: ['v-model-trim-number'],
    },
    {
      id: 'vue/directives/v-model/fc-3',
      front: 'Quando usar .lazy?',
      back: 'Quando você prefere sincronizar no change (sair do campo) em vez de a cada tecla.',
      requires: ['v-model-lazy'],
    },
    {
      id: 'vue/directives/v-model/fc-4',
      front: 'Como o filho aceita v-model?',
      back: `Declara prop "modelValue" e emite "update:modelValue".
Pra múltiplos modelos: v-model:nome → prop "nome" + emit "update:nome".`,
      requires: ['v-model-component'],
    },
  ],

  challenges: [
    {
      id: 'vue/directives/v-model/ch-1',
      type: 'fill-blank',
      title: 'Bind básico',
      description: 'Sincronize o ref `mensagem` com o input.',
      xpReward: 20,
      requires: ['v-model-two-way'],
      template: `<script setup>
import { ref } from 'vue'
const mensagem = ref('')
</script>

<template>
  <input ___="mensagem" />
  <p>{{ mensagem }}</p>
</template>`,
      blanks: ['v-model'],
      solution: `<script setup>
import { ref } from 'vue'
const mensagem = ref('')
</script>

<template>
  <input v-model="mensagem" />
  <p>{{ mensagem }}</p>
</template>`,
      hint: 'v-model="ref" sincroniza ambos os sentidos.',
    },
    {
      id: 'vue/directives/v-model/ch-2',
      type: 'fill-blank',
      title: 'Idade como número',
      description: 'Garanta que idade seja number sem precisar parse.',
      xpReward: 20,
      requires: ['v-model-trim-number'],
      template: `<script setup>
import { ref } from 'vue'
const idade = ref(0)
</script>

<template>
  <input v-model.___="idade" type="number" />
  <p>typeof idade: {{ typeof idade }}</p>
</template>`,
      blanks: ['number'],
      solution: `<script setup>
import { ref } from 'vue'
const idade = ref(0)
</script>

<template>
  <input v-model.number="idade" type="number" />
  <p>typeof idade: {{ typeof idade }}</p>
</template>`,
      hint: 'v-model.number converte pra Number automaticamente.',
    },
    {
      id: 'vue/directives/v-model/ch-3',
      type: 'fill-blank',
      title: 'Trim no nome',
      description: 'Remova espaços no início/fim ao digitar.',
      xpReward: 20,
      requires: ['v-model-trim-number'],
      template: `<script setup>
import { ref } from 'vue'
const nome = ref('')
</script>

<template>
  <input v-model.___="nome" />
  <p>"{{ nome }}"</p>
</template>`,
      blanks: ['trim'],
      solution: `<script setup>
import { ref } from 'vue'
const nome = ref('')
</script>

<template>
  <input v-model.trim="nome" />
  <p>"{{ nome }}"</p>
</template>`,
      hint: '.trim corta whitespace nas pontas após cada input.',
    },
    {
      id: 'vue/directives/v-model/ch-4',
      type: 'fill-blank',
      title: 'Textarea preguiçoso',
      description: 'Atualize só quando o textarea perder foco.',
      xpReward: 30,
      requires: ['v-model-lazy'],
      template: `<script setup>
import { ref } from 'vue'
const bio = ref('')
</script>

<template>
  <textarea v-model.___="bio"></textarea>
  <p>{{ bio }}</p>
</template>`,
      blanks: ['lazy'],
      solution: `<script setup>
import { ref } from 'vue'
const bio = ref('')
</script>

<template>
  <textarea v-model.lazy="bio"></textarea>
  <p>{{ bio }}</p>
</template>`,
      hint: '.lazy troca o evento de input pra change.',
    },
    {
      id: 'vue/directives/v-model/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o v-model',
      description: 'Quatro problemas com v-model. Corrija.',
      xpReward: 100,
      requires: ['v-model-two-way', 'v-model-trim-number', 'v-model-lazy', 'v-model-component'],
      buggyCode: `<script setup>
import { ref } from 'vue'

const nome = ref('')
const idade = ref(0)
const bio = ref('')
const filtro = ref('')
</script>

<template>
  <!-- bind manual em vez de v-model -->
  <input :value="nome" />

  <!-- idade fica como string -->
  <input v-model="idade" type="number" />

  <!-- biografia recarrega a cada tecla — pesado -->
  <textarea v-model="bio"></textarea>

  <!-- componente filho ignora o ref -->
  <MeuFiltro :modelValue="filtro" />
</template>`,
      solution: `<script setup>
import { ref } from 'vue'

const nome = ref('')
const idade = ref(0)
const bio = ref('')
const filtro = ref('')
</script>

<template>
  <input v-model="nome" />

  <input v-model.number="idade" type="number" />

  <textarea v-model.lazy="bio"></textarea>

  <MeuFiltro v-model="filtro" />
</template>`,
      explanation: `:value sozinho é só uma via — use v-model pra ler/escrever.
.number garante coerção pra Number.
.lazy evita re-render por tecla em textareas longos.
Em componentes que suportam v-model, use v-model em vez de passar :modelValue manualmente.`,
    },
  ],
}

export default vModelLesson
