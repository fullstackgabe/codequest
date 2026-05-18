<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Lesson } from '@/types/lesson'

const props = defineProps<{
  lesson: Lesson
  locked: boolean
  complete: boolean
  courseId: string
}>()

const target = computed(
  () => `/course/${props.courseId}/lesson/${props.lesson.id}`,
)

const stateIcon = computed(() => {
  if (props.complete) return '✓'
  if (props.locked) return '🔒'
  return '▶'
})
</script>

<template>
  <component
    :is="locked ? 'div' : RouterLink"
    :to="locked ? undefined : target"
    class="lesson-item"
    :class="{
      'lesson-item--locked': locked,
      'lesson-item--complete': complete,
    }"
  >
    <span class="lesson-item__state-icon">{{ stateIcon }}</span>
    <span class="lesson-item__icon">{{ lesson.icon }}</span>
    <span class="lesson-item__title">{{ lesson.title }}</span>
    <span class="lesson-item__xp">+{{ lesson.xpReward }} XP</span>
  </component>
</template>

<style scoped>
.lesson-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text);
  background: var(--bg-card);
  transition: border-color 0.2s, transform 0.2s;
}

.lesson-item:not(.lesson-item--locked):hover {
  border-color: var(--primary);
  transform: translateX(2px);
}

.lesson-item--locked {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}

.lesson-item--complete .lesson-item__state-icon {
  color: var(--success);
  font-weight: 700;
}

.lesson-item--locked .lesson-item__state-icon {
  color: var(--text-dim);
}

.lesson-item__state-icon {
  width: 1.5rem;
  text-align: center;
  color: var(--primary);
}

.lesson-item__icon {
  font-size: 1.2rem;
}

.lesson-item__title {
  flex: 1;
}

.lesson-item__xp {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--xp-gold);
}
</style>
