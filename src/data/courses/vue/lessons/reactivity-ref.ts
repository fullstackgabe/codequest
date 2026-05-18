import type { Lesson } from '@/types/lesson'

const refLesson: Lesson = {
  id: 'vue/reactivity/ref',
  courseId: 'vue',
  moduleId: 'reactivity',
  title: 'ref()',
  icon: '📦',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/reactivity-core#ref',

  theory: [
    {
      tag: 'ref-value',
      title: 'ref() — referência reativa',
      body: `Cria uma Ref reativa a partir de qualquer valor (primitivo ou objeto).
O valor passado fica acessível em .value.
Vue rastreia .value e re-renderiza o template que depende dela.`,
      code: `<script setup>
import { ref } from 'vue'

const nome = ref('Vue')      // Ref<string>
const pontos = ref(0)        // Ref<number>
const ativo = ref(true)      // Ref<boolean>
</script>`,
    },
    {
      tag: 'ref-dot-value',
      title: '.value: leitura e mutação',
      body: `No script, leia e altere o valor sempre via .value.
No template, Vue desembrulha refs automaticamente — use sem .value.`,
      code: `<script setup>
import { ref } from 'vue'

const count = ref(0)

function incrementar() {
  // leitura + escrita rastreadas
  count.value++
}
</script>

<template>
  <!-- unwrapping automático -->
  <p>{{ count }}</p>
  <button @click="incrementar">+1</button>
</template>`,
    },
    {
      tag: 'ref-objects',
      title: 'ref() com objetos e arrays',
      body: `Quando o valor é objeto ou array, Vue o envolve em um proxy reativo (reactive() interno).
Propriedades aninhadas são rastreadas automaticamente.
Para trocar o objeto inteiro, reatribua .value (não a variável).`,
      code: `<script setup>
import { ref } from 'vue'

const usuario = ref({ nome: 'Ana', nivel: 1 })

// mutação de propriedade — rastreada
usuario.value.nome = 'Bruno'

// substituição do objeto inteiro — rastreada
usuario.value = { nome: 'Carol', nivel: 5 }
</script>`,
    },
    {
      tag: 'ref-pitfall',
      title: 'Armadilha: reatribuir a variável',
      body: `Reatribuir a variável substitui a Ref original por um valor cru ou outra Ref.
O template continua observando a Ref antiga — re-renders param.
Regra: mude .value, nunca a variável.`,
      code: `<script setup>
import { ref } from 'vue'

const count = ref(0)

function errado() {
  count = 5          // ❌ substitui a Ref
  count = ref(5)     // ❌ substitui a Ref
}

function certo() {
  count.value = 5    // ✅ muta o valor
  count.value++      // ✅ muta o valor
}
</script>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/reactivity/ref/fc-1',
      front: 'O que ref() retorna?',
      back: `Um objeto ref reativo e mutável.
O valor fica em .value; leituras e escritas são rastreadas.`,
      code: `const count = ref(0)
// count.value === 0`,
      requires: ['ref-value'],
    },
    {
      id: 'vue/reactivity/ref/fc-2',
      front: 'Quando usar .value?',
      back: `Sempre no script para ler ou alterar o valor.
No template, Vue desembrulha automaticamente.`,
      code: `// script: count.value++
// template: {{ count }}`,
      requires: ['ref-dot-value'],
    },
    {
      id: 'vue/reactivity/ref/fc-3',
      front: 'Como ref() trata objetos e arrays?',
      back: `Vue envolve em um proxy reativo (reactive() interno).
Propriedades aninhadas são rastreadas automaticamente.`,
      code: `const user = ref({ nome: 'Ana' })
user.value.nome = 'Bruno'   // rastreado`,
      requires: ['ref-objects'],
    },
    {
      id: 'vue/reactivity/ref/fc-4',
      front: 'Por que reatribuir a variável quebra a reatividade?',
      back: `A reatribuição substitui a Ref original por outro valor.
O template observa a Ref antiga, que ninguém atualiza — re-renders param.`,
      code: `// ❌ count = 5
// ✅ count.value = 5`,
      requires: ['ref-pitfall'],
    },
  ],

  challenges: [
    {
      id: 'vue/reactivity/ref/ch-1',
      type: 'fill-blank',
      title: 'Declare uma ref',
      description: 'Crie uma ref `mensagem` com "Olá, Vue!" e renderize.',
      xpReward: 20,
      requires: ['ref-value'],
      template: `<script setup>
import { ___ } from 'vue'

const mensagem = ___('Olá, Vue!')
</script>

<template>
  <p>{{ ___ }}</p>
</template>`,
      blanks: ['ref', 'ref', 'mensagem'],
      solution: `<script setup>
import { ref } from 'vue'

const mensagem = ref('Olá, Vue!')
</script>

<template>
  <p>{{ mensagem }}</p>
</template>`,
      hint: 'Importe ref, chame ref(valor), use no template.',
    },
    {
      id: 'vue/reactivity/ref/ch-2',
      type: 'fill-blank',
      title: 'Mutação via .value',
      description: 'Complete incrementar e resetar mutando .value.',
      xpReward: 30,
      requires: ['ref-dot-value'],
      template: `<script setup>
import { ref } from 'vue'

const count = ref(0)

function incrementar() {
  count.___++
}

function resetar() {
  count.___ = 0
}
</script>

<template>
  <h2>{{ count }}</h2>
  <button @click="incrementar">+1</button>
  <button @click="resetar">Reset</button>
</template>`,
      blanks: ['value', 'value'],
      solution: `<script setup>
import { ref } from 'vue'

const count = ref(0)

function incrementar() {
  count.value++
}

function resetar() {
  count.value = 0
}
</script>

<template>
  <h2>{{ count }}</h2>
  <button @click="incrementar">+1</button>
  <button @click="resetar">Reset</button>
</template>`,
      hint: 'No script, toda leitura/escrita passa por .value.',
    },
    {
      id: 'vue/reactivity/ref/ch-3',
      type: 'fill-blank',
      title: 'Mutação de objeto',
      description: 'Mude `usuario.nome` para "Bruno" e depois substitua o objeto inteiro.',
      xpReward: 30,
      requires: ['ref-objects'],
      template: `<script setup>
import { ref } from 'vue'

const usuario = ref({ nome: 'Ana', nivel: 1 })

function renomear() {
  usuario.___.nome = 'Bruno'
}

function substituir() {
  usuario.___ = { nome: 'Carol', nivel: 5 }
}
</script>

<template>
  <p>{{ usuario.nome }} (nível {{ usuario.nivel }})</p>
  <button @click="renomear">Renomear</button>
  <button @click="substituir">Substituir</button>
</template>`,
      blanks: ['value', 'value'],
      solution: `<script setup>
import { ref } from 'vue'

const usuario = ref({ nome: 'Ana', nivel: 1 })

function renomear() {
  usuario.value.nome = 'Bruno'
}

function substituir() {
  usuario.value = { nome: 'Carol', nivel: 5 }
}
</script>

<template>
  <p>{{ usuario.nome }} (nível {{ usuario.nivel }})</p>
  <button @click="renomear">Renomear</button>
  <button @click="substituir">Substituir</button>
</template>`,
      hint: 'Para mutar propriedade ou trocar o objeto inteiro, sempre via .value.',
    },
    {
      id: 'vue/reactivity/ref/ch-4',
      type: 'fill-blank',
      title: 'Mute, não reatribua',
      description: 'Complete as mutações sem reatribuir as variáveis (use .value).',
      xpReward: 40,
      requires: ['ref-pitfall'],
      template: `<script setup>
import { ref } from 'vue'

const score = ref(100)
const nome = ref('Ana')

function dobrar() {
  score.___ = score.value * 2
}

function renomear() {
  nome.___ = 'Bruno'
}
</script>

<template>
  <p>{{ score }} — {{ nome }}</p>
  <button @click="dobrar">Dobrar</button>
  <button @click="renomear">Renomear</button>
</template>`,
      blanks: ['value', 'value'],
      solution: `<script setup>
import { ref } from 'vue'

const score = ref(100)
const nome = ref('Ana')

function dobrar() {
  score.value = score.value * 2
}

function renomear() {
  nome.value = 'Bruno'
}
</script>

<template>
  <p>{{ score }} — {{ nome }}</p>
  <button @click="dobrar">Dobrar</button>
  <button @click="renomear">Renomear</button>
</template>`,
      hint: 'Não escreva score = score.value * 2 nem nome = ref("Bruno") — isso reatribui a variável. Use score.value = … e nome.value = ….',
    },
    {
      id: 'vue/reactivity/ref/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine a Ref',
      description: 'Quatro bugs, um por conceito da lição. Corrija todos.',
      xpReward: 100,
      requires: ['ref-value', 'ref-dot-value', 'ref-objects', 'ref-pitfall'],
      buggyCode: `<script setup>
import { ref } from 'vue'

const pontos = 0
const usuario = ref({ nome: 'Ana', nivel: 1 })

function ganharPonto() {
  pontos++
}

function subirNivel() {
  usuario.nivel++
}

function trocarUsuario() {
  usuario = ref({ nome: 'Bruno', nivel: 1 })
}
</script>

<template>
  <p>{{ pontos }} pontos — {{ usuario.nome }} (nível {{ usuario.nivel }})</p>
  <button @click="ganharPonto">+1 ponto</button>
  <button @click="subirNivel">Subir nível</button>
  <button @click="trocarUsuario">Trocar</button>
</template>`,
      solution: `<script setup>
import { ref } from 'vue'

const pontos = ref(0)
const usuario = ref({ nome: 'Ana', nivel: 1 })

function ganharPonto() {
  pontos.value++
}

function subirNivel() {
  usuario.value.nivel++
}

function trocarUsuario() {
  usuario.value = { nome: 'Bruno', nivel: 1 }
}
</script>

<template>
  <p>{{ pontos }} pontos — {{ usuario.nome }} (nível {{ usuario.nivel }})</p>
  <button @click="ganharPonto">+1 ponto</button>
  <button @click="subirNivel">Subir nível</button>
  <button @click="trocarUsuario">Trocar</button>
</template>`,
      explanation: `pontos precisa ser ref(0) — ref-value.
pontos++ precisa de .value — ref-dot-value.
usuario.nivel++ precisa de .value pra acessar propriedade — ref-objects.
usuario = ref(...) reatribui a variável — ref-pitfall, deve ser usuario.value = {...}.`,
    },
  ],
}

export default refLesson
