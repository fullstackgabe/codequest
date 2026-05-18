import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useXPStore } from '../xp'
import { useLevelUpStore } from '../levelUp'

describe('xp store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts at xp 0 and level 1', () => {
    const s = useXPStore()
    expect(s.xp).toBe(0)
    expect(s.level).toBe(1)
  })

  it('addXP(100) crosses threshold and reports levelUp', () => {
    const s = useXPStore()
    const result = s.addXP(100)
    expect(s.xp).toBe(100)
    expect(s.level).toBe(2)
    expect(result.levelUp).toBe(true)
    if (result.levelUp) {
      expect(result.level).toBe(2)
      expect(result.title).toBeTruthy()
    }
  })

  it('two sub-threshold additions do not trigger levelUp', () => {
    const s = useXPStore()
    expect(s.addXP(50).levelUp).toBe(false)
    expect(s.addXP(40).levelUp).toBe(false)
    expect(s.xp).toBe(90)
    expect(s.level).toBe(1)
  })

  it('addXP(NaN) is coerced to 0', () => {
    const s = useXPStore()
    s.addXP(Number.NaN)
    s.addXP(Number.POSITIVE_INFINITY)
    expect(s.xp).toBe(0)
  })

  it('persists across store reinstantiation', () => {
    const a = useXPStore()
    a.addXP(75)
    setActivePinia(createPinia())
    const b = useXPStore()
    expect(b.xp).toBe(75)
    expect(b.level).toBe(1)
  })

  it('triggers levelUp store on threshold cross', () => {
    const s = useXPStore()
    const lu = useLevelUpStore()
    expect(lu.show).toBe(false)
    s.addXP(150)
    expect(lu.show).toBe(true)
    expect(lu.level).toBe(2)
    expect(lu.title).toBeTruthy()
  })

  it('reset clears xp and removes storage key', () => {
    const s = useXPStore()
    s.addXP(200)
    s.reset()
    expect(s.xp).toBe(0)
    expect(s.level).toBe(1)
    expect(localStorage.getItem('codequest_xp')).toBeNull()
  })
})
