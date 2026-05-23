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
    const course = getCourse('vue')
    if (!course) throw new Error('vue course missing from registry')
    return mount(CourseCard, {
      props: { course },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
  }

  it('renders title, icon and "Começar" CTA when no progress', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Vue.js')
    // Icon is now an inline brand SVG rendered via v-html, so it lives in
    // wrapper.html() (not .text()).
    expect(wrapper.html()).toContain('<svg')
    expect(wrapper.text()).toMatch(/0%/)
    expect(wrapper.text()).toMatch(/0\/\d+ lições/)
    expect(wrapper.text()).toContain('Começar')
  })

  it('shows partial progress with "Continuar" CTA when 1 lesson is completed', async () => {
    const progress = useCourseProgressStore()
    progress.completeLesson('vue', 'vue/reactivity/ref')
    const wrapper = mountCard()
    expect(wrapper.text()).toMatch(/1\/\d+ lições/)
    expect(wrapper.text()).toContain('Continuar')
  })

  it('routes to /course/:id', () => {
    const wrapper = mountCard()
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.props('to')).toBe('/course/vue')
  })
})
