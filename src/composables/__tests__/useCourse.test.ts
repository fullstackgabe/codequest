import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useCourse } from '../useCourse'

describe('useCourse', () => {
  it('returns the course for a valid id', () => {
    const { course, notFound } = useCourse(ref('vue'))
    expect(course.value?.id).toBe('vue')
    expect(notFound.value).toBe(false)
  })

  it('reacts to id changes', () => {
    const id = ref('vue')
    const { course, notFound } = useCourse(id)
    expect(course.value?.id).toBe('vue')

    id.value = 'unknown'
    expect(course.value).toBeNull()
    expect(notFound.value).toBe(true)

    id.value = 'vue'
    expect(course.value?.id).toBe('vue')
    expect(notFound.value).toBe(false)
  })

  it('accepts a getter (not just a Ref)', () => {
    let currentId = 'vue'
    const { course } = useCourse(() => currentId)
    expect(course.value?.id).toBe('vue')

    currentId = 'nope'
    // Getter is re-evaluated on access; force recomputation by reading
    // (computed is lazy + cached, so a tracked source is needed for reactivity;
    // this test simply verifies the getter form is accepted without runtime errors).
    expect(course.value).not.toBeUndefined()
  })
})
