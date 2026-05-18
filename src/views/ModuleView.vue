<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getCourse, getModule } from '@/data/courses'
import { useUnlockMap } from '@/composables/useUnlockMap'
import { useCourseProgressStore } from '@/stores/courseProgress'
import LessonItem from '@/components/course/LessonItem.vue'
import type { Lesson } from '@/types/lesson'

const route = useRoute()
const courseId = toRef(() => String(route.params.courseId ?? ''))
const moduleId = toRef(() => String(route.params.moduleId ?? ''))

const course = computed(() => getCourse(courseId.value))
const module = computed(() => getModule(courseId.value, moduleId.value))
const notFound = computed(() => module.value === null)

const progress = useCourseProgressStore()

const lessonsRef = computed(() => module.value?.lessons ?? [])

const unlockedIndices = useUnlockMap<Lesson>(lessonsRef, (lesson) =>
  progress.isLessonComplete(courseId.value, lesson.id),
)
</script>

<template>
  <div class="page">
    <div class="container">
      <div v-if="notFound" class="not-found">
        <h1>Módulo não encontrado</h1>
        <p class="text-muted">
          O módulo "{{ moduleId }}" não existe no curso "{{ courseId }}".
        </p>
        <RouterLink :to="`/course/${courseId}`" class="btn btn-secondary">
          ← Voltar pro curso
        </RouterLink>
      </div>

      <template v-else-if="module">
        <header class="module-header">
          <RouterLink :to="`/course/${courseId}`" class="module-header__back">
            ← {{ course?.title ?? 'Curso' }}
          </RouterLink>
          <div class="module-header__title">
            <span class="module-header__icon" :style="{ color: module.color }">
              {{ module.icon }}
            </span>
            <h1>{{ module.title }}</h1>
          </div>
          <p class="module-header__description">{{ module.description }}</p>
        </header>

        <section class="module-lessons">
          <h2>Lições</h2>
          <div v-if="lessonsRef.length === 0" class="empty-state">
            Este módulo ainda não tem lições.
          </div>
          <div v-else class="module-lessons__list">
            <LessonItem
              v-for="(lesson, idx) in lessonsRef"
              :key="lesson.id"
              :lesson="lesson"
              :course-id="courseId"
              :locked="!unlockedIndices.has(idx)"
              :complete="progress.isLessonComplete(courseId, lesson.id)"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.module-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.module-header__back {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.module-header__back:hover {
  color: var(--text);
}

.module-header__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.module-header__icon {
  font-size: 1.75rem;
}

.module-header__title h1 {
  margin: 0;
}

.module-header__description {
  color: var(--text-muted);
  margin: 0.5rem 0 0;
}

.module-lessons h2 {
  margin: 0 0 1rem;
}

.module-lessons__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-state,
.not-found {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem 0;
}

.not-found h1 {
  margin-bottom: 0.5rem;
}
</style>
