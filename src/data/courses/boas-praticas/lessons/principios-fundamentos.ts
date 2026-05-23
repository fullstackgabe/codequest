import type { Lesson } from '@/types/lesson'

const principiosFundamentos: Lesson = {
  id: 'boas-praticas/principios/fundamentos',
  courseId: 'boas-praticas',
  moduleId: 'principios',
  title: 'DRY, KISS, YAGNI',
  icon: '📐',
  xpReward: 30,
  docUrl: 'https://en.wikipedia.org/wiki/Don%27t_repeat_yourself',

  theory: [
    {
      tag: 'bp-dry',
      title: 'DRY — Don\'t Repeat Yourself',
      body: `Cada pedaço de conhecimento deve ter uma representação única e autoritativa no sistema.
Duplicar lógica vira fonte de bug: você corrige num lugar e esquece do outro.
Cuidado com o exagero — abstrair cedo demais cria acoplamento. Repita 3x antes de abstrair.`,
      code: `// Ruim: regra de desconto duplicada
function priceCart(items) {
  return items.reduce((s, i) => s + i.price * 0.9, 0)
}
function priceOrder(order) {
  return order.lines.reduce((s, l) => s + l.price * 0.9, 0)
}

// DRY: extrai a regra
const DISCOUNT = 0.9
const applyDiscount = (price) => price * DISCOUNT

function priceCart(items)  { return items.reduce((s, i) => s + applyDiscount(i.price), 0) }
function priceOrder(order) { return order.lines.reduce((s, l) => s + applyDiscount(l.price), 0) }`,
    },
    {
      tag: 'bp-kiss',
      title: 'KISS — Keep It Simple, Stupid',
      body: `A solução mais simples que resolve o problema é quase sempre a melhor.
Código "inteligente" é caro de ler, debugar e manter — e você é o próximo a sofrer com ele.
Prefira clareza a concisão; explícito a implícito; linear a abstrato.`,
      code: `// Ruim: clever demais
const isAdult = u => !!~~(u.age / 18)

// KISS: óbvio em 1 olhada
const isAdult = (user) => user.age >= 18`,
    },
    {
      tag: 'bp-yagni',
      title: 'YAGNI — You Aren\'t Gonna Need It',
      body: `Não construa pra um requisito hipotético. Construa pro que você precisa AGORA.
Cada feature especulativa adiciona código que vai apodrecer sem ser usado.
Quando o requisito real chegar, ele será diferente do que você imaginou — e o código que você "preparou" vai atrapalhar.`,
      code: `// Ruim: parametrização especulativa "pra quando precisar"
function sendEmail(to, subject, body, options = {
  cc: [], bcc: [], attachments: [], priority: 'normal',
  encoding: 'utf-8', retries: 3, webhook: null,
}) { /* ... 200 linhas tratando opts que ninguém usa */ }

// YAGNI: faz o que precisa hoje. Adiciona opts quando aparecer caso real.
function sendEmail(to, subject, body) {
  return mailer.send({ to, subject, body })
}`,
    },
  ],

  flashcards: [
    {
      id: 'boas-praticas/principios/fundamentos/fc-1',
      front: 'O que é DRY e qual o principal risco de aplicá-lo cedo demais?',
      back: `DRY = uma representação única e autoritativa de cada conhecimento no sistema.
Risco: abstrair antes de ter 2-3 exemplos reais cria acoplamento errado —
duas coisas que pareciam iguais hoje divergem amanhã, e a abstração apodrece.`,
      requires: ['bp-dry'],
    },
    {
      id: 'boas-praticas/principios/fundamentos/fc-2',
      front: 'KISS em uma frase. Como reconhecer que você violou?',
      back: `KISS = a solução mais simples que resolve o problema é a melhor.
Sinais de violação: alguém pede explicação pra ler 3 linhas;
você precisa de um comentário pra justificar; reescreveu em 1-liner "esperto".`,
      requires: ['bp-kiss'],
    },
    {
      id: 'boas-praticas/principios/fundamentos/fc-3',
      front: 'Por que YAGNI bate de frente com "preparar pro futuro"?',
      back: `Porque o futuro que você imagina raramente é o que acontece.
Código especulativo vira lastro: difícil de remover (parece útil), difícil de manter
(ninguém usa, ninguém testa de verdade) e enviesa decisões futuras.`,
      requires: ['bp-yagni'],
    },
  ],

  challenges: [
    {
      id: 'boas-praticas/principios/fundamentos/ch-1',
      type: 'fill-blank',
      title: 'Identifique o princípio',
      description: 'Complete os 3 acrônimos clássicos da boa engenharia.',
      xpReward: 20,
      requires: ['bp-dry', 'bp-kiss', 'bp-yagni'],
      template: `// 3 princípios fundamentais:
// ___  → não repita conhecimento, uma fonte da verdade
// ___ → mantenha simples, prefira clareza a esperteza
// ___ → não construa pro hipotético, só pro que precisa hoje`,
      blanks: ['DRY', 'KISS', 'YAGNI'],
      solution: `// 3 princípios fundamentais:
// DRY  → não repita conhecimento, uma fonte da verdade
// KISS → mantenha simples, prefira clareza a esperteza
// YAGNI → não construa pro hipotético, só pro que precisa hoje`,
      hint: 'DRY, KISS e YAGNI — em ordem de descoberta histórica.',
    },
  ],
}

export default principiosFundamentos
