<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useCourse } from '@/composables/useCourse'
import { useUnlockMap } from '@/composables/useUnlockMap'
import { useCourseProgressStore } from '@/stores/courseProgress'
import { useSRSStore } from '@/stores/srs'
import ModuleCard from '@/components/course/ModuleCard.vue'
import CourseIcon from '@/components/course/CourseIcon.vue'
import type { Module } from '@/types/module'

const route = useRoute()
const courseIdRef = toRef(() => String(route.params.courseId ?? ''))
const { course, notFound } = useCourse(courseIdRef)

const progress = useCourseProgressStore()
const srs = useSRSStore()
const dueCount = computed(() => srs.dueCount(courseIdRef.value))
const reviewPath = computed(() => `/course/${courseIdRef.value}/review`)

function isModuleComplete(courseId: string, mod: Module): boolean {
  if (mod.lessons.length === 0) return true
  return mod.lessons.every((l) => progress.isLessonComplete(courseId, l.id))
}

const modulesRef = computed(() => course.value?.modules ?? [])

const unlockedIndices = useUnlockMap<Module>(modulesRef, (mod) =>
  isModuleComplete(courseIdRef.value, mod),
)
</script>

<template>
  <div class="page">
    <div class="container">
      <div v-if="notFound" class="not-found">
        <h1>Curso não encontrado</h1>
        <p class="text-muted">O curso "{{ courseIdRef }}" não está registrado.</p>
        <RouterLink to="/" class="btn btn-secondary">← Voltar pro hub</RouterLink>
      </div>

      <template v-else-if="course">
        <header class="course-header">
          <RouterLink to="/" class="course-header__back">← Hub</RouterLink>
          <div class="course-header__title">
            <CourseIcon
              :icon="course.icon"
              :color="course.color"
              class="course-header__icon"
            />
            <h1>{{ course.title }}</h1>
          </div>
          <p class="course-header__description">{{ course.description }}</p>
          <RouterLink
            v-if="dueCount > 0"
            :to="reviewPath"
            class="course-header__due-link"
          >
            🔁 {{ dueCount }} {{ dueCount === 1 ? 'card' : 'cards' }} pra revisar
          </RouterLink>
        </header>

        <section class="course-modules">
          <h2>Módulos</h2>
          <div v-if="modulesRef.length === 0" class="empty-state">
            Este curso ainda não tem módulos.
          </div>
          <div v-else class="course-modules__list">
            <ModuleCard
              v-for="(mod, idx) in modulesRef"
              :key="mod.id"
              :module="mod"
              :course-id="courseIdRef"
              :locked="!unlockedIndices.has(idx)"
            />
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.course-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.course-header__back {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.course-header__back:hover {
  color: var(--text);
}

.course-header__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.course-header__icon {
  font-size: 2rem;
}

.course-header__title h1 {
  margin: 0;
  font-size: 2rem;
}

.course-header__description {
  color: var(--text-muted);
  margin: 0.5rem 0 0;
}

.course-header__due-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  background: rgba(251, 191, 36, 0.12);
  color: var(--xp-gold);
  font-size: 0.85rem;
  text-decoration: none;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.course-header__due-link:hover {
  background: rgba(251, 191, 36, 0.2);
}

.course-modules h2 {
  margin: 0 0 1rem;
}

.course-modules__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
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
