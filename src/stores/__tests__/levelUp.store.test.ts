import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLevelUpStore } from '../levelUp'

describe('levelUp store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts hidden with empty title and level 0', () => {
    const s = useLevelUpStore()
    expect(s.show).toBe(false)
    expect(s.level).toBe(0)
    expect(s.title).toBe('')
  })

  it('trigger sets show + level + title', () => {
    const s = useLevelUpStore()
    s.trigger(5, 'Desenvolvedor')
    expect(s.show).toBe(true)
    expect(s.level).toBe(5)
    expect(s.title).toBe('Desenvolvedor')
  })

  it('dismiss hides without clearing level/title (for close animation)', () => {
    const s = useLevelUpStore()
    s.trigger(3, 'Aprendiz')
    s.dismiss()
    expect(s.show).toBe(false)
    expect(s.level).toBe(3)
    expect(s.title).toBe('Aprendiz')
  })

  it('reset clears everything', () => {
    const s = useLevelUpStore()
    s.trigger(7, 'Reativo')
    s.reset()
    expect(s.show).toBe(false)
    expect(s.level).toBe(0)
    expect(s.title).toBe('')
  })
})
