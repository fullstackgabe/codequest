import { describe, expect, it } from 'vitest'
import { expectTypeOf } from 'expect-type'
import { XP_REWARDS } from '../xpRewards'
import type { XPRewardKey } from '../xpRewards'

const EXPECTED_KEYS = [
  'LESSON_COMPLETE',
  'CHALLENGE_FIRST_TRY',
  'CHALLENGE_COMPLETE',
  'REVIEW_PERFECT',
  'REVIEW_GOOD',
  'REVIEW_OK',
  'STREAK_BONUS',
  'MODULE_COMPLETE',
  'BOSS_BATTLE_WIN',
] as const

describe('xpRewards', () => {
  it('has 9 known keys with positive integer values', () => {
    EXPECTED_KEYS.forEach((k) => {
      expect(XP_REWARDS).toHaveProperty(k)
      expect(XP_REWARDS[k]).toBeGreaterThan(0)
      expect(Number.isInteger(XP_REWARDS[k])).toBe(true)
    })
    expectTypeOf<XPRewardKey>().toEqualTypeOf<(typeof EXPECTED_KEYS)[number]>()
  })
})
