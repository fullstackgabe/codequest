import type { Lesson } from '@/types/lesson'

const reactiveLesson: Lesson = {
  id: 'vue/reactivity/reactive',
  courseId: 'vue',
  moduleId: 'reactivity',
  title: 'reactive()',
  icon: '🧬',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/reactivity-core#reactive',

  theory: [
    {
      tag: 'reactive-object',
      title: 'reactive() — proxy reativo de objeto',
      body: `Cria um proxy reativo a partir de um objeto ou array.
Diferente de ref(), não precisa de .value — acesse propriedades diretamente.
Vue rastreia leituras e escritas em propriedades aninhadas.`,
      code: `<script setup>
import { reactive } from 'vue'

const usuario = reactive({ nome: 'Ana', nivel: 1 })

console.log(usuario.nome)   // 'Ana' — sem .value
usuario.nivel = 2           // ✅ rastreado
</script>`,
    },
    {
      tag: 'reactive-limits',
      title: 'Limitação: só funciona com objetos',
      body: `reactive() não aceita primitivos (string, number, boolean).
Para primitivos, use ref().
Regra prática: ref() funciona pra tudo; reactive() é uma alternativa
ergonômica quando o estado é só um objeto/array.`,
      code: `<script setup>
import { reactive, ref } from 'vue'

const count = reactive(0)        // ❌ aviso em DEV — primitivo
const count2 = ref(0)            // ✅
const state = reactive({ x: 0 }) // ✅
const state2 = ref({ x: 0 })     // ✅ também funciona
</script>`,
    },
    {
      tag: 'reactive-destructure',
      title: 'Armadilha: desestruturação quebra reatividade',
      body: `Ao desestruturar um objeto reativo, você extrai valores soltos
que não estão mais ligados ao proxy.
Use toRefs() pra desestruturar mantendo a reatividade.`,
      code: `<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({ x: 1, y: 2 })

// ❌ x e y soltos — perdem reatividade
const { x, y } = state

// ✅ mantém ligação reativa
const { x: rx, y: ry } = toRefs(state)
</script>`,
    },
    {
      tag: 'reactive-replace',
      title: 'Armadilha: substituir o objeto inteiro',
      body: `Reatribuir o proxy pra outro objeto descarta o proxy original.
Componentes que dependiam observam o proxy antigo — perdem updates.
Mude propriedades, não o objeto inteiro. Se precisar trocar tudo,
use Object.assign() ou prefira ref().`,
      code: `<script setup>
import { reactive } from 'vue'

const state = reactive({ x: 1 })

// ❌ quebra reatividade
// state = { x: 2 }

// ✅ mutação propriedade a propriedade
state.x = 2

// ✅ alternativa: copia para o proxy existente
Object.assign(state, { x: 3 })
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/reactivity/reactive/fc-1',
      front: 'O que reactive() retorna?',
      back: 'Um proxy reativo do objeto/array passado. Acessos e mutações em propriedades são rastreados sem precisar de .value.',
      code: `<script setup>
const state = reactive({ x: 1 })
state.x++  // rastreado
</script>`,
      requires: ['reactive-object'],
    },
    {
      id: 'vue/reactivity/reactive/fc-2',
      front: 'Por que reactive() não aceita primitivos?',
      back: `reactive() usa Proxy — só objetos podem ser "embrulhados".
Para primitivos, use ref(), que cria um wrapper com .value.`,
      requires: ['reactive-limits'],
    },
    {
      id: 'vue/reactivity/reactive/fc-3',
      front: 'Como desestruturar um objeto reativo sem perder reatividade?',
      back: `Use toRefs(): converte cada propriedade em um Ref individual,
que mantém a ligação com o proxy original.`,
      code: `<script setup>
const { x, y } = toRefs(state)
// x e y são Refs — atualizam state.x / state.y
</script>`,
      requires: ['reactive-destructure'],
    },
    {
      id: 'vue/reactivity/reactive/fc-4',
      front: 'Posso reatribuir um objeto reactive() inteiro?',
      back: `Não — reatribuir descarta o proxy. Mude propriedades uma a uma
ou use Object.assign(state, novoObjeto) pra copiar pro proxy existente.`,
      requires: ['reactive-replace'],
    },
  ],

  challenges: [
    {
      id: 'vue/reactivity/reactive/ch-1',
      type: 'fill-blank',
      title: 'Crie um estado reativo',
      description: 'Use reactive() para criar um estado com nome e idade.',
      xpReward: 20,
      requires: ['reactive-object'],
      template: `<script setup>
import { ___ } from 'vue'

const pessoa = ___({ nome: 'Ana', idade: 30 })
</script>

<template>
  <p>{{ pessoa.nome }} — {{ pessoa.idade }} anos</p>
</template>`,
      blanks: ['reactive', 'reactive'],
      solution: `<script setup>
import { reactive } from 'vue'

const pessoa = reactive({ nome: 'Ana', idade: 30 })
</script>

<template>
  <p>{{ pessoa.nome }} — {{ pessoa.idade }} anos</p>
</template>`,
      hint: 'Importe reactive de "vue" e passe um objeto literal.',
    },
    {
      id: 'vue/reactivity/reactive/ch-2',
      type: 'fill-blank',
      title: 'Incremento direto',
      description: 'Diferente de ref(), aqui você muta propriedades sem .value.',
      xpReward: 20,
      requires: ['reactive-object'],
      template: `<script setup>
import { reactive } from 'vue'

const contador = reactive({ valor: 0 })

function incrementar() {
  contador.___ ++
}
</script>

<template>
  <button @click="incrementar">{{ contador.valor }}</button>
</template>`,
      blanks: ['valor'],
      solution: `<script setup>
import { reactive } from 'vue'

const contador = reactive({ valor: 0 })

function incrementar() {
  contador.valor ++
}
</script>

<template>
  <button @click="incrementar">{{ contador.valor }}</button>
</template>`,
      hint: 'Sem .value: muta a propriedade direto no proxy.',
    },
    {
      id: 'vue/reactivity/reactive/ch-3',
      type: 'fill-blank',
      title: 'Desestruturação segura com toRefs',
      description: 'Extraia x e y mantendo a reatividade usando toRefs.',
      xpReward: 30,
      requires: ['reactive-destructure'],
      template: `<script setup>
import { reactive, ___ } from 'vue'

const state = reactive({ x: 1, y: 2 })

const { x, y } = ___(state)
</script>

<template>
  <p>{{ x }} · {{ y }}</p>
</template>`,
      blanks: ['toRefs', 'toRefs'],
      solution: `<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({ x: 1, y: 2 })

const { x, y } = toRefs(state)
</script>

<template>
  <p>{{ x }} · {{ y }}</p>
</template>`,
      hint: 'toRefs() devolve um objeto onde cada propriedade vira um Ref.',
    },
    {
      id: 'vue/reactivity/reactive/ch-4',
      type: 'fill-blank',
      title: 'Substituir sem quebrar',
      description: 'Use Object.assign para copiar novos valores pro proxy existente.',
      xpReward: 30,
      requires: ['reactive-replace'],
      template: `<script setup>
import { reactive } from 'vue'

const state = reactive({ x: 1, y: 2 })

function reset() {
  ___.assign(state, { x: 0, y: 0 })
}
</script>

<template>
  <button @click="reset">reset</button>
  <p>{{ state.x }} · {{ state.y }}</p>
</template>`,
      blanks: ['Object'],
      solution: `<script setup>
import { reactive } from 'vue'

const state = reactive({ x: 1, y: 2 })

function reset() {
  Object.assign(state, { x: 0, y: 0 })
}
</script>

<template>
  <button @click="reset">reset</button>
  <p>{{ state.x }} · {{ state.y }}</p>
</template>`,
      hint: 'Object.assign(destino, fonte) copia para o proxy existente — não substitui.',
    },
    {
      id: 'vue/reactivity/reactive/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o reactive',
      description: 'Três bugs misturam mau uso de reactive(). Corrija todos.',
      xpReward: 100,
      requires: ['reactive-object', 'reactive-limits', 'reactive-destructure', 'reactive-replace'],
      buggyCode: `<script setup>
import { reactive } from 'vue'

let state = reactive(0)
const usuario = reactive({ nome: 'Ana', nivel: 1 })

const { nome, nivel } = usuario

function subir() {
  state = reactive(state + 1)
  nivel.value++
}
</script>

<template>
  <p>{{ state }} · {{ nome }} — nível {{ nivel }}</p>
  <button @click="subir">+1</button>
</template>`,
      solution: `<script setup>
import { reactive, ref, toRefs } from 'vue'

const state = ref(0)
const usuario = reactive({ nome: 'Ana', nivel: 1 })

const { nome, nivel } = toRefs(usuario)

function subir() {
  state.value++
  usuario.nivel++
}
</script>

<template>
  <p>{{ state }} · {{ nome }} — nível {{ nivel }}</p>
  <button @click="subir">+1</button>
</template>`,
      explanation: `reactive(0) não funciona em primitivos — troque por ref(0).
Desestruturação direta perde reatividade — use toRefs(usuario).
Reatribuir 'state' descarta o proxy — mute via .value (ref) ou propriedade do objeto.`,
    },
  ],
}

export default reactiveLesson
