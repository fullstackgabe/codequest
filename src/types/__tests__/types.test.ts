import { describe, expect, it } from 'vitest'
import { expectTypeOf } from 'expect-type'
import type { Course } from '../course'
import type { Module } from '../module'
import type { Lesson } from '../lesson'
import type { TheoryBlock } from '../theory'
import type { Flashcard } from '../flashcard'
import type {
  Challenge,
  ChallengeType,
  FillBlankChallenge,
  FixBugChallenge,
  WriteFromScratchChallenge,
} from '../challenge'
import type { SRSCard, SRSQuality } from '../srsCard'

describe('Domain types — sanity', () => {
  it('builds a minimal Course with nested module/lesson/theory/flashcard/challenges', () => {
    const theory: TheoryBlock = {
      tag: 'ref-value',
      title: 'ref() returns a reactive object',
      body: 'A ref holds a value behind .value',
      code: 'const count = ref(0)',
    }

    const flashcard: Flashcard = {
      id: 'vue/reactivity/ref/fc-1',
      front: 'What does ref() return?',
      back: 'A reactive object with .value',
      requires: ['ref-value'],
    }

    const challenge: Challenge = {
      id: 'vue/reactivity/ref/ch-1',
      type: 'fill-blank',
      title: 'Increment a ref',
      description: 'Fill the blanks to increment the ref',
      xpReward: 20,
      requires: ['ref-value'],
      solution: 'count.value++',
      template: 'count.___++',
      blanks: ['value'],
    }

    const lesson: Lesson = {
      id: 'vue/reactivity/ref',
      courseId: 'vue',
      moduleId: 'reactivity',
      title: 'ref()',
      icon: '📦',
      xpReward: 30,
      theory: [theory],
      flashcards: [flashcard],
      challenges: [challenge],
    }

    const module: Module = {
      id: 'reactivity',
      title: 'Reactivity',
      icon: '⚡',
      description: 'Reactive primitives',
      color: '#42b883',
      lessons: [lesson],
    }

    const course: Course = {
      id: 'vue',
      title: 'Vue.js',
      description: 'Vue 3 essentials',
      icon: '🟢',
      color: '#42b883',
      modules: [module],
    }

    expect(course.id).toBe('vue')
    expect(course.modules[0]?.lessons[0]?.theory[0]?.tag).toBe('ref-value')
    expect(course.modules[0]?.lessons[0]?.challenges).toHaveLength(1)
  })

  it('narrows Challenge by `type` discriminator (3 variants)', () => {
    const fill: FillBlankChallenge = {
      id: 'c1',
      type: 'fill-blank',
      title: 't',
      description: 'd',
      xpReward: 10,
      requires: [],
      solution: 's',
      template: 't',
      blanks: ['a'],
    }
    const scratch: WriteFromScratchChallenge = {
      id: 'c2',
      type: 'write-from-scratch',
      title: 't',
      description: 'd',
      xpReward: 10,
      requires: [],
      solution: 's',
    }
    const bug: FixBugChallenge = {
      id: 'c3',
      type: 'fix-bug',
      title: 't',
      description: 'd',
      xpReward: 10,
      requires: [],
      solution: 's',
      buggyCode: 'oops',
    }

    const cases: Challenge[] = [fill, scratch, bug]
    const tags = cases.map((c) => {
      if (c.type === 'fill-blank') {
        expectTypeOf(c).toHaveProperty('blanks')
        return c.blanks.length
      }
      if (c.type === 'fix-bug') {
        expectTypeOf(c).toHaveProperty('buggyCode')
        return c.buggyCode.length
      }
      return c.template?.length ?? 0
    })

    expect(tags).toEqual([1, 0, 4])

    expectTypeOf<ChallengeType>().toEqualTypeOf<
      'fill-blank' | 'write-from-scratch' | 'fix-bug'
    >()
  })

  it('SRSCard accepts null nextReview for new cards, number for scheduled', () => {
    const fresh: SRSCard = {
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReview: null,
    }
    const scheduled: SRSCard = {
      easeFactor: 2.5,
      interval: 6,
      repetitions: 2,
      nextReview: Date.now() + 86_400_000,
    }

    expect(fresh.nextReview).toBeNull()
    expect(typeof scheduled.nextReview).toBe('number')
    expectTypeOf<SRSCard['nextReview']>().toEqualTypeOf<number | null>()
  })

  it('SRSQuality is the 0..5 union', () => {
    const qualities: SRSQuality[] = [0, 1, 2, 3, 4, 5]
    expect(qualities).toHaveLength(6)
    expectTypeOf<SRSQuality>().toEqualTypeOf<0 | 1 | 2 | 3 | 4 | 5>()
  })
})
