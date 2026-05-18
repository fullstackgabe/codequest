import type { Lesson } from '@/types/lesson'

const vForLesson: Lesson = {
  id: 'vue/directives/v-for',
  courseId: 'vue',
  moduleId: 'directives',
  title: 'v-for',
  icon: '🔁',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/built-in-directives#v-for',

  theory: [
    {
      tag: 'v-for-basic',
      title: 'v-for — itera arrays e objetos',
      body: `Use v-for="item in items" para renderizar uma lista.
Em arrays, item é cada elemento. Você pode capturar o índice: v-for="(item, idx) in items".
Funciona também em objetos: v-for="(value, key, idx) in obj".`,
      code: `<template>
  <ul>
    <li v-for="item in itens">{{ item }}</li>
  </ul>

  <ul>
    <li v-for="(item, i) in itens">{{ i }}: {{ item }}</li>
  </ul>
</template>`,
    },
    {
      tag: 'v-for-key',
      title: ':key — sempre que iterar',
      body: `Vue exige uma key única e estável em cada item para reconciliar a lista corretamente.
Use o ID da entidade (não o índice, que muda quando reordena).
Sem :key, Vue avisa em DEV e pode reusar nós errados.`,
      code: `<template>
  <ul>
    <li v-for="user in usuarios" :key="user.id">
      {{ user.nome }}
    </li>
  </ul>
</template>`,
    },
    {
      tag: 'v-for-template',
      title: 'Iterar grupos com <template v-for>',
      body: `Para repetir vários elementos sem wrapper, use <template v-for>.
A key vai no <template>.`,
      code: `<template>
  <dl>
    <template v-for="item in itens" :key="item.id">
      <dt>{{ item.titulo }}</dt>
      <dd>{{ item.descricao }}</dd>
    </template>
  </dl>
</template>`,
    },
    {
      tag: 'v-for-with-v-if',
      title: 'v-for + v-if: evite no mesmo elemento',
      body: `Em Vue 3, v-if tem prioridade maior que v-for no mesmo elemento — você acaba referenciando uma variável que ainda não existe.
Solução: envolva em <template v-for> e ponha v-if no filho.`,
      code: `<!-- ❌ ruim -->
<li v-for="x in itens" v-if="x.ativo">{{ x.nome }}</li>

<!-- ✅ -->
<template v-for="x in itens" :key="x.id">
  <li v-if="x.ativo">{{ x.nome }}</li>
</template>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/directives/v-for/fc-1',
      front: 'Como capturar o índice ao iterar?',
      back: 'v-for="(item, i) in items" — o segundo parâmetro é o índice.',
      requires: ['v-for-basic'],
    },
    {
      id: 'vue/directives/v-for/fc-2',
      front: 'Por que :key é importante?',
      back: `Permite ao Vue identificar cada item entre re-renders.
Sem ele, atualizações podem reusar nós errados (estado do filho, animações).`,
      requires: ['v-for-key'],
    },
    {
      id: 'vue/directives/v-for/fc-3',
      front: 'Como repetir múltiplos elementos sem wrapper?',
      back: '<template v-for="x in xs" :key="x.id"> ... </template>',
      requires: ['v-for-template'],
    },
    {
      id: 'vue/directives/v-for/fc-4',
      front: 'Por que evitar v-for + v-if no mesmo elemento?',
      back: 'v-if é avaliado antes de v-for; a variável do for ainda não existe. Use <template v-for> com v-if no filho.',
      requires: ['v-for-with-v-if'],
    },
  ],

  challenges: [
    {
      id: 'vue/directives/v-for/ch-1',
      type: 'fill-blank',
      title: 'Iterar lista simples',
      description: 'Renderize cada string como <li>.',
      xpReward: 20,
      requires: ['v-for-basic'],
      template: `<script setup>
import { ref } from 'vue'
const frutas = ref(['maçã', 'pera', 'uva'])
</script>

<template>
  <ul>
    <li v-___="fruta in frutas">{{ fruta }}</li>
  </ul>
</template>`,
      blanks: ['for'],
      solution: `<script setup>
import { ref } from 'vue'
const frutas = ref(['maçã', 'pera', 'uva'])
</script>

<template>
  <ul>
    <li v-for="fruta in frutas">{{ fruta }}</li>
  </ul>
</template>`,
      hint: 'A diretiva é v-for="x in xs".',
    },
    {
      id: 'vue/directives/v-for/ch-2',
      type: 'fill-blank',
      title: 'Iterar com :key',
      description: 'Liste usuários usando o id como key.',
      xpReward: 20,
      requires: ['v-for-key'],
      template: `<script setup>
import { ref } from 'vue'
const usuarios = ref([
  { id: 1, nome: 'Ana' },
  { id: 2, nome: 'Bruno' },
])
</script>

<template>
  <ul>
    <li v-for="u in usuarios" ___="u.id">{{ u.nome }}</li>
  </ul>
</template>`,
      blanks: [':key'],
      solution: `<script setup>
import { ref } from 'vue'
const usuarios = ref([
  { id: 1, nome: 'Ana' },
  { id: 2, nome: 'Bruno' },
])
</script>

<template>
  <ul>
    <li v-for="u in usuarios" :key="u.id">{{ u.nome }}</li>
  </ul>
</template>`,
      hint: ':key="u.id" liga ao identificador estável da entidade.',
    },
    {
      id: 'vue/directives/v-for/ch-3',
      type: 'fill-blank',
      title: 'Pegar o índice',
      description: 'Mostre "1. Ana", "2. Bruno"...',
      xpReward: 20,
      requires: ['v-for-basic'],
      template: `<script setup>
import { ref } from 'vue'
const usuarios = ref(['Ana', 'Bruno'])
</script>

<template>
  <ul>
    <li v-for="(nome, ___) in usuarios">{{ i + 1 }}. {{ nome }}</li>
  </ul>
</template>`,
      blanks: ['i'],
      solution: `<script setup>
import { ref } from 'vue'
const usuarios = ref(['Ana', 'Bruno'])
</script>

<template>
  <ul>
    <li v-for="(nome, i) in usuarios">{{ i + 1 }}. {{ nome }}</li>
  </ul>
</template>`,
      hint: 'Use a forma (item, indice).',
    },
    {
      id: 'vue/directives/v-for/ch-4',
      type: 'fill-blank',
      title: 'Filtrar com template + v-if',
      description: 'Liste só os usuários ativos sem v-for+v-if no mesmo elemento.',
      xpReward: 30,
      requires: ['v-for-with-v-if'],
      template: `<script setup>
import { ref } from 'vue'
const usuarios = ref([
  { id: 1, nome: 'Ana', ativo: true },
  { id: 2, nome: 'Bruno', ativo: false },
])
</script>

<template>
  <ul>
    <___ v-for="u in usuarios" :key="u.id">
      <li v-if="u.ativo">{{ u.nome }}</li>
    </___>
  </ul>
</template>`,
      blanks: ['template', 'template'],
      solution: `<script setup>
import { ref } from 'vue'
const usuarios = ref([
  { id: 1, nome: 'Ana', ativo: true },
  { id: 2, nome: 'Bruno', ativo: false },
])
</script>

<template>
  <ul>
    <template v-for="u in usuarios" :key="u.id">
      <li v-if="u.ativo">{{ u.nome }}</li>
    </template>
  </ul>
</template>`,
      hint: '<template v-for> + v-if no filho.',
    },
    {
      id: 'vue/directives/v-for/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o v-for',
      description: 'Quatro problemas em uma listagem. Corrija.',
      xpReward: 100,
      requires: ['v-for-basic', 'v-for-key', 'v-for-template', 'v-for-with-v-if'],
      buggyCode: `<script setup>
import { ref } from 'vue'
const usuarios = ref([
  { id: 1, nome: 'Ana', ativo: true },
  { id: 2, nome: 'Bruno', ativo: false },
])
</script>

<template>
  <ul>
    <li v-for="u of usuarios" v-if="u.ativo">{{ u.nome }}</li>
  </ul>

  <dl>
    <dt v-for="u in usuarios">{{ u.nome }}</dt>
    <dd>{{ u.id }}</dd>
  </dl>
</template>`,
      solution: `<script setup>
import { ref } from 'vue'
const usuarios = ref([
  { id: 1, nome: 'Ana', ativo: true },
  { id: 2, nome: 'Bruno', ativo: false },
])
</script>

<template>
  <ul>
    <template v-for="u in usuarios" :key="u.id">
      <li v-if="u.ativo">{{ u.nome }}</li>
    </template>
  </ul>

  <dl>
    <template v-for="u in usuarios" :key="u.id">
      <dt>{{ u.nome }}</dt>
      <dd>{{ u.id }}</dd>
    </template>
  </dl>
</template>`,
      explanation: `v-for usa "in" (não "of") no template.
Listas precisam de :key estável (use u.id).
Evite v-for + v-if no mesmo elemento — use <template v-for> + v-if no filho.
Para repetir vários elementos juntos (<dt>+<dd>), use <template v-for>.`,
    },
  ],
}

export default vForLesson
