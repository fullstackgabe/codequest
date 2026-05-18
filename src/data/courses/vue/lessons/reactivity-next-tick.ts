import type { Lesson } from '@/types/lesson'

const nextTickLesson: Lesson = {
  id: 'vue/reactivity/next-tick',
  courseId: 'vue',
  moduleId: 'reactivity',
  title: 'nextTick()',
  icon: '⏭️',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/general#nexttick',

  theory: [
    {
      tag: 'nt-batching',
      title: 'Batching: mutações não atualizam o DOM na hora',
      body: `Vue agrupa mutações reativas e atualiza o DOM em lote, no próximo "tick".
Logo após mutar uma ref, o DOM ainda não reflete o novo valor.
Por isso código que mede/lê o DOM imediatamente após uma mutação pode falhar.`,
      code: `<script setup>
import { ref } from 'vue'

const itens = ref([])
function add() {
  itens.value.push('novo')
  // DOM ainda não tem o item — render ocorre no próximo tick
}
</script>`,
    },
    {
      tag: 'nt-await',
      title: 'await nextTick() — espera o DOM atualizar',
      body: `nextTick retorna uma Promise que resolve após o DOM ter sido atualizado.
Use await dentro de async functions: você lê o DOM já com as mudanças aplicadas.`,
      code: `<script setup>
import { nextTick, ref } from 'vue'

const lista = ref([])
const ref_el = ref(null)

async function add() {
  lista.value.push('novo')
  await nextTick()
  console.log(ref_el.value.scrollHeight) // já reflete o item
}
</script>`,
    },
    {
      tag: 'nt-callback',
      title: 'Forma callback (sem await)',
      body: `nextTick também aceita um callback como argumento (sem await).
A função roda assim que o DOM for atualizado. Útil em código não-async.`,
      code: `<script setup>
import { nextTick, ref } from 'vue'

const aberto = ref(false)

function abrir() {
  aberto.value = true
  nextTick(() => {
    // foco no input que acabou de aparecer
    document.querySelector('input')?.focus()
  })
}
</script>`,
    },
    {
      tag: 'nt-when-not',
      title: 'Quando NÃO precisar',
      body: `Se você só lê valores reativos (não o DOM cru), nextTick é dispensável —
o template já estará certo no próximo render.
nextTick é necessário quando você manipula DOM diretamente
(refs em elementos, scrollHeight, focus, libs de terceiros).`,
      code: `<script setup>
import { ref } from 'vue'

const count = ref(0)

function inc() {
  count.value++
  // ❌ não precisa de nextTick
  // console.log(count.value) // já é o novo
}
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/reactivity/next-tick/fc-1',
      front: 'Por que mutar uma ref não atualiza o DOM imediatamente?',
      back: `Vue agrupa mutações em lote e re-renderiza no próximo "tick".
Isso evita renders desperdiçados quando várias mutações acontecem juntas.`,
      requires: ['nt-batching'],
    },
    {
      id: 'vue/reactivity/next-tick/fc-2',
      front: 'O que `await nextTick()` faz?',
      back: 'Espera o ciclo de render terminar — o DOM já estará atualizado quando a Promise resolver.',
      code: `state.value = novo
await nextTick()
// DOM atualizado aqui`,
      requires: ['nt-await'],
    },
    {
      id: 'vue/reactivity/next-tick/fc-3',
      front: 'Quando preciso de nextTick?',
      back: `Quando seu código depende do DOM já refletir a mudança:
medir scrollHeight, dar focus, chamar libs DOM-cru, screenshots etc.`,
      requires: ['nt-when-not'],
    },
    {
      id: 'vue/reactivity/next-tick/fc-4',
      front: 'Posso usar nextTick fora de função async?',
      back: 'Sim — passe um callback: nextTick(() => { ... }). Ele roda após o DOM atualizar.',
      requires: ['nt-callback'],
    },
  ],

  challenges: [
    {
      id: 'vue/reactivity/next-tick/ch-1',
      type: 'fill-blank',
      title: 'Esperar o DOM',
      description: 'Foque no input que aparece quando aberto vira true.',
      xpReward: 30,
      requires: ['nt-await'],
      template: `<script setup>
import { nextTick, ref } from 'vue'

const aberto = ref(false)
const inputEl = ref(null)

async function abrir() {
  aberto.value = true
  await ___()
  inputEl.value.focus()
}
</script>

<template>
  <button @click="abrir">abrir</button>
  <input v-if="aberto" ref="inputEl" />
</template>`,
      blanks: ['nextTick'],
      solution: `<script setup>
import { nextTick, ref } from 'vue'

const aberto = ref(false)
const inputEl = ref(null)

async function abrir() {
  aberto.value = true
  await nextTick()
  inputEl.value.focus()
}
</script>

<template>
  <button @click="abrir">abrir</button>
  <input v-if="aberto" ref="inputEl" />
</template>`,
      hint: 'await nextTick() pausa até o DOM ter renderizado a mudança.',
    },
    {
      id: 'vue/reactivity/next-tick/ch-2',
      type: 'fill-blank',
      title: 'Forma callback',
      description: 'Use a forma de callback (sem await).',
      xpReward: 30,
      requires: ['nt-callback'],
      template: `<script setup>
import { nextTick, ref } from 'vue'

const ativo = ref(false)
const el = ref(null)

function alternar() {
  ativo.value = !ativo.value
  nextTick(___ => {
    console.log(el.value?.offsetWidth)
  })
}
</script>

<template>
  <button @click="alternar">toggle</button>
  <div v-if="ativo" ref="el">conteúdo</div>
</template>`,
      blanks: ['()'],
      solution: `<script setup>
import { nextTick, ref } from 'vue'

const ativo = ref(false)
const el = ref(null)

function alternar() {
  ativo.value = !ativo.value
  nextTick(() => {
    console.log(el.value?.offsetWidth)
  })
}
</script>

<template>
  <button @click="alternar">toggle</button>
  <div v-if="ativo" ref="el">conteúdo</div>
</template>`,
      hint: 'Sem parâmetros: nextTick(() => …)',
    },
    {
      id: 'vue/reactivity/next-tick/ch-3',
      type: 'write-from-scratch',
      title: 'Scroll após adicionar',
      description: 'Após adicionar item, role pro fim da lista usando nextTick.',
      xpReward: 30,
      requires: ['nt-await'],
      template: `<script setup>
import { nextTick, ref } from 'vue'

const lista = ref([])
const containerEl = ref(null)

async function adicionar() {
  lista.value.push('item ' + (lista.value.length + 1))
  // espere o DOM atualizar e role pro fim
}
</script>

<template>
  <div ref="containerEl" style="height: 100px; overflow: auto;">
    <p v-for="x in lista" :key="x">{{ x }}</p>
  </div>
  <button @click="adicionar">add</button>
</template>`,
      solution: `<script setup>
import { nextTick, ref } from 'vue'

const lista = ref([])
const containerEl = ref(null)

async function adicionar() {
  lista.value.push('item ' + (lista.value.length + 1))
  await nextTick()
  containerEl.value.scrollTop = containerEl.value.scrollHeight
}
</script>

<template>
  <div ref="containerEl" style="height: 100px; overflow: auto;">
    <p v-for="x in lista" :key="x">{{ x }}</p>
  </div>
  <button @click="adicionar">add</button>
</template>`,
      hint: 'Após o push, aguarde nextTick e então defina scrollTop = scrollHeight.',
    },
    {
      id: 'vue/reactivity/next-tick/ch-4',
      type: 'fix-bug',
      title: 'DOM stale após mutação',
      description: 'O código lê scrollHeight antes do DOM atualizar. Conserte.',
      xpReward: 40,
      requires: ['nt-batching', 'nt-await'],
      buggyCode: `<script setup>
import { ref } from 'vue'

const lista = ref([])
const el = ref(null)

function add() {
  lista.value.push('x')
  console.log(el.value.scrollHeight) // valor antigo
}
</script>

<template>
  <div ref="el">
    <p v-for="x in lista" :key="x">{{ x }}</p>
  </div>
  <button @click="add">+</button>
</template>`,
      solution: `<script setup>
import { nextTick, ref } from 'vue'

const lista = ref([])
const el = ref(null)

async function add() {
  lista.value.push('x')
  await nextTick()
  console.log(el.value.scrollHeight)
}
</script>

<template>
  <div ref="el">
    <p v-for="x in lista" :key="x">{{ x }}</p>
  </div>
  <button @click="add">+</button>
</template>`,
      hint: 'Torne a função async, importe nextTick e use await antes de ler o DOM.',
    },
    {
      id: 'vue/reactivity/next-tick/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o nextTick',
      description: 'Três problemas de timing. Corrija todos.',
      xpReward: 100,
      requires: ['nt-batching', 'nt-await', 'nt-callback', 'nt-when-not'],
      buggyCode: `<script setup>
import { ref } from 'vue'

const aberto = ref(false)
const valor = ref(0)
const lista = ref([])
const containerEl = ref(null)
const inputEl = ref(null)

function abrir() {
  aberto.value = true
  inputEl.value.focus()  // ainda não existe
}

function incrementar() {
  valor.value++
  // checa imediatamente — mas é o DOM antigo:
  console.log('dom:', document.querySelector('.contador').innerText)
}

function adicionar() {
  lista.value.push('x')
  containerEl.value.scrollTop = containerEl.value.scrollHeight
}
</script>

<template>
  <button @click="abrir">abrir</button>
  <input v-if="aberto" ref="inputEl" />
  <p class="contador" @click="incrementar">{{ valor }}</p>
  <div ref="containerEl">
    <p v-for="x in lista" :key="x">{{ x }}</p>
  </div>
  <button @click="adicionar">add</button>
</template>`,
      solution: `<script setup>
import { nextTick, ref } from 'vue'

const aberto = ref(false)
const valor = ref(0)
const lista = ref([])
const containerEl = ref(null)
const inputEl = ref(null)

async function abrir() {
  aberto.value = true
  await nextTick()
  inputEl.value.focus()
}

function incrementar() {
  valor.value++
  nextTick(() => {
    console.log('dom:', document.querySelector('.contador')?.innerText)
  })
}

async function adicionar() {
  lista.value.push('x')
  await nextTick()
  containerEl.value.scrollTop = containerEl.value.scrollHeight
}
</script>

<template>
  <button @click="abrir">abrir</button>
  <input v-if="aberto" ref="inputEl" />
  <p class="contador" @click="incrementar">{{ valor }}</p>
  <div ref="containerEl">
    <p v-for="x in lista" :key="x">{{ x }}</p>
  </div>
  <button @click="adicionar">add</button>
</template>`,
      explanation: `Focar um input recém-criado precisa de await nextTick().
Ler o DOM cru após mutação também precisa esperar o tick (await ou callback).
Scrollar pra um item recém-adicionado precisa esperar o render concluir.`,
    },
  ],
}

export default nextTickLesson
