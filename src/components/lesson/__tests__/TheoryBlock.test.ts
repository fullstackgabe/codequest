import { describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TheoryBlock from '../TheoryBlock.vue'
import type { TheoryBlock as TheoryBlockType } from '@/types/theory'

const baseBlock: TheoryBlockType = {
  tag: 't',
  title: 'Title',
  body: 'Some body text',
}

describe('TheoryBlock', () => {
  it('renders title and body without editor when no code', () => {
    const wrapper = mount(TheoryBlock, { props: { block: baseBlock } })
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Some body text')
    expect(wrapper.findComponent({ name: 'CodeEditor' }).exists()).toBe(false)
  })

  it('renders CodeEditor with detected language=js for JS code', async () => {
    const block: TheoryBlockType = {
      ...baseBlock,
      code: 'const x = 1',
    }
    const wrapper = mount(TheoryBlock, {
      props: { block },
      attachTo: document.body,
    })
    await flushPromises()
    const editor = wrapper.findComponent({ name: 'CodeEditor' })
    expect(editor.exists()).toBe(true)
    expect(editor.props('language')).toBe('js')
  })

  it('detects HTML when code contains <template>', async () => {
    const block: TheoryBlockType = {
      ...baseBlock,
      code: '<template><div>hi</div></template>',
    }
    const wrapper = mount(TheoryBlock, {
      props: { block },
      attachTo: document.body,
    })
    await flushPromises()
    const editor = wrapper.findComponent({ name: 'CodeEditor' })
    expect(editor.props('language')).toBe('html')
  })
})
