import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StreakBadge from '../StreakBadge.vue'
import { useStreakStore } from '@/stores/streak'

describe('StreakBadge', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('renders nothing when streakDays is 0', () => {
    const wrapper = mount(StreakBadge)
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('renders singular "1 dia" when streakDays === 1', () => {
    const s = useStreakStore()
    s.updateStreak(new Date(2026, 4, 17))
    const wrapper = mount(StreakBadge)
    expect(wrapper.text()).toContain('1 dia')
    expect(wrapper.text()).not.toContain('dias')
  })

  it('renders plural "N dias" when streakDays > 1', () => {
    const s = useStreakStore()
    s.updateStreak(new Date(2026, 4, 17))
    s.updateStreak(new Date(2026, 4, 18))
    s.updateStreak(new Date(2026, 4, 19))
    const wrapper = mount(StreakBadge)
    expect(wrapper.text()).toContain('3 dias')
  })
})
