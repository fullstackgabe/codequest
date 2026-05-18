import type { Lesson } from '@/types/lesson'

const vBindLesson: Lesson = {
  id: 'vue/directives/v-bind',
  courseId: 'vue',
  moduleId: 'directives',
  title: 'v-bind',
  icon: '🔗',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/built-in-directives#v-bind',

  theory: [
    {
      tag: 'v-bind-basics',
      title: 'v-bind — atributos dinâmicos',
      body: `v-bind:attr="expr" liga um atributo (ou prop) ao valor de uma expressão JS.
Shorthand: ":attr". Use para tudo que precisa de valor reativo no HTML —
href, src, id, disabled, value, e props de componentes.`,
      code: `<template>
  <a v-bind:href="url">link</a>
  <a :href="url">mesma coisa, shorthand</a>

  <img :src="avatarUrl" :alt="nome" />
  <button :disabled="carregando">enviar</button>
</template>`,
    },
    {
      tag: 'v-bind-class',
      title: ':class — objeto, array e condição',
      body: `:class aceita string, objeto { classe: cond }, array, ou mistura.
Vue mescla com a classe estática já presente no elemento.`,
      code: `<template>
  <div
    class="base"
    :class="{ ativo: estaAtivo, erro: temErro }"
  />

  <div :class="[temaCss, { ativo: estaAtivo }]" />
</template>`,
    },
    {
      tag: 'v-bind-style',
      title: ':style — camelCase ou kebab-case',
      body: `:style aceita objeto onde chaves podem ser camelCase ou 'kebab-case' (string).
Aceita arrays pra combinar múltiplos objetos.
Valores numéricos sem unidade NÃO viram px — você precisa concatenar.`,
      code: `<template>
  <div :style="{ color: cor, fontSize: tamanho + 'px' }" />
  <div :style="[base, { color: 'red' }]" />
</template>`,
    },
    {
      tag: 'v-bind-object',
      title: 'v-bind sem argumento — espalhar objeto',
      body: `v-bind="{ a, b, c }" sem nome aplica todas as propriedades do objeto como atributos/props.
Muito útil para repassar props pra componentes filhos.`,
      code: `<template>
  <!-- aplica id, type, placeholder de uma vez -->
  <input v-bind="inputAttrs" />

  <!-- repassar tudo pro filho -->
  <BotaoBase v-bind="$attrs" />
</template>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/directives/v-bind/fc-1',
      front: 'Qual o shorthand de v-bind:href="url"?',
      back: ':href="url"',
      requires: ['v-bind-basics'],
    },
    {
      id: 'vue/directives/v-bind/fc-2',
      front: 'Como aplicar uma classe condicionalmente?',
      back: ':class="{ ativo: estaAtivo }" — chave é o nome da classe, valor é a condição.',
      requires: ['v-bind-class'],
    },
    {
      id: 'vue/directives/v-bind/fc-3',
      front: 'Por que 20 em font-size não vira 20px automaticamente?',
      back: 'Vue não adiciona "px" — passe a string completa: fontSize: tamanho + "px".',
      requires: ['v-bind-style'],
    },
    {
      id: 'vue/directives/v-bind/fc-4',
      front: 'O que faz v-bind="objeto" sem argumento?',
      back: 'Espalha todas as propriedades como atributos/props no elemento.',
      requires: ['v-bind-object'],
    },
  ],

  challenges: [
    {
      id: 'vue/directives/v-bind/ch-1',
      type: 'fill-blank',
      title: 'Link dinâmico',
      description: 'Ligue o href ao ref `url` (shorthand).',
      xpReward: 20,
      requires: ['v-bind-basics'],
      template: `<script setup>
import { ref } from 'vue'
const url = ref('https://vuejs.org')
</script>

<template>
  <a ___="url">Vue</a>
</template>`,
      blanks: [':href'],
      solution: `<script setup>
import { ref } from 'vue'
const url = ref('https://vuejs.org')
</script>

<template>
  <a :href="url">Vue</a>
</template>`,
      hint: 'Shorthand de v-bind:href é :href.',
    },
    {
      id: 'vue/directives/v-bind/ch-2',
      type: 'fill-blank',
      title: 'Classe condicional',
      description: 'Adicione a classe "ativo" só quando selecionado for true.',
      xpReward: 20,
      requires: ['v-bind-class'],
      template: `<script setup>
import { ref } from 'vue'
const selecionado = ref(true)
</script>

<template>
  <div class="card" :class="{ ___: selecionado }">card</div>
</template>`,
      blanks: ['ativo'],
      solution: `<script setup>
import { ref } from 'vue'
const selecionado = ref(true)
</script>

<template>
  <div class="card" :class="{ ativo: selecionado }">card</div>
</template>`,
      hint: 'Objeto: { nomeDaClasse: condicao }.',
    },
    {
      id: 'vue/directives/v-bind/ch-3',
      type: 'fill-blank',
      title: 'Estilo dinâmico',
      description: 'Aplique color e fontSize via :style.',
      xpReward: 30,
      requires: ['v-bind-style'],
      template: `<script setup>
import { ref } from 'vue'
const cor = ref('tomato')
const tamanho = ref(20)
</script>

<template>
  <p ___="{ color: cor, fontSize: tamanho + 'px' }">olá</p>
</template>`,
      blanks: [':style'],
      solution: `<script setup>
import { ref } from 'vue'
const cor = ref('tomato')
const tamanho = ref(20)
</script>

<template>
  <p :style="{ color: cor, fontSize: tamanho + 'px' }">olá</p>
</template>`,
      hint: 'Use :style com objeto.',
    },
    {
      id: 'vue/directives/v-bind/ch-4',
      type: 'fill-blank',
      title: 'Espalhar atributos',
      description: 'Aplique todas as props do objeto attrs no input.',
      xpReward: 30,
      requires: ['v-bind-object'],
      template: `<script setup>
import { ref } from 'vue'
const attrs = ref({ id: 'meu-input', placeholder: 'Digite', maxlength: 10 })
</script>

<template>
  <input ___="attrs" />
</template>`,
      blanks: ['v-bind'],
      solution: `<script setup>
import { ref } from 'vue'
const attrs = ref({ id: 'meu-input', placeholder: 'Digite', maxlength: 10 })
</script>

<template>
  <input v-bind="attrs" />
</template>`,
      hint: 'v-bind sem argumento aplica todas as propriedades.',
    },
    {
      id: 'vue/directives/v-bind/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o v-bind',
      description: 'Quatro problemas em bindings. Corrija.',
      xpReward: 100,
      requires: ['v-bind-basics', 'v-bind-class', 'v-bind-style', 'v-bind-object'],
      buggyCode: `<script setup>
import { ref } from 'vue'

const url = ref('https://vuejs.org')
const ativo = ref(true)
const tamanho = ref(16)
const inputAttrs = ref({ placeholder: 'digite', maxlength: 10 })
</script>

<template>
  <!-- url estático em vez de bind -->
  <a href="url">link</a>

  <!-- classe ativa sem ligar à ref -->
  <div class="ativo">card</div>

  <!-- fontSize sem unidade vira inválido -->
  <p :style="{ fontSize: tamanho }">texto</p>

  <!-- atributos passados como string -->
  <input :inputAttrs="inputAttrs" />
</template>`,
      solution: `<script setup>
import { ref } from 'vue'

const url = ref('https://vuejs.org')
const ativo = ref(true)
const tamanho = ref(16)
const inputAttrs = ref({ placeholder: 'digite', maxlength: 10 })
</script>

<template>
  <a :href="url">link</a>

  <div :class="{ ativo }">card</div>

  <p :style="{ fontSize: tamanho + 'px' }">texto</p>

  <input v-bind="inputAttrs" />
</template>`,
      explanation: `href="url" passa a string literal "url" — use :href="url" pra ligar à ref.
class="ativo" é estática; pra condicionar use :class.
fontSize numérico precisa de unidade em string ('px', 'rem'…).
Pra espalhar um objeto de atributos use v-bind="obj" sem nome.`,
    },
  ],
}

export default vBindLesson
