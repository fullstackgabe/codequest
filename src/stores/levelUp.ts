import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLevelUpStore = defineStore('levelUp', () => {
  const show = ref(false)
  const level = ref(0)
  const title = ref('')

  function trigger(newLevel: number, newTitle: string): void {
    level.value = newLevel
    title.value = newTitle
    show.value = true
  }

  function dismiss(): void {
    show.value = false
  }

  function reset(): void {
    show.value = false
    level.value = 0
    title.value = ''
  }

  return { show, level, title, trigger, dismiss, reset }
})
