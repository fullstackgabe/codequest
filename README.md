# Code Quest ⚡

Plataforma web gamificada para aprender múltiplas tecnologias em um só lugar.
Cada curso usa o mesmo método: **teoria paginada + flashcards com spaced
repetition (SM-2) + desafios de código**, com XP global, níveis, streak diário
e level-up animado.

Inspirada no [vue_quest](https://github.com/fullstackgabe/vuejs_game) (curso
único de Vue), generalizada para hospedar quantos cursos quiser.

## Stack

- **Vue 3.5** + **TypeScript 5.9** (strict + `noUncheckedIndexedAccess`)
- **Composition API** com `<script setup lang="ts">`
- **Pinia 3** (setup-style) + **Vue Router 4**
- **Vite 8** (build + dev server) + **Vitest 2** (unit + component)
- **CodeMirror 6** (editor de código nos challenges)
- **localStorage** (sem backend — XP/streak/progresso/SRS persistem localmente)

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## Scripts

| Script             | Descrição                                     |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Servidor Vite (HMR)                           |
| `npm run build`    | Type-check + bundle produção (`dist/`)        |
| `npm run preview`  | Servir build produção localmente              |
| `npm run type-check` | Apenas `vue-tsc --noEmit`                  |
| `npm run test`     | Vitest run (single-shot)                      |
| `npm run test:watch` | Vitest em modo watch                       |

## Arquitetura

```
src/
├── App.vue                  # Shell: AppHeader + RouterView + LevelUpToast
├── main.ts                  # createApp + Pinia + Router + mount
├── router/                  # Rotas multi-curso (/course/:cid/...)
├── assets/styles/           # Tokens CSS + utilities (Dark mode)
│
├── types/                   # 1 entidade por arquivo (SRP)
│   ├── course.ts, module.ts, lesson.ts
│   ├── theory.ts, flashcard.ts, challenge.ts
│   └── srsCard.ts
│
├── utils/                   # Puros, com unit tests co-locados
│   ├── storage.ts           # localStorage tipado
│   ├── levels.ts            # XP thresholds + math de nível
│   ├── xpRewards.ts         # Constantes (LESSON_COMPLETE, etc.)
│   ├── sm2.ts               # Algoritmo SM-2 (spaced repetition)
│   └── dates.ts             # toDateString, isYesterday, daysFromNow
│
├── stores/                  # Pinia setup stores (1 concern cada)
│   ├── xp.ts                # XP global + nível derivado
│   ├── streak.ts            # Streak diário
│   ├── levelUp.ts           # Evento transient pro toast
│   ├── courseProgress.ts    # Lições/challenges/módulos completos (por courseId)
│   └── srs.ts               # Flashcards SM-2 (por courseId)
│
├── composables/
│   ├── useCourse.ts         # Course reativo via courseIdRef
│   ├── useLesson.ts         # Lesson + module + course reativos
│   ├── useUnlockMap.ts      # Lock progressivo (módulos/lições)
│   ├── useChallenge.ts      # normalizeCode + checkAnswer
│   ├── useAwardActivity.ts  # Orquestra completeLesson/Challenge (XP+streak+SRS)
│   └── useReviewSession.ts  # Sessão de revisão (5 cards)
│
├── components/
│   ├── layout/              # AppHeader
│   ├── game/                # XPBar, LevelBadge, StreakBadge, LevelUpToast
│   ├── course/              # CourseCard, ModuleCard, LessonItem
│   ├── lesson/              # CodeEditor, TheoryBlock, ChallengeRunner
│   └── srs/                 # FlashCard
│
├── views/
│   ├── HomeView.vue         # Hub de cursos (hero + grid)
│   ├── CourseView.vue       # Módulos do curso + badge "X cards due"
│   ├── ModuleView.vue       # Lições do módulo (progressive unlock)
│   ├── LessonView.vue       # Teoria (paginada) + Challenges (tabs)
│   └── ReviewView.vue       # Sessão de revisão SRS (5 cards)
│
└── data/courses/            # Conteúdo dos cursos (1 pasta por curso)
    ├── index.ts             # Registry (importa e lista todos)
    ├── vue/                 # Curso Vue.js (migrado do vue_quest)
    └── javascript/          # Curso JavaScript (skeleton)
```

