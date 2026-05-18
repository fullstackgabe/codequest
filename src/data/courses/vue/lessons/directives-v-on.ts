import type { Lesson } from '@/types/lesson'

const vOnLesson: Lesson = {
  id: 'vue/directives/v-on',
  courseId: 'vue',
  moduleId: 'directives',
  title: 'v-on',
  icon: '🖱️',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/built-in-directives#v-on',

  theory: [
    {
      tag: 'v-on-basics',
      title: 'v-on — listener de eventos',
      body: `v-on:event="handler" ouve eventos do DOM ou eventos emitidos por componentes.
Shorthand: @event. Handler pode ser uma referência a função, expressão inline ou método com args.`,
      code: `<template>
  <button v-on:click="incrementar">+1</button>
  <button @click="incrementar">+1 (shorthand)</button>

  <input @input="texto = $event.target.value" />
  <button @click="contar(2)">+2</button>
</template>`,
    },
    {
      tag: 'v-on-modifiers-event',
      title: 'Modificadores de evento',
      body: `.prevent → event.preventDefault()
.stop → event.stopPropagation()
.once → handler roda só uma vez
.passive → marca o listener como passivo (scroll mais fluido)`,
      code: `<template>
  <form @submit.prevent="enviar">
    <button>enviar</button>
  </form>

  <a @click.stop.prevent="abrirModal">não-link</a>
  <button @click.once="clicarApenasUmaVez">único</button>
</template>`,
    },
    {
      tag: 'v-on-key-modifiers',
      title: 'Modificadores de tecla',
      body: `@keyup.enter, @keyup.esc, @keyup.tab, @keydown.ctrl.s e por aí vai.
Aceita nomes nativos: enter, escape, space, arrow-up, etc.
Combine com modifiers de evento: @keyup.enter.stop.`,
      code: `<template>
  <input @keyup.enter="enviar" />
  <input @keydown.escape="fechar" />
  <input @keydown.ctrl.s.prevent="salvar" />
</template>`,
    },
    {
      tag: 'v-on-emit',
      title: 'Listener pra evento de componente',
      body: `Componentes filhos emitem eventos com emit('nome', payload).
No pai, você ouve igual: @nome="handler".
Eventos custom seguem kebab-case por convenção; o handler recebe o payload diretamente.`,
      code: `<template>
  <!-- pai -->
  <ContadorFilho @incrementar="(passo) => total += passo" />
</template>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/directives/v-on/fc-1',
      front: 'Qual o shorthand de v-on:click?',
      back: '@click',
      requires: ['v-on-basics'],
    },
    {
      id: 'vue/directives/v-on/fc-2',
      front: 'Como prevenir submit padrão de form?',
      back: '@submit.prevent="..." (equivale a event.preventDefault()).',
      requires: ['v-on-modifiers-event'],
    },
    {
      id: 'vue/directives/v-on/fc-3',
      front: 'Como ouvir Enter num input?',
      back: '@keyup.enter="handler"',
      requires: ['v-on-key-modifiers'],
    },
    {
      id: 'vue/directives/v-on/fc-4',
      front: 'Como ouvir um evento custom emitido por filho?',
      back: '@nome-do-evento="handler" no componente filho.',
      requires: ['v-on-emit'],
    },
  ],

  challenges: [
    {
      id: 'vue/directives/v-on/ch-1',
      type: 'fill-blank',
      title: 'Click simples',
      description: 'Use shorthand pra disparar incrementar ao clicar.',
      xpReward: 20,
      requires: ['v-on-basics'],
      template: `<script setup>
import { ref } from 'vue'
const total = ref(0)
function incrementar() { total.value++ }
</script>

<template>
  <button ___="incrementar">+1 ({{ total }})</button>
</template>`,
      blanks: ['@click'],
      solution: `<script setup>
import { ref } from 'vue'
const total = ref(0)
function incrementar() { total.value++ }
</script>

<template>
  <button @click="incrementar">+1 ({{ total }})</button>
</template>`,
      hint: '@click é o shorthand de v-on:click.',
    },
    {
      id: 'vue/directives/v-on/ch-2',
      type: 'fill-blank',
      title: 'Form sem reload',
      description: 'Submit sem recarregar a página.',
      xpReward: 30,
      requires: ['v-on-modifiers-event'],
      template: `<script setup>
function enviar() { console.log('enviou') }
</script>

<template>
  <form @submit.___="enviar">
    <button>enviar</button>
  </form>
</template>`,
      blanks: ['prevent'],
      solution: `<script setup>
function enviar() { console.log('enviou') }
</script>

<template>
  <form @submit.prevent="enviar">
    <button>enviar</button>
  </form>
</template>`,
      hint: '.prevent é o modificador que chama preventDefault().',
    },
    {
      id: 'vue/directives/v-on/ch-3',
      type: 'fill-blank',
      title: 'Enter no input',
      description: 'Dispare enviar() quando o usuário apertar Enter.',
      xpReward: 30,
      requires: ['v-on-key-modifiers'],
      template: `<script setup>
import { ref } from 'vue'
const texto = ref('')
function enviar() { console.log(texto.value) }
</script>

<template>
  <input v-model="texto" @keyup.___="enviar" />
</template>`,
      blanks: ['enter'],
      solution: `<script setup>
import { ref } from 'vue'
const texto = ref('')
function enviar() { console.log(texto.value) }
</script>

<template>
  <input v-model="texto" @keyup.enter="enviar" />
</template>`,
      hint: '@keyup.enter dispara só quando a tecla Enter é solta.',
    },
    {
      id: 'vue/directives/v-on/ch-4',
      type: 'write-from-scratch',
      title: 'Atalho Ctrl+S',
      description: 'Capture Ctrl+S sem deixar o browser salvar a página.',
      xpReward: 30,
      requires: ['v-on-modifiers-event', 'v-on-key-modifiers'],
      template: `<script setup>
function salvar() { console.log('salvou') }
</script>

<template>
  <!-- aplique o listener no input -->
  <input />
</template>`,
      solution: `<script setup>
function salvar() { console.log('salvou') }
</script>

<template>
  <input @keydown.ctrl.s.prevent="salvar" />
</template>`,
      hint: '@keydown.ctrl.s.prevent encadeia tecla + modifier de tecla + preventDefault.',
    },
    {
      id: 'vue/directives/v-on/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o v-on',
      description: 'Quatro problemas em handlers. Corrija.',
      xpReward: 100,
      requires: ['v-on-basics', 'v-on-modifiers-event', 'v-on-key-modifiers', 'v-on-emit'],
      buggyCode: `<script setup>
import { ref } from 'vue'

const total = ref(0)
const texto = ref('')

function incrementar(n) { total.value += n }
function enviar() { console.log(texto.value) }
function logar(payload) { console.log(payload) }
</script>

<template>
  <!-- chama a função imediatamente em vez de aguardar o click -->
  <button @click="incrementar(2)">+2</button>

  <!-- submit recarrega a página -->
  <form @submit="enviar">
    <input v-model="texto" />
  </form>

  <!-- listener errado pra Enter -->
  <input @enter="enviar" />

  <!-- evento custom em PascalCase -->
  <ContadorFilho @Incrementar="logar" />
</template>`,
      solution: `<script setup>
import { ref } from 'vue'

const total = ref(0)
const texto = ref('')

function incrementar(n) { total.value += n }
function enviar() { console.log(texto.value) }
function logar(payload) { console.log(payload) }
</script>

<template>
  <button @click="incrementar(2)">+2</button>

  <form @submit.prevent="enviar">
    <input v-model="texto" />
  </form>

  <input @keyup.enter="enviar" />

  <ContadorFilho @incrementar="logar" />
</template>`,
      explanation: `Chamar a função com argumentos é OK no template — Vue trata isso como inline expression.
@submit precisa de .prevent pra não recarregar.
Não existe @enter — use @keyup.enter (ou @keydown.enter).
Eventos custom são kebab-case por convenção: @incrementar, não @Incrementar.`,
    },
  ],
}

export default vOnLesson
