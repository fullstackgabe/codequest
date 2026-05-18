import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useLesson } from '../useLesson'

describe('useLesson', () => {
  it('returns lesson + module + course for a valid id', () => {
    const { lesson, module, course, notFound } = useLesson(
      ref('stub/intro/hello-world'),
    )
    expect(lesson.value?.id).toBe('stub/intro/hello-world')
    expect(module.value?.id).toBe('intro')
    expect(course.value?.id).toBe('stub')
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
    const id = ref('stub/intro/hello-world')
    const { lesson, notFound } = useLesson(id)
    expect(lesson.value?.id).toBe('stub/intro/hello-world')

    id.value = 'stub/intro/variables'
    expect(lesson.value?.id).toBe('stub/intro/variables')
    expect(notFound.value).toBe(false)

    id.value = 'nope'
    expect(lesson.value).toBeNull()
    expect(notFound.value).toBe(true)
  })
})
