<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useLevelUpStore } from '@/stores/levelUp'

const DISMISS_MS = 4000

const store = useLevelUpStore()
const { show, level, title } = storeToRefs(store)

let timer: ReturnType<typeof setTimeout> | null = null

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer)
    timer = null
  }
}

// Watch the combined tuple so re-triggers with the same `show=true` value
// (different level/title) also restart the auto-dismiss timer.
watch([show, level, title], () => {
  clearTimer()
  if (show.value) {
    timer = setTimeout(() => {
      store.dismiss()
    }, DISMISS_MS)
  }
})

onBeforeUnmount(clearTimer)

function handleClick(): void {
  store.dismiss()
}
</script>

<template>
  <Transition name="toast">
    <button
      v-if="show"
      class="levelup-toast"
      type="button"
      @click="handleClick"
    >
      <span class="levelup-toast__icon">⚡</span>
      <span class="levelup-toast__body">
        <span class="levelup-toast__title">Subiu de nível!</span>
        <span class="levelup-toast__detail">Lv {{ level }} · {{ title }}</span>
      </span>
      <span class="levelup-toast__close">×</span>
    </button>
  </Transition>
</template>

<style scoped>
.levelup-toast {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.1rem;
  border: 1px solid rgba(251, 191, 36, 0.5);
  border-radius: var(--radius);
  background: linear-gradient(135deg, #1a1a2e, #2a2a4a);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  animation: pulse-glow 2s ease infinite;
  box-shadow: var(--shadow);
}

.levelup-toast__icon {
  font-size: 1.4rem;
  color: var(--xp-gold);
}

.levelup-toast__body {
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.3;
}

.levelup-toast__title {
  font-weight: 700;
  color: var(--xp-gold);
}

.levelup-toast__detail {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.levelup-toast__close {
  color: var(--text-dim);
  font-size: 1.1rem;
  margin-left: 0.5rem;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
