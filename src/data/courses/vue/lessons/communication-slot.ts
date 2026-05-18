import type { Lesson } from '@/types/lesson'

const slotLesson: Lesson = {
  id: 'vue/communication/slot',
  courseId: 'vue',
  moduleId: 'communication',
  title: 'slot',
  icon: '🧩',
  xpReward: 30,
  docUrl: 'https://vuejs.org/guide/components/slots.html',

  theory: [
    {
      tag: 'slot-basic',
      title: 'slot — injetar HTML do pai no filho',
      body: `O filho declara onde o conteúdo vai com <slot />.
O pai escreve o conteúdo entre as tags do filho.
É herança de UI (não de dados) — o filho "abre uma janela" pro pai pintar.`,
      code: `<!-- Card.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>

<!-- Pai.vue -->
<Card>
  <h1>Título</h1>
  <p>Qualquer HTML aqui</p>
</Card>`,
    },
    {
      tag: 'slot-named',
      title: 'Slots nomeados',
      body: `Filho expõe vários "buracos" nomeados; pai preenche um a um com <template #nome>.
Slot sem nome é chamado de "default" (#default).
Útil pra componentes com cabeçalho/corpo/rodapé.`,
      code: `<!-- Card.vue -->
<template>
  <div class="card">
    <header><slot name="header" /></header>
    <main><slot /></main>
    <footer><slot name="footer" /></footer>
  </div>
</template>

<!-- Pai.vue -->
<Card>
  <template #header>Topo</template>
  Conteúdo principal
  <template #footer>Rodapé</template>
</Card>`,
    },
    {
      tag: 'slot-fallback',
      title: 'Conteúdo fallback',
      body: `O que está dentro de <slot>...</slot> é o conteúdo padrão.
Aparece quando o pai não preencher esse slot.`,
      code: `<!-- Botao.vue -->
<template>
  <button><slot>OK</slot></button>
</template>

<!-- Uso -->
<Botao />           <!-- mostra "OK" -->
<Botao>Salvar</Botao>  <!-- mostra "Salvar" -->`,
    },
    {
      tag: 'slot-scoped',
      title: 'Scoped slots — filho passa dados pro pai',
      body: `Filho pode expor dados do seu estado pro slot via atributos no <slot>.
Pai recebe via v-slot="x" (ou shorthand "#default="x"").
Padrão pra componentes de lista: o filho itera, o pai define como renderizar cada item.`,
      code: `<!-- Lista.vue -->
<template>
  <ul>
    <li v-for="item in itens" :key="item.id">
      <slot :item="item" />
    </li>
  </ul>
</template>

<!-- Pai -->
<Lista :itens="usuarios">
  <template #default="{ item }">
    <strong>{{ item.nome }}</strong> — {{ item.idade }}
  </template>
</Lista>`,
    },
  ],

  flashcards: [
    {
      id: 'vue/communication/slot/fc-1',
      front: 'O que <slot /> faz no filho?',
      back: 'Marca o lugar onde o HTML/componente passado pelo pai será renderizado.',
      requires: ['slot-basic'],
    },
    {
      id: 'vue/communication/slot/fc-2',
      front: 'Como o pai preenche um slot nomeado "header"?',
      back: '<template #header>...</template> (shorthand de v-slot:header).',
      requires: ['slot-named'],
    },
    {
      id: 'vue/communication/slot/fc-3',
      front: 'Como definir um fallback de slot?',
      back: 'O conteúdo dentro de <slot>...</slot> é o default quando o pai não preenche.',
      code: `<slot>Conteúdo padrão</slot>`,
      requires: ['slot-fallback'],
    },
    {
      id: 'vue/communication/slot/fc-4',
      front: 'Como o filho expõe dados pro pai via slot?',
      back: 'Atributos no <slot :item="..."> chegam no pai via v-slot="{ item }".',
      requires: ['slot-scoped'],
    },
  ],

  challenges: [
    {
      id: 'vue/communication/slot/ch-1',
      type: 'fill-blank',
      title: 'Card simples',
      description: 'Permita o pai inserir conteúdo dentro do Card.',
      xpReward: 20,
      requires: ['slot-basic'],
      template: `<!-- Card.vue -->
<template>
  <div class="card">
    <___ />
  </div>
</template>`,
      blanks: ['slot'],
      solution: `<!-- Card.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>`,
      hint: '<slot /> marca onde o conteúdo do pai entra.',
    },
    {
      id: 'vue/communication/slot/ch-2',
      type: 'fill-blank',
      title: 'Slot nomeado',
      description: 'Adicione um slot "header" no Card.',
      xpReward: 20,
      requires: ['slot-named'],
      template: `<template>
  <div class="card">
    <header><slot ___="header" /></header>
    <main><slot /></main>
  </div>
</template>`,
      blanks: ['name'],
      solution: `<template>
  <div class="card">
    <header><slot name="header" /></header>
    <main><slot /></main>
  </div>
</template>`,
      hint: 'Atributo name="..." nomeia o slot.',
    },
    {
      id: 'vue/communication/slot/ch-3',
      type: 'fill-blank',
      title: 'Fallback',
      description: 'Mostre "OK" quando o pai não passar conteúdo no botão.',
      xpReward: 20,
      requires: ['slot-fallback'],
      template: `<template>
  <button><slot>___</slot></button>
</template>`,
      blanks: ['OK'],
      solution: `<template>
  <button><slot>OK</slot></button>
</template>`,
      hint: 'O conteúdo dentro de <slot> é o fallback.',
    },
    {
      id: 'vue/communication/slot/ch-4',
      type: 'fill-blank',
      title: 'Scoped slot',
      description: 'Filho expõe o item; pai usa via v-slot.',
      xpReward: 40,
      requires: ['slot-scoped'],
      template: `<!-- Lista.vue -->
<template>
  <ul>
    <li v-for="item in itens" :key="item.id">
      <slot ___="item" />
    </li>
  </ul>
</template>

<!-- Pai -->
<Lista :itens="usuarios">
  <template #default="{ ___ }">
    {{ item.nome }}
  </template>
</Lista>`,
      blanks: [':item', 'item'],
      solution: `<!-- Lista.vue -->
<template>
  <ul>
    <li v-for="item in itens" :key="item.id">
      <slot :item="item" />
    </li>
  </ul>
</template>

<!-- Pai -->
<Lista :itens="usuarios">
  <template #default="{ item }">
    {{ item.nome }}
  </template>
</Lista>`,
      hint: ':item="item" expõe; #default="{ item }" desestrutura no pai.',
    },
    {
      id: 'vue/communication/slot/ch-boss',
      type: 'fix-bug',
      title: 'Boss: domine slots',
      description: 'Quatro problemas com slots. Corrija.',
      xpReward: 100,
      requires: ['slot-basic', 'slot-named', 'slot-fallback', 'slot-scoped'],
      buggyCode: `<!-- Card.vue -->
<template>
  <div class="card">
    <header>
      <!-- slot sem fallback nem nome -->
      <slot />
    </header>
    <main>
      <!-- esqueceu o slot principal -->
    </main>
  </div>
</template>

<!-- Lista.vue -->
<template>
  <ul>
    <li v-for="item in itens" :key="item.id">
      <!-- expôs como prop normal -->
      <slot item="item" />
    </li>
  </ul>
</template>

<!-- Pai usando lista -->
<Lista :itens="usuarios">
  <template #default="item">
    {{ item.nome }}
  </template>
</Lista>`,
      solution: `<!-- Card.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Título padrão</slot>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<!-- Lista.vue -->
<template>
  <ul>
    <li v-for="item in itens" :key="item.id">
      <slot :item="item" />
    </li>
  </ul>
</template>

<!-- Pai usando lista -->
<Lista :itens="usuarios">
  <template #default="{ item }">
    {{ item.nome }}
  </template>
</Lista>`,
      explanation: `Slot do header deveria ter name="header" pra ser específico, e um fallback ajuda na UX.
Faltava o <slot /> default no main.
slot precisa de :prop (bind) pra expor valor reativo — item="item" é string literal.
Scoped slot do pai: desestruture via #default="{ item }".`,
    },
  ],
}

export default slotLesson
