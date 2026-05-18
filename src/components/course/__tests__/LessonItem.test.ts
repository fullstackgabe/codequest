import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import LessonItem from '../LessonItem.vue'
import { getLesson } from '@/data/courses'

describe('LessonItem', () => {
  function mountItem(opts: { locked: boolean; complete: boolean }) {
    const lesson = getLesson('stub/intro/hello-world')
    if (!lesson) throw new Error('stub lesson missing')
    return mount(LessonItem, {
      props: { lesson, locked: opts.locked, complete: opts.complete, courseId: 'stub' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
  }

  it('locked: renders as div, shows lock icon', () => {
    const wrapper = mountItem({ locked: true, complete: false })
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)
    expect(wrapper.text()).toContain('🔒')
  })

  it('complete: shows checkmark', () => {
    const wrapper = mountItem({ locked: false, complete: true })
    expect(wrapper.text()).toContain('✓')
  })

  it('available: RouterLink to lesson path', () => {
    const wrapper = mountItem({ locked: false, complete: false })
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/course/stub/lesson/stub/intro/hello-world')
  })
})
