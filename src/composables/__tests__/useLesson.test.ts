import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useLesson } from '../useLesson'

describe('useLesson', () => {
  it('returns lesson + module + course for a valid id', () => {
    const { lesson, module, course, notFound } = useLesson(
      ref('vue/reactivity/ref'),
    )
    expect(lesson.value?.id).toBe('vue/reactivity/ref')
    expect(module.value?.id).toBe('reactivity')
    expect(course.value?.id).toBe('vue')
    expect(notFound.value).toBe(false)
  })

  it('returns nulls and notFound=true for invalid id', () => {
    const { lesson, module, course, notFound } = useLesson(ref('bad/id'))
    expect(lesson.value).toBeNull()
    expect(module.value).toBeNull()
    expect(course.value).toBeNull()
    expect(notFound.value).toBe(true)
  })

  it('reacts to id changes', () => {
    const id = ref('vue/reactivity/ref')
    const { lesson, notFound } = useLesson(id)
    expect(lesson.value?.id).toBe('vue/reactivity/ref')

    id.value = 'vue/reactivity/ref'
    expect(lesson.value?.id).toBe('vue/reactivity/ref')
    expect(notFound.value).toBe(false)

    id.value = 'nope'
    expect(lesson.value).toBeNull()
    expect(notFound.value).toBe(true)
  })
})
