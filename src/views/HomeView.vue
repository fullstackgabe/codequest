<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { listCourses } from '@/data/courses'
import { useXPStore } from '@/stores/xp'
import { useStreakStore } from '@/stores/streak'
import { useSRSStore } from '@/stores/srs'
import { useCourseProgressStore } from '@/stores/courseProgress'
import CourseCard from '@/components/course/CourseCard.vue'

const courses = listCourses()

const xpStore = useXPStore()
const { xp, level, levelTitle, levelProgress, xpForNextLevel } = storeToRefs(xpStore)

const { streakDays } = storeToRefs(useStreakStore())

const srs = useSRSStore()
const progress = useCourseProgressStore()

const isMaxLevel = computed(() => xpForNextLevel.value === null)

const totalDueReviews = computed(() =>
  courses.reduce((sum, c) => sum + srs.dueCount(c.id), 0),
)

const totalCompletedLessons = computed(() =>
  courses.reduce((sum, c) => sum + progress.getCourseStats(c.id).completedLessons, 0),
)

const resumeCourse = computed(() => {
  const inProgress = courses.find((c) => {
    const p = progress.getCourseStats(c.id).percentComplete
    return p > 0 && p < 100
  })
  if (inProgress) return inProgress
  const finished = courses.find(
    (c) => progress.getCourseStats(c.id).percentComplete === 100,
  )
  return finished ?? null
})

const greeting = computed(() => {
  if (xp.value === 0) return 'Bem-vindo, programador'
  if (resumeCourse.value) return 'De volta à batalha'
  return 'Pronto pra próxima missão'
})

const streakLabel = computed(() =>
  streakDays.value === 1 ? '1 dia' : `${streakDays.value} dias`,
)

const reviewsLabel = computed(() =>
  totalDueReviews.value === 1 ? '1 revisão' : `${totalDueReviews.value} revisões`,
)

const lessonsLabel = computed(() =>
  totalCompletedLessons.value === 1
    ? '1 lição'
    : `${totalCompletedLessons.value} lições`,
)
</script>

<template>
  <div class="page">
    <div class="container">
      <section class="hero-panel">
        <div class="hero-panel__bg" aria-hidden="true" />

        <div class="hero-avatar-block">
          <div class="hero-avatar">
            <span class="hero-avatar__icon">⚡</span>
            <span class="hero-avatar__ring" aria-hidden="true" />
          </div>
          <div class="hero-level-pill">Lv {{ level }}</div>
        </div>

        <div class="hero-main">
          <p class="hero-greeting">{{ greeting }}</p>
          <h1 class="hero-title">{{ levelTitle }}</h1>

          <div class="hero-xp">
            <div class="hero-xp__bar">
              <div
                class="hero-xp__fill"
                :style="{ width: `${isMaxLevel ? 100 : levelProgress}%` }"
              />
            </div>
            <div class="hero-xp__meta">
              <span class="hero-xp__current">{{ xp }} XP</span>
              <span v-if="isMaxLevel" class="hero-xp__next hero-xp__next--max">
                ⭐ NÍVEL MÁXIMO
              </span>
              <span v-else class="hero-xp__next">
                faltam {{ xpForNextLevel }} XP pro Lv {{ level + 1 }}
              </span>
            </div>
          </div>

          <div class="hero-chips">
            <span class="hero-chip hero-chip--orange">
              <span class="hero-chip__icon">🔥</span>
              {{ streakLabel }}
            </span>
            <span class="hero-chip hero-chip--gold">
              <span class="hero-chip__icon">⏰</span>
              {{ reviewsLabel }}
            </span>
            <span class="hero-chip hero-chip--green">
              <span class="hero-chip__icon">⭐</span>
              {{ lessonsLabel }}
            </span>
          </div>

          <div class="hero-cta">
            <RouterLink
              v-if="resumeCourse"
              :to="`/course/${resumeCourse.id}`"
              class="btn btn-primary btn-lg hero-cta__btn"
            >
              <span>Continuar {{ resumeCourse.title }}</span>
              <span aria-hidden="true">→</span>
            </RouterLink>
            <p v-else class="hero-cta__welcome">
              Escolha sua primeira batalha abaixo 👇
            </p>
          </div>
        </div>
      </section>

      <section class="home-courses">
        <h2 class="home-courses__title">
          <span aria-hidden="true">⚔️</span> Cursos
        </h2>

        <div v-if="courses.length === 0" class="home-courses__empty">
          Nenhum curso disponível ainda.
        </div>

        <div v-else class="course-grid">
          <CourseCard v-for="course in courses" :key="course.id" :course="course" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ----- Hero panel ----- */

