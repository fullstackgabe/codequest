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

  it('renders title, icon and 0% / "Começar" CTA when no progress', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('🟢')
    // The CourseCard sums lessons across modules; vue has 1 lesson total
    expect(wrapper.text()).toContain('0% · 0/1 lições')
    expect(wrapper.text()).toContain('Começar')
  })

  it('updates to 100% / "Revisar" when the only lesson is completed', async () => {
    const progress = useCourseProgressStore()
    progress.completeLesson('vue', 'vue/reactivity/ref')
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('100% · 1/1 lições')
    expect(wrapper.text()).toContain('Revisar')
  })

  it('routes to /course/:id', () => {
    const wrapper = mountCard()
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.props('to')).toBe('/course/vue')
  })
})
