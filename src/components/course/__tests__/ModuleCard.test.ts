import { beforeEach, describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ModuleCard from '../ModuleCard.vue'
import { useCourseProgressStore } from '@/stores/courseProgress'
import { getCourse } from '@/data/courses'

describe('ModuleCard', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  function mountCard(opts: { locked: boolean; complete?: boolean }) {
    const course = getCourse('stub')
    if (!course || !course.modules[0]) throw new Error('stub missing')
    if (opts.complete) {
      const progress = useCourseProgressStore()
      for (const lesson of course.modules[0].lessons) {
        progress.completeLesson('stub', lesson.id)
      }
    }
    return mount(ModuleCard, {
      props: {
        module: course.modules[0],
        locked: opts.locked,
        courseId: 'stub',
      },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
  }

  it('locked card renders as a non-link with lock icon', () => {
    const wrapper = mountCard({ locked: true })
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)
    expect(wrapper.text()).toContain('🔒')
  })

  it('unlocked card renders as RouterLink to module path', () => {
    const wrapper = mountCard({ locked: false })
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toBe('/course/stub/module/intro')
    expect(wrapper.text()).toContain('0/2 lições')
  })

  it('complete module shows "Concluído ✓" badge', () => {
    const wrapper = mountCard({ locked: false, complete: true })
    expect(wrapper.text()).toContain('Concluído')
  })
})
