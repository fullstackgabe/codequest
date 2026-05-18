import { describe, expect, it } from 'vitest'
import {
  LEVEL_THRESHOLDS,
  LEVEL_TITLES,
  getLevelFromXP,
  getLevelProgress,
  getLevelTitle,
  getXPForNextLevel,
} from '../levels'

describe('levels', () => {
  it('has 15 thresholds and 15 titles', () => {
    expect(LEVEL_THRESHOLDS).toHaveLength(15)
    expect(LEVEL_TITLES).toHaveLength(15)
  })

  it('getLevelFromXP at boundaries', () => {
    expect(getLevelFromXP(0)).toBe(1)
    expect(getLevelFromXP(99)).toBe(1)
    expect(getLevelFromXP(100)).toBe(2)
    expect(getLevelFromXP(20_000)).toBe(15)
    expect(getLevelFromXP(99_999)).toBe(15)
  })

  it('getXPForNextLevel returns delta or null at max', () => {
    expect(getXPForNextLevel(0)).toBe(100)
    expect(getXPForNextLevel(50)).toBe(50)
    expect(getXPForNextLevel(20_000)).toBeNull()
  })

  it('getLevelProgress stays in 0..100', () => {
    expect(getLevelProgress(0)).toBe(0)
    expect(getLevelProgress(50)).toBe(50)
    expect(getLevelProgress(20_000)).toBe(100)
  })

  it('getLevelTitle clamps to LEVEL_TITLES range', () => {
    expect(getLevelTitle(1)).toBe('Iniciante')
    expect(getLevelTitle(15)).toBe('Code Master')
    expect(getLevelTitle(99)).toBe('Code Master')
    expect(getLevelTitle(0)).toBe('Iniciante')
  })
})
