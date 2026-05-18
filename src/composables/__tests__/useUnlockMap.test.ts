import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useUnlockMap } from '../useUnlockMap'

interface Item {
  id: string
  done: boolean
}

describe('useUnlockMap', () => {
  it('returns empty set for empty list', () => {
    const result = useUnlockMap<Item>(ref<Item[]>([]), (x) => x.done)
    expect(result.value.size).toBe(0)
  })

  it('always unlocks the first item', () => {
    const result = useUnlockMap<Item>(
      ref([
        { id: 'a', done: false },
        { id: 'b', done: false },
      ]),
      (x) => x.done,
    )
    expect(Array.from(result.value)).toEqual([0])
  })

  it('unlocks next item after previous is complete', () => {
    const items = ref<Item[]>([
      { id: 'a', done: true },
      { id: 'b', done: false },
      { id: 'c', done: false },
    ])
    const result = useUnlockMap(items, (x) => x.done)
    expect(Array.from(result.value).sort()).toEqual([0, 1])
  })

  it('stops at first gap (does not unlock later items)', () => {
    const items = ref<Item[]>([
      { id: 'a', done: true },
      { id: 'b', done: false },
      { id: 'c', done: true }, // would be unlocked transitively, but b is the gap
    ])
    const result = useUnlockMap(items, (x) => x.done)
    expect(result.value.has(2)).toBe(false)
  })

  it('reacts when items mutate (refs swap to new state)', () => {
    const items = ref<Item[]>([
      { id: 'a', done: false },
      { id: 'b', done: false },
    ])
    const result = useUnlockMap(items, (x) => x.done)
    expect(result.value.has(1)).toBe(false)

    items.value = [
      { id: 'a', done: true },
      { id: 'b', done: false },
    ]
    expect(result.value.has(1)).toBe(true)
  })
})
