import { afterEach, describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CodeEditor from '../CodeEditor.vue'

describe('CodeEditor', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders provided text in readonly mode', async () => {
    const wrapper = mount(CodeEditor, {
      props: {
        modelValue: 'const a = 1',
        language: 'js',
        readonly: true,
      },
      attachTo: document.body,
    })
    await flushPromises()
    // CodeMirror renders content into .cm-content
    expect(wrapper.find('.code-editor--readonly').exists()).toBe(true)
    expect(wrapper.element.textContent).toContain('const')
  })

  it('mounts in editable mode without readonly styling', async () => {
    const wrapper = mount(CodeEditor, {
      props: { modelValue: 'foo', language: 'js', readonly: false },
      attachTo: document.body,
    })
    await flushPromises()
    expect(wrapper.find('.code-editor--readonly').exists()).toBe(false)
    expect(wrapper.find('.cm-editor').exists()).toBe(true)
    expect(wrapper.element.textContent).toContain('foo')
  })

  it('updates editor content when modelValue prop changes externally', async () => {
    const wrapper = mount(CodeEditor, {
      props: { modelValue: 'one', language: 'js', readonly: true },
      attachTo: document.body,
    })
    await flushPromises()
    expect(wrapper.element.textContent).toContain('one')

    await wrapper.setProps({ modelValue: 'two' })
    await flushPromises()
    expect(wrapper.element.textContent).toContain('two')
  })
})
