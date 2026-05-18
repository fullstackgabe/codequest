import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { loadJSON, removeKey, saveJSON } from '@/utils/storage'
import {
  getLevelFromXP,
  getLevelProgress,
  getLevelTitle,
  getXPForNextLevel,
} from '@/utils/levels'
import { useLevelUpStore } from './levelUp'

const STORAGE_KEY = 'codequest_xp'

interface PersistedXP {
  xp: number
}

export type AddXPResult =
  | { levelUp: true; level: number; title: string }
  | { levelUp: false }

export const useXPStore = defineStore('xp', () => {
  const persisted = loadJSON<PersistedXP>(STORAGE_KEY, { xp: 0 })
  const xp = ref(persisted.xp)

  const level = computed(() => getLevelFromXP(xp.value))
  const levelTitle = computed(() => getLevelTitle(level.value))
  const levelProgress = computed(() => getLevelProgress(xp.value))
  const xpForNextLevel = computed(() => getXPForNextLevel(xp.value))

  function persist(): void {
    saveJSON(STORAGE_KEY, { xp: xp.value } satisfies PersistedXP)
  }

  function addXP(amount: number): AddXPResult {
    const safe = Number.isFinite(amount) ? amount : 0
    const oldLevel = level.value
    xp.value += safe
    persist()
    const newLevel = level.value
    if (newLevel > oldLevel) {
      const title = levelTitle.value
      useLevelUpStore().trigger(newLevel, title)
      return { levelUp: true, level: newLevel, title }
    }
    return { levelUp: false }
  }

  function reset(): void {
    xp.value = 0
    removeKey(STORAGE_KEY)
  }

  return {
    xp,
    level,
    levelTitle,
    levelProgress,
    xpForNextLevel,
    addXP,
    reset,
  }
})
