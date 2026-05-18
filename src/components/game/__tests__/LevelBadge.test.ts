import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LevelBadge from '../LevelBadge.vue'
import { useXPStore } from '@/stores/xp'

describe('LevelBadge', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('renders Lv N · Title from store', () => {
    const xp = useXPStore()
    xp.addXP(200)
    const wrapper = mount(LevelBadge)
    expect(wrapper.text()).toMatch(/Lv 2 · .+/)
  })
})