## Como adicionar um novo curso

A arquitetura é **multi-curso first**: adicionar um curso é **só dados**, sem
mudança em código de plataforma.

1. Crie uma pasta em `src/data/courses/<id>/` (ex: `react/`)
2. Crie `index.ts` exportando um `Course` (default):

   ```typescript
   import type { Course } from '@/types/course'

   const reactCourse: Course = {
     id: 'react',
     title: 'React',
     description: 'Componentes, hooks e estado',
     icon: '⚛️',
     color: '#61dafb',
     modules: [
       {
         id: 'hooks',
         title: 'Hooks',
         icon: '🪝',
         description: 'useState, useEffect, useMemo',
         color: '#61dafb',
         lessons: [
           {
             id: 'react/hooks/use-state',
             courseId: 'react',
             moduleId: 'hooks',
             title: 'useState',
             icon: '📦',
             xpReward: 30,
             theory: [/* ... blocos ... */],
             flashcards: [/* ... cards ... */],
             challenges: [/* ... desafios ... */],
           },
         ],
       },
     ],
   }

   export default reactCourse
   ```

3. Importe e registre em [src/data/courses/index.ts](src/data/courses/index.ts):

   ```typescript
   import reactCourse from './react'
   const courses: Course[] = [vueCourse, javascriptCourse, reactCourse]
   ```

Pronto. O curso aparece no hub, módulos com lock progressivo, lições com teoria
e challenges, e flashcards entram no SRS namespace `react`.

### Formato das entidades

- **Lesson ID:** `'<courseId>/<moduleId>/<slug>'` (ex: `'react/hooks/use-state'`)
- **Flashcard/Challenge ID:** `'<lessonId>/<fc|ch>-N'`
- **Theory `tag`:** identificador interno usado por `flashcard.requires` e `challenge.requires`
- **Challenge `type`:** discriminated union — `'fill-blank' | 'write-from-scratch' | 'fix-bug'`

## Gamificação

- **15 níveis** (de "Iniciante" a "Code Master") com XP cumulativo (0 → 20000)
- **Recompensas XP:**
  - Concluir lição: 30 XP
  - Challenge primeira tentativa: 50 XP / outras: 20 XP
  - Review perfect/good/ok: 15/10/5 XP
  - Conclusão de módulo: 100 XP
  - Boss battle: 150 XP
- **Streak diário:** zera se pular 1 dia, idempotente no mesmo dia
- **Level-up toast** com auto-dismiss em 4s
- **SRS:** SM-2 clássico, sessão de 5 cards

## Decisões arquiteturais

Documentadas em `.specs/project/STATE.md`. Principais:

- **SRP rigoroso** em stores, utils e componentes
- **XP/streak/level globais** (somam todos os cursos); **progresso/SRS namespaced** por courseId
- **Spec-driven** com a skill [`tlc-spec-driven`](.specs/) — cada feature passou
  por spec → design → tasks → execute
- **Vitest co-localizado** (`__tests__/` ao lado dos arquivos)
- **Token `--primary`** (não `--vue-green`) — multi-curso não deve ter brand-locked

## Deploy

Build estático funciona em qualquer host (Vercel, Netlify, GH Pages):

```bash
npm run build      # gera dist/
```

Configurações específicas de host:
- **Vercel/Netlify:** detectam Vite automaticamente
- **GH Pages:** precisa de `base: '/code_quest/'` no `vite.config.ts`

## Próximos passos

Ideias adiadas em `.specs/project/STATE.md` (Deferred Ideas):

- Dark/light mode toggle
- Achievements/badges
- Atalhos de teclado em flashcards/challenges
- Acessibilidade audit completo
- Exportar/importar progresso (JSON)
- @vue/repl no ChallengeRunner (preview Vue ao vivo)
