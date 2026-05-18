import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LevelUpToast from '../LevelUpToast.vue'
import { useLevelUpStore } from '@/stores/levelUp'

describe('LevelUpToast', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing while show=false', () => {
    const wrapper = mount(LevelUpToast)
    expect(wrapper.find('.levelup-toast').exists()).toBe(false)
  })

  it('appears after trigger and dismisses automatically after 4s', async () => {
    const wrapper = mount(LevelUpToast)
    const store = useLevelUpStore()

    store.trigger(5, 'Desenvolvedor')
    await flushPromises()

    expect(wrapper.find('.levelup-toast').exists()).toBe(true)
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('Desenvolvedor')

    vi.advanceTimersByTime(4000)
    await flushPromises()

    expect(store.show).toBe(false)
  })

  it('click on toast dismisses immediately', async () => {
    const wrapper = mount(LevelUpToast)
    const store = useLevelUpStore()
    store.trigger(3, 'Aprendiz')
    await flushPromises()

    await wrapper.find('.levelup-toast').trigger('click')
    expect(store.show).toBe(false)
  })

  it('re-triggering resets the auto-dismiss timer', async () => {
    const wrapper = mount(LevelUpToast)
    const store = useLevelUpStore()

    store.trigger(2, 'Explorador')
    await flushPromises()

    vi.advanceTimersByTime(2000) // halfway
    store.trigger(3, 'Aprendiz') // restart timer
    await flushPromises()

    vi.advanceTimersByTime(2500) // total since first 4.5s, but only 2.5s since reset
    await flushPromises()

    expect(store.show).toBe(true) // still visible because timer was reset

    vi.advanceTimersByTime(2000) // now total 4.5s since reset
    await flushPromises()

    expect(store.show).toBe(false)
  })
})
