import { describe, expect, it } from 'vitest'
import { checkAnswer, normalizeCode } from '../useChallenge'
import type {
  FillBlankChallenge,
  FixBugChallenge,
  WriteFromScratchChallenge,
} from '@/types/challenge'

describe('useChallenge.normalizeCode', () => {
  it('strips // comments (and tightens around = operator)', () => {
    expect(normalizeCode('const a = 1 // count')).toBe('const a=1')
  })

  it('strips /* */ multi-line comments', () => {
    expect(normalizeCode('foo /* hi */ bar')).toBe('foo bar')
  })

  it('strips HTML comments', () => {
    expect(normalizeCode('<div><!-- hello --></div>')).toBe('<div></div>')
  })

  it('collapses whitespace', () => {
    expect(normalizeCode('foo\n  \tbar\n')).toBe('foo bar')
  })
})

describe('useChallenge.checkAnswer', () => {
  const fillBlank: FillBlankChallenge = {
    id: 'c',
    type: 'fill-blank',
    title: 't',
    description: 'd',
    xpReward: 10,
    requires: [],
    solution: 'console.log("hi")',
    template: '___.log("hi")',
    blanks: ['console'],
  }

  it('fill-blank: filling the blank yields equality with solution', () => {
    expect(checkAnswer('console.log("hi")', fillBlank)).toBe(true)
    expect(checkAnswer('window.log("hi")', fillBlank)).toBe(false)
  })

  const scratch: WriteFromScratchChallenge = {
    id: 'c2',
    type: 'write-from-scratch',
    title: 't',
    description: 'd',
    xpReward: 10,
    requires: [],
    solution: 'const name = "Code Quest"',
  }

  it('write-from-scratch: ignores whitespace differences', () => {
    expect(checkAnswer('const   name="Code Quest"', scratch)).toBe(true)
    expect(checkAnswer('let name = "Code Quest"', scratch)).toBe(false)
  })

  const bug: FixBugChallenge = {
    id: 'c3',
    type: 'fix-bug',
    title: 't',
    description: 'd',
    xpReward: 10,
    requires: [],
    solution: 'count.value++',
    buggyCode: 'count++',
  }

  it('fix-bug: ignores // comments inside user code', () => {
    expect(checkAnswer('count.value++ // increment', bug)).toBe(true)
    expect(checkAnswer('count++', bug)).toBe(false)
  })

  it('returns false for empty code', () => {
    expect(checkAnswer('', scratch)).toBe(false)
    expect(checkAnswer('   ', scratch)).toBe(false)
  })
})
