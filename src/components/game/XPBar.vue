<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useXPStore } from '@/stores/xp'

defineProps<{ compact?: boolean }>()

const store = useXPStore()
const { xp, level, levelTitle, levelProgress, xpForNextLevel } = storeToRefs(store)

const isMaxLevel = computed(() => xpForNextLevel.value === null)
</script>

<template>
  <div class="xpbar" :class="{ 'xpbar--compact': compact }">
    <div class="xpbar__header">
      <span class="xpbar__level">Lv {{ level }}</span>
      <span v-if="!compact" class="xpbar__title">{{ levelTitle }}</span>
      <span class="xpbar__xp">
        <template v-if="isMaxLevel">MAX</template>
        <template v-else>{{ xp }} / {{ xp + (xpForNextLevel ?? 0) }} XP</template>
      </span>
    </div>
    <div class="progress-bar">
      <div class="progress-bar-fill" :style="{ width: `${levelProgress}%` }" />
    </div>
  </div>
</template>

<style scoped>
.xpbar {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 200px;
}

.xpbar--compact {
  min-width: 140px;
  gap: 0.25rem;
}

.xpbar__header {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-size: 0.85rem;
}

.xpbar--compact .xpbar__header {
  font-size: 0.75rem;
}

.xpbar__level {
  font-weight: 700;
  color: var(--primary);
}

.xpbar__title {
  color: var(--text-muted);
  flex: 1;
}

.xpbar__xp {
  color: var(--xp-gold);
  font-family: var(--font-mono);
  margin-left: auto;
}
</style>
