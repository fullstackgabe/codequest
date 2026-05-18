import type { Lesson } from '@/types/lesson'

const vIfLesson: Lesson = {
  id: 'vue/directives/v-if',
  courseId: 'vue',
  moduleId: 'directives',
  title: 'v-if',
  icon: '🔀',
  xpReward: 30,
  docUrl: 'https://vuejs.org/api/built-in-directives#v-if',

  theory: [
    {
      tag: 'v-if-create-destroy',
      title: 'v-if — cria e destrói o elemento',
      body: `v-if condiciona a presença do elemento na árvore.
Quando falso, o elemento não existe no DOM (e seus listeners/componentes nem são instanciados).
Quando verdadeiro, é criado/montado normalmente.`,
      code: `<template>
  <p v-if="logado">Bem-vindo de volta!</p>
</template>`,
    },
    {
      tag: 'v-if-else',
      title: 'v-else-if / v-else',
      body: `Encadeie condições com v-else-if e v-else.
v-else-if e v-else precisam vir imediatamente depois de um v-if (ou outro v-else-if) no mesmo nível.`,
      code: `<template>
  <p v-if="nivel >= 10">Mestre</p>
  <p v-else-if="nivel >= 5">Avançado</p>
  <p v-else>Iniciante</p>
</template>`,
    },
    {
      tag: 'v-if-template',
      title: 'Agrupar múltiplos elementos com <template v-if>',
      body: `Para condicionar vários elementos sem criar um wrapper, use <template v-if="...">.
A tag <template> não aparece no DOM — só serve como agrupador lógico.`,
      code: `<template>
  <template v-if="loaded">
    <h1>Título</h1>
    <p>Conteúdo</p>
    <footer>Rodapé</footer>
  </template>
</template>`,
    },
    {
      tag: 'v-if-when-use',
      title: 'Quando preferir v-if (vs v-show)',
      body: `v-if tem custo de criar/destruir cada vez que alterna.
Use v-if quando a condição muda pouco (raramente), ou quando o conteúdo é caro
de manter no DOM.
Se alterna muito (toggle frequente), prefira v-show.`,
      code: `<!-- toggle frequente: v-show é mais barato -->
<div v-show="aberto">…</div>

<!-- página inteira em outro estado: v-if -->
<AdminPanel v-if="usuario.admin" />`,
    },
  ],

  flashcards: [
    {
      id: 'vue/directives/v-if/fc-1',
      front: 'O que acontece com um elemento quando v-if vira false?',
      back: 'Ele é removido do DOM. Componentes filhos são desmontados e listeners são removidos.',
      requires: ['v-if-create-destroy'],
    },
    {
      id: 'vue/directives/v-if/fc-2',
      front: 'Como encadear várias condições?',
      back: 'Use v-else-if e v-else imediatamente após o v-if no mesmo pai.',
      code: `<p v-if="a">A</p>
<p v-else-if="b">B</p>
<p v-else>nenhum</p>`,
      requires: ['v-if-else'],
    },
    {
      id: 'vue/directives/v-if/fc-3',
      front: 'Como condicionar um grupo de elementos sem criar wrapper?',
      back: '<template v-if="cond">…</template> — agrupa logicamente sem render extra no DOM.',
      requires: ['v-if-template'],
    },
    {
      id: 'vue/directives/v-if/fc-4',
      front: 'v-if ou v-show quando o estado alterna muito rápido?',
      back: 'v-show — só alterna display:none, sem destruir/recriar o elemento.',
      requires: ['v-if-when-use'],
    },
  ],

  challenges: [
    {
      id: 'vue/directives/v-if/ch-1',
      type: 'fill-blank',
      title: 'Mensagem condicional',
      description: 'Mostre "logado" só quando logado=true.',
      xpReward: 20,
      requires: ['v-if-create-destroy'],
      template: `<script setup>
import { ref } from 'vue'
const logado = ref(true)
</script>

<template>
  <p ___="logado">logado</p>
</template>`,
      blanks: ['v-if'],
      solution: `<script setup>
import { ref } from 'vue'
const logado = ref(true)
</script>

<template>
  <p v-if="logado">logado</p>
</template>`,
      hint: 'A diretiva é v-if="condição".',
    },
    {
      id: 'vue/directives/v-if/ch-2',
      type: 'fill-blank',
      title: 'Encadeamento',
      description: 'Mostre o nível certo: 10+ = Mestre, 5+ = Avançado, resto = Iniciante.',
      xpReward: 30,
      requires: ['v-if-else'],
      template: `<script setup>
import { ref } from 'vue'
const nivel = ref(7)
</script>

<template>
  <p v-if="nivel >= 10">Mestre</p>
  <p ___="nivel >= 5">Avançado</p>
  <p ___>Iniciante</p>
</template>`,
      blanks: ['v-else-if', 'v-else'],
      solution: `<script setup>
import { ref } from 'vue'
const nivel = ref(7)
</script>

<template>
  <p v-if="nivel >= 10">Mestre</p>
  <p v-else-if="nivel >= 5">Avançado</p>
  <p v-else>Iniciante</p>
</template>`,
      hint: 'Use v-else-if e v-else imediatamente depois do v-if.',
    },
    {
      id: 'vue/directives/v-if/ch-3',
      type: 'fill-blank',
      title: 'Grupo condicional',
      description: 'Renderize título e rodapé juntos sem criar div wrapper.',
      xpReward: 30,
      requires: ['v-if-template'],
      template: `<script setup>
import { ref } from 'vue'
const carregado = ref(true)
</script>

<template>
  <___ v-if="carregado">
    <h1>Título</h1>
    <footer>Rodapé</footer>
  </___>
</template>`,
      blanks: ['template', 'template'],
      solution: `<script setup>
import { ref } from 'vue'
const carregado = ref(true)
</script>

<template>
  <template v-if="carregado">
    <h1>Título</h1>
    <footer>Rodapé</footer>
  </template>
</template>`,
      hint: 'A tag <template> é a tag virtual de agrupamento de Vue.',
    },
    {
      id: 'vue/directives/v-if/ch-4',
      type: 'write-from-scratch',
      title: 'Estado vazio',
      description: 'Mostre "Sem itens" quando lista estiver vazia, senão a primeira posição.',
      xpReward: 30,
      requires: ['v-if-else'],
      template: `<script setup>
import { ref } from 'vue'
const lista = ref([])
</script>

<template>
  <!-- escreva o template -->
</template>`,
      solution: `<script setup>
import { ref } from 'vue'
const lista = ref([])
</script>

<template>
  <p v-if="lista.length === 0">Sem itens</p>
  <p v-else>{{ lista[0] }}</p>
</template>`,
      hint: 'v-if="lista.length === 0" + v-else.',
    },
    {
      id: 'vue/directives/v-if/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine o v-if',
      description: 'Três problemas no uso de v-if. Corrija.',
      xpReward: 100,
      requires: ['v-if-create-destroy', 'v-if-else', 'v-if-template', 'v-if-when-use'],
      buggyCode: `<script setup>
import { ref } from 'vue'

const usuario = ref({ admin: false, nome: 'Ana' })
const nivel = ref(3)
const aberto = ref(false)
</script>

<template>
  <p v-if="usuario.nome">Olá {{ usuario.nome }}</p>
  <p v-if="usuario.admin">Admin panel</p>

  <p v-if="nivel >= 10">Mestre</p>
  <p v-if="nivel >= 5">Avançado</p>
  <p v-if="nivel < 5">Iniciante</p>

  <div v-if="aberto">
    <h1>Modal</h1>
    <p>Conteúdo</p>
  </div>
</template>`,
      solution: `<script setup>
import { ref } from 'vue'

const usuario = ref({ admin: false, nome: 'Ana' })
const nivel = ref(3)
const aberto = ref(false)
</script>

<template>
  <p v-if="usuario.nome">Olá {{ usuario.nome }}</p>
  <p v-if="usuario.admin">Admin panel</p>

  <p v-if="nivel >= 10">Mestre</p>
  <p v-else-if="nivel >= 5">Avançado</p>
  <p v-else>Iniciante</p>

  <template v-if="aberto">
    <h1>Modal</h1>
    <p>Conteúdo</p>
  </template>
</template>`,
      explanation: `Várias condições mutuamente exclusivas: use v-else-if/v-else (mais legível e eficiente).
Quando você só quer agrupar elementos sem criar uma div, use <template v-if>.
(O primeiro v-if de "usuário admin" está correto — é check independente, então fica.)`,
    },
  ],
}

export default vIfLesson
