<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Module } from '@/types/module'
import { useCourseProgressStore } from '@/stores/courseProgress'

const props = defineProps<{
  module: Module
  locked: boolean
  courseId: string
}>()

const progress = useCourseProgressStore()

const completedCount = computed(
  () =>
    props.module.lessons.filter((l) =>
      progress.isLessonComplete(props.courseId, l.id),
    ).length,
)

const totalCount = computed(() => props.module.lessons.length)
const isComplete = computed(
  () => totalCount.value > 0 && completedCount.value === totalCount.value,
)

const target = computed(
  () => `/course/${props.courseId}/module/${props.module.id}`,
)
</script>

<template>
  <component
    :is="locked ? 'div' : RouterLink"
    :to="locked ? undefined : target"
    class="module-card card"
    :class="{
      'module-card--locked': locked,
      'module-card--complete': isComplete,
    }"
    :style="{ borderLeftColor: module.color }"
  >
    <div class="module-card__head">
      <span class="module-card__icon" :style="{ color: module.color }">
        {{ locked ? '🔒' : module.icon }}
      </span>
      <h3 class="module-card__title">{{ module.title }}</h3>
      <span v-if="isComplete" class="badge badge-green">Concluído ✓</span>
    </div>

    <p class="module-card__description">{{ module.description }}</p>

    <div class="module-card__progress">
      <span
        v-if="totalCount === 0"
        class="module-card__count module-card__count--soon"
      >
        Em breve
      </span>
      <span v-else class="module-card__count">
        {{ completedCount }}/{{ totalCount }} lições
      </span>
    </div>
  </component>
</template>

<style scoped>
.module-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--text);
  border-left: 4px solid var(--border);
  transition: transform 0.2s, border-color 0.2s;
}

.module-card:not(.module-card--locked):hover {
  transform: translateY(-2px);
}

.module-card--locked {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.module-card__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.module-card__icon {
  font-size: 1.4rem;
}

.module-card__title {
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
}

.module-card__description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
}

.module-card__count {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-dim);
}

.module-card__count--soon {
  color: var(--text-muted);
  font-style: italic;
}
</style>
