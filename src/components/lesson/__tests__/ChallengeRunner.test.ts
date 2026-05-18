import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ChallengeRunner from '../ChallengeRunner.vue'
import type { FillBlankChallenge } from '@/types/challenge'

const fillBlank: FillBlankChallenge = {
  id: 'vue/reactivity/ref/ch-1',
  type: 'fill-blank',
  title: 'Imprima Hello, World',
  description: 'Complete o código',
  xpReward: 20,
  requires: ['hello-world'],
  solution: 'console.log("Hello, World!")',
  template: '___.log("Hello, World!")',
  blanks: ['console'],
}

describe('ChallengeRunner', () => {
  it('renders header badges + title + description', async () => {
    const wrapper = mount(ChallengeRunner, {
      props: { challenge: fillBlank, complete: false },
      attachTo: document.body,
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Preencha as lacunas')
    expect(wrapper.text()).toContain('+20 XP')
    expect(wrapper.text()).toContain('Imprima Hello, World')
  })

  it('shows "Concluído ✓" badge when complete prop is true', async () => {
    const wrapper = mount(ChallengeRunner, {
      props: { challenge: fillBlank, complete: true },
      attachTo: document.body,
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Concluído')
  })

  it('emits complete with firstTry=true on first correct verify', async () => {
    const wrapper = mount(ChallengeRunner, {
      props: { challenge: fillBlank, complete: false },
      attachTo: document.body,
    })
    await flushPromises()
    // Force the v-model to the correct answer.
    await wrapper.findComponent({ name: 'CodeEditor' }).vm.$emit(
      'update:modelValue',
      'console.log("Hello, World!")',
    )
    await wrapper.find('button.btn-primary').trigger('click')
    const emits = wrapper.emitted('complete') ?? []
    expect(emits).toHaveLength(1)
    expect(emits[0]?.[0]).toEqual({
      challengeId: fillBlank.id,
      firstTry: true,
    })
  })

  it('shows error feedback on wrong answer and does NOT emit', async () => {
    const wrapper = mount(ChallengeRunner, {
      props: {
        challenge: { ...fillBlank, explanation: 'Use o console!' },
        complete: false,
      },
      attachTo: document.body,
    })
    await flushPromises()
    await wrapper.findComponent({ name: 'CodeEditor' }).vm.$emit(
      'update:modelValue',
      'window.log("Hello, World!")',
    )
    await wrapper.find('button.btn-primary').trigger('click')
    expect(wrapper.emitted('complete')).toBeUndefined()
    expect(wrapper.text()).toContain('Ainda não está certo.')
  })

  it('second correct attempt after a wrong one reports firstTry=false', async () => {
    const wrapper = mount(ChallengeRunner, {
      props: { challenge: fillBlank, complete: false },
      attachTo: document.body,
    })
    await flushPromises()
    const editor = wrapper.findComponent({ name: 'CodeEditor' })

    await editor.vm.$emit('update:modelValue', 'window.log("Hello, World!")')
    await wrapper.find('button.btn-primary').trigger('click')

    await editor.vm.$emit('update:modelValue', 'console.log("Hello, World!")')
    await wrapper.find('button.btn-primary').trigger('click')

    const emits = wrapper.emitted('complete') ?? []
    expect(emits).toHaveLength(1)
    expect(emits[0]?.[0]).toEqual({
      challengeId: fillBlank.id,
      firstTry: false,
    })
  })
})
