import { beforeEach, describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CourseCard from '../CourseCard.vue'
import { useCourseProgressStore } from '@/stores/courseProgress'
import { getCourse } from '@/data/courses'

describe('CourseCard', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  function mountCard() {
    const course = getCourse('stub')
    if (!course) throw new Error('stub course missing from registry')
    return mount(CourseCard, {
      props: { course },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
  }

  it('renders title, icon and 0% / "Começar" CTA when no progress', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Curso Stub')
    expect(wrapper.text()).toContain('🧪')
    expect(wrapper.text()).toContain('0% · 0/2 lições')
    expect(wrapper.text()).toContain('Começar')
  })

  it('updates to 50% and "Continuar" when 1 lesson is completed', async () => {
    const progress = useCourseProgressStore()
    progress.completeLesson('stub', 'stub/intro/hello-world')
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('50% · 1/2 lições')
    expect(wrapper.text()).toContain('Continuar')
  })

  it('routes to /course/:id', () => {
    const wrapper = mountCard()
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.props('to')).toBe('/course/stub')
  })
})
