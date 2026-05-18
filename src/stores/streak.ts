import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loadJSON, removeKey, saveJSON } from '@/utils/storage'
import { isYesterday, toDateString } from '@/utils/dates'

const STORAGE_KEY = 'codequest_streak'

interface PersistedStreak {
  streakDays: number
  lastActivityDate: string | null
}

export const useStreakStore = defineStore('streak', () => {
  const persisted = loadJSON<PersistedStreak>(STORAGE_KEY, {
    streakDays: 0,
    lastActivityDate: null,
  })
  const streakDays = ref(persisted.streakDays)
  const lastActivityDate = ref<string | null>(persisted.lastActivityDate)

  function persist(): void {
    saveJSON(STORAGE_KEY, {
      streakDays: streakDays.value,
      lastActivityDate: lastActivityDate.value,
    } satisfies PersistedStreak)
  }

  function updateStreak(now: Date = new Date()): void {
    const today = toDateString(now)
    if (lastActivityDate.value === today) return
    if (lastActivityDate.value && isYesterday(lastActivityDate.value, now)) {
      streakDays.value += 1
    } else {
      streakDays.value = 1
    }
    lastActivityDate.value = today
    persist()
  }

  function reset(): void {
    streakDays.value = 0
    lastActivityDate.value = null
    removeKey(STORAGE_KEY)
  }

  return { streakDays, lastActivityDate, updateStreak, reset }
})
