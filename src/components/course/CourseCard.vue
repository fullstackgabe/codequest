<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Course } from '@/types/course'
import { useCourseProgressStore } from '@/stores/courseProgress'

const props = defineProps<{ course: Course }>()

const progress = useCourseProgressStore()
const stats = computed(() => progress.getCourseStats(props.course.id))

const ctaLabel = computed<string>(() => {
  const p = stats.value.percentComplete
  if (p === 0) return 'Começar'
  if (p === 100) return 'Revisar'
  return 'Continuar'
})
</script>

<template>
  <RouterLink
    :to="`/course/${course.id}`"
    class="course-card card"
    :style="{ borderTopColor: course.color }"
  >
    <div class="course-card__head">
      <span class="course-card__icon" :style="{ color: course.color }">
        {{ course.icon }}
      </span>
      <h3 class="course-card__title">{{ course.title }}</h3>
    </div>

    <p class="course-card__description">{{ course.description }}</p>

    <div class="course-card__progress">
      <div class="progress-bar">
        <div
          class="progress-bar-fill"
          :style="{ width: `${stats.percentComplete}%` }"
        />
      </div>
      <span class="course-card__progress-text">
        {{ stats.percentComplete }}% · {{ stats.completedLessons }}/{{
          stats.totalLessons
        }}
        lições
      </span>
    </div>

    <span class="course-card__cta">{{ ctaLabel }} →</span>
  </RouterLink>
</template>

<style scoped>
.course-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text);
  border-top: 3px solid var(--border);
  transition: transform 0.2s, border-color 0.2s;
}

.course-card:hover,
.course-card:focus-visible {
  transform: translateY(-2px);
  outline: none;
}

.course-card:focus-visible {
  box-shadow: 0 0 0 2px var(--primary);
}

.course-card__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.course-card__icon {
  font-size: 1.75rem;
}

.course-card__title {
  margin: 0;
  font-size: 1.1rem;
}

.course-card__description {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
  flex: 1;
}

.course-card__progress {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.course-card__progress-text {
  font-size: 0.8rem;
  color: var(--text-dim);
  font-family: var(--font-mono);
}

.course-card__cta {
  margin-top: 0.25rem;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
}
</style>
