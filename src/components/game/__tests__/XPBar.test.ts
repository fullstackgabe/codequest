import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import XPBar from '../XPBar.vue'
import { useXPStore } from '@/stores/xp'

describe('XPBar', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('renders current level and XP from store', () => {
    const xp = useXPStore()
    xp.addXP(150)
    const wrapper = mount(XPBar)
    expect(wrapper.text()).toContain('Lv 2')
    expect(wrapper.text()).toContain('150')
  })

  it('shows MAX label at top level', () => {
    const xp = useXPStore()
    xp.addXP(25_000)
    const wrapper = mount(XPBar)
    expect(wrapper.text()).toContain('MAX')
    expect(wrapper.text()).not.toContain('XP')
  })

  it('hides level title in compact mode', () => {
    const xp = useXPStore()
    xp.addXP(500) // Level 4
    const wrapper = mount(XPBar, { props: { compact: true } })
    // compact omits the title element
    expect(wrapper.find('.xpbar__title').exists()).toBe(false)
    expect(wrapper.text()).toContain('Lv 4')
  })
})