.hero-panel {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: center;
  padding: 2rem 2rem;
  margin-bottom: 2.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: linear-gradient(
    135deg,
    var(--bg-card) 0%,
    var(--bg-card-2) 100%
  );
  overflow: hidden;
  box-shadow: var(--shadow);
}

.hero-panel__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 0% 0%,
      rgba(66, 184, 131, 0.18),
      transparent 45%
    ),
    radial-gradient(
      circle at 100% 100%,
      rgba(139, 92, 246, 0.15),
      transparent 50%
    );
  pointer-events: none;
}

/* avatar */

.hero-avatar-block {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: 1;
}

.hero-avatar {
  position: relative;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(66, 184, 131, 0.25),
    rgba(66, 184, 131, 0.05) 70%
  );
  box-shadow: var(--shadow-glow);
}

.hero-avatar__icon {
  font-size: 3rem;
  filter: drop-shadow(0 0 12px rgba(66, 184, 131, 0.6));
  animation: hero-avatar-float 4s ease-in-out infinite;
}

.hero-avatar__ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(66, 184, 131, 0.4);
  animation: hero-avatar-pulse 3s ease-in-out infinite;
}

.hero-level-pill {
  padding: 0.25rem 0.85rem;
  background: var(--primary);
  color: #0f0f1a;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
  box-shadow: 0 4px 14px rgba(66, 184, 131, 0.45);
}

/* main */

.hero-main {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.hero-greeting {
  margin: 0 0 0.25rem;
  color: var(--text-muted);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.hero-title {
  margin: 0 0 1.25rem;
  font-size: 2rem;
  color: var(--text);
  line-height: 1.15;
  background: linear-gradient(90deg, var(--primary-bright), var(--xp-gold));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* xp bar */

.hero-xp {
  margin-bottom: 1.25rem;
}

.hero-xp__bar {
  position: relative;
  height: 14px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border);
  overflow: hidden;
}

.hero-xp__fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--primary) 0%,
    var(--primary-bright) 50%,
    var(--xp-gold) 100%
  );
  border-radius: 999px;
  box-shadow: 0 0 16px rgba(66, 184, 131, 0.55);
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-xp__meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  font-family: var(--font-mono);
}

.hero-xp__current {
  color: var(--xp-gold);
  font-weight: 700;
}

.hero-xp__next {
  color: var(--text-muted);
}

.hero-xp__next--max {
  color: var(--xp-gold);
  font-weight: 700;
}

/* chips */

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.hero-chip__icon {
  font-size: 0.95rem;
}

.hero-chip--orange {
  background: rgba(249, 115, 22, 0.12);
  color: var(--streak-orange);
  border-color: rgba(249, 115, 22, 0.3);
}

.hero-chip--gold {
  background: rgba(251, 191, 36, 0.12);
  color: var(--xp-gold);
  border-color: rgba(251, 191, 36, 0.3);
}

.hero-chip--green {
  background: rgba(66, 184, 131, 0.12);
  color: var(--primary);
  border-color: rgba(66, 184, 131, 0.3);
}

/* cta */

.hero-cta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hero-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
}

.hero-cta__welcome {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* ----- Courses section ----- */

.home-courses__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  font-size: 1.35rem;
  letter-spacing: 0.01em;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.home-courses__empty {
  color: var(--text-muted);
  text-align: center;
  padding: 2rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
}

/* ----- Animations ----- */

@keyframes hero-avatar-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes hero-avatar-pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

/* ----- Responsive ----- */

@media (max-width: 640px) {
  .hero-panel {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 1.5rem 1.25rem;
    text-align: center;
  }

  .hero-avatar-block {
    flex-direction: row;
    justify-content: center;
  }

  .hero-avatar {
    width: 72px;
    height: 72px;
  }

  .hero-avatar__icon {
    font-size: 2.25rem;
  }

  .hero-title {
    font-size: 1.6rem;
  }

  .hero-chips {
    justify-content: center;
  }

  .hero-cta {
    justify-content: center;
  }
}
</style>
