import { computed, toValue } from 'vue'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

/**
 * Progressive unlock helper: item 0 is always unlocked; item N is unlocked
 * iff item N-1 is "complete" per the predicate (or didn't exist).
 *
 * Returns a reactive set of unlocked indices so callers can do
 * `unlocked.value.has(i)` in templates.
 */
export function useUnlockMap<T>(
  items: MaybeRefOrGetter<readonly T[]>,
  isComplete: (item: T) => boolean,
): ComputedRef<Set<number>> {
  return computed(() => {
    const list = toValue(items)
    const unlocked = new Set<number>()
    if (list.length === 0) return unlocked
    unlocked.add(0)
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1]
      if (prev === undefined) break
      if (isComplete(prev)) {
        unlocked.add(i)
      } else {
        break
      }
    }
    return unlocked
  })
}
