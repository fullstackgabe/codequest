import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import FlashCard from '../FlashCard.vue'
import type { Flashcard } from '@/types/flashcard'

const baseCard: Flashcard = {
  id: 'stub/intro/hello-world/fc-1',
  front: 'Qual a função?',
  back: 'console.log()',
  requires: ['hello-world'],
}

describe('FlashCard', () => {
  it('renders front and hides back initially', () => {
    const wrapper = mount(FlashCard, { props: { card: baseCard } })
    expect(wrapper.text()).toContain('Qual a função?')
    expect(wrapper.text()).not.toContain('console.log()')
  })

  it('reveals back and shows 6 rating buttons after click', async () => {
    const wrapper = mount(FlashCard, { props: { card: baseCard } })
    await wrapper.find('button.btn-primary').trigger('click')
    expect(wrapper.text()).toContain('console.log()')
    const ratings = wrapper.findAll('.flashcard__rating')
    expect(ratings).toHaveLength(6)
  })

  it('emits rated with cardId + quality when rating clicked', async () => {
    const wrapper = mount(FlashCard, { props: { card: baseCard } })
    await wrapper.find('button.btn-primary').trigger('click')
    const ratings = wrapper.findAll('.flashcard__rating')
    const perfect = ratings[5]
    if (!perfect) throw new Error('rating 5 missing')
    await perfect.trigger('click')
    const emits = wrapper.emitted('rated') ?? []
    expect(emits).toHaveLength(1)
    expect(emits[0]?.[0]).toEqual({ cardId: baseCard.id, quality: 5 })
  })

  it('resets reveal state when card prop changes', async () => {
    const wrapper = mount(FlashCard, { props: { card: baseCard } })
    await wrapper.find('button.btn-primary').trigger('click')
    expect(wrapper.text()).toContain('console.log()')

    const otherCard: Flashcard = {
      id: 'stub/intro/variables/fc-1',
      front: 'Qual keyword?',
      back: 'const',
      requires: ['variables'],
    }
    await wrapper.setProps({ card: otherCard })
    await flushPromises()
    expect(wrapper.text()).toContain('Qual keyword?')
    expect(wrapper.text()).not.toContain('const')
  })
})
