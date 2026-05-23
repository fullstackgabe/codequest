<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Course } from '@/types/course'
import { useCourseProgressStore } from '@/stores/courseProgress'
import CourseIcon from './CourseIcon.vue'

const props = defineProps<{ course: Course }>()

const progress = useCourseProgressStore()
const stats = computed(() => progress.getCourseStats(props.course.id))

const ctaLabel = computed<string>(() => {
  const p = stats.value.percentComplete
  if (p === 0) return 'Começar'
  if (p === 100) return 'Revisar'
  return 'Continuar'
})

const status = computed<'new' | 'in-progress' | 'done'>(() => {
  const p = stats.value.percentComplete
  if (p === 0) return 'new'
  if (p === 100) return 'done'
  return 'in-progress'
})
</script>

<template>
  <RouterLink
    :to="`/course/${course.id}`"
    class="course-card"
    :class="`course-card--${status}`"
    :style="{ '--course-color': course.color }"
  >
    <div class="course-card__bg" aria-hidden="true" />

    <div class="course-card__head">
      <span class="course-card__icon-box">
        <CourseIcon
          :icon="course.icon"
          :color="course.color"
          class="course-card__icon"
        />
      </span>
      <div class="course-card__heading">
        <h3 class="course-card__title">{{ course.title }}</h3>
        <span class="course-card__status">
          <template v-if="status === 'done'">✓ Completo</template>
          <template v-else-if="status === 'in-progress'">Em andamento</template>
          <template v-else>Novo curso</template>
        </span>
      </div>
    </div>

    <p class="course-card__description">{{ course.description }}</p>

    <div class="course-card__progress">
      <div class="course-card__progress-bar">
        <div
          class="course-card__progress-fill"
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

    <span class="course-card__cta">
      <span>{{ ctaLabel }}</span>
      <span aria-hidden="true">→</span>
    </span>
  </RouterLink>
</template>

<style scoped>
.course-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.5rem;
  text-decoration: none;
  color: var(--text);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-top: 3px solid var(--course-color, var(--border));
  border-radius: var(--radius);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.25s ease;
}

.course-card__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--course-color, var(--primary)) 10%, transparent) 0%,
    transparent 55%
  );
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.course-card:hover,
.course-card:focus-visible {
  transform: translateY(-3px);
  outline: none;
  border-color: color-mix(
    in srgb,
    var(--course-color, var(--primary)) 45%,
    var(--border)
  );
  box-shadow:
    0 8px 30px color-mix(in srgb, var(--course-color, var(--primary)) 25%, transparent),
    0 0 0 1px color-mix(in srgb, var(--course-color, var(--primary)) 25%, transparent);
}

.course-card:hover .course-card__bg,
.course-card:focus-visible .course-card__bg {
  opacity: 1;
}

.course-card__head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  position: relative;
  z-index: 1;
}

.course-card__icon-box {
  width: 2.75rem;
  height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--course-color, var(--primary)) 15%, transparent);
  border: 1px solid
    color-mix(in srgb, var(--course-color, var(--primary)) 30%, transparent);
}

.course-card__icon {
  font-size: 1.75rem;
  filter: drop-shadow(
    0 0 6px color-mix(in srgb, var(--course-color, var(--primary)) 60%, transparent)
  );
}

.course-card__heading {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.course-card__title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text);
}

.course-card__status {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  font-weight: 600;
}

.course-card--in-progress .course-card__status {
  color: var(--course-color, var(--primary));
}

.course-card--done .course-card__status {
  color: var(--success);
}

.course-card__description {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

.course-card__progress {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  z-index: 1;
}

.course-card__progress-bar {
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.course-card__progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    var(--course-color, var(--primary)),
    color-mix(in srgb, var(--course-color, var(--primary)) 60%, white)
  );
  box-shadow: 0 0 10px
    color-mix(in srgb, var(--course-color, var(--primary)) 50%, transparent);
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.course-card__progress-text {
  font-size: 0.8rem;
  color: var(--text-dim);
  font-family: var(--font-mono);
}

.course-card__cta {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.25rem;
  padding: 0.55rem 0.9rem;
  background: color-mix(in srgb, var(--course-color, var(--primary)) 14%, transparent);
  color: var(--course-color, var(--primary));
  border: 1px solid
    color-mix(in srgb, var(--course-color, var(--primary)) 35%, transparent);
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.9rem;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  position: relative;
  z-index: 1;
}

.course-card:hover .course-card__cta,
.course-card:focus-visible .course-card__cta {
  background: color-mix(in srgb, var(--course-color, var(--primary)) 22%, transparent);
}
</style>
