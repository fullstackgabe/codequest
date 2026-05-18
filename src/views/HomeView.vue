<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { listCourses } from '@/data/courses'
import { useXPStore } from '@/stores/xp'
import XPBar from '@/components/game/XPBar.vue'
import StreakBadge from '@/components/game/StreakBadge.vue'
import CourseCard from '@/components/course/CourseCard.vue'

const courses = listCourses()
const { xp } = storeToRefs(useXPStore())

const greeting = computed(() =>
  xp.value === 0
    ? 'Bem-vindo! Escolha um curso para começar.'
    : 'Continue de onde parou.',
)
</script>

<template>
  <div class="page">
    <div class="container">
      <section class="home-hero">
        <h1>Code Quest ⚡</h1>
        <p class="home-hero__greeting">{{ greeting }}</p>
        <div class="home-hero__stats">
          <XPBar />
          <StreakBadge />
        </div>
      </section>

      <section class="home-courses">
        <h2>Cursos</h2>
        <div v-if="courses.length === 0" class="home-courses__empty">
          Nenhum curso disponível ainda.
        </div>
        <div v-else class="course-grid">
          <CourseCard
            v-for="course in courses"
            :key="course.id"
            :course="course"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-hero {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.home-hero h1 {
  font-size: 2.5rem;
  color: var(--primary);
  margin: 0 0 0.5rem;
}

.home-hero__greeting {
  color: var(--text-muted);
  margin: 0 0 1.5rem;
}

.home-hero__stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.home-courses h2 {
  margin: 0 0 1rem;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.home-courses__empty {
  color: var(--text-muted);
  text-align: center;
  padding: 2rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}
</style>
