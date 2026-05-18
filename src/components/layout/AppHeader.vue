<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import XPBar from '@/components/game/XPBar.vue'
import StreakBadge from '@/components/game/StreakBadge.vue'
import { useXPStore } from '@/stores/xp'
import { useStreakStore } from '@/stores/streak'
import { useLevelUpStore } from '@/stores/levelUp'
import { useCourseProgressStore } from '@/stores/courseProgress'
import { useSRSStore } from '@/stores/srs'

const route = useRoute()

const currentCourseId = computed(() => {
  const id = route.params.courseId
  return typeof id === 'string' && id.length > 0 ? id : null
})

const reviewPath = computed(() =>
  currentCourseId.value ? `/course/${currentCourseId.value}/review` : null,
)

function handleReset(): void {
  if (
    !window.confirm(
      'Resetar todo o progresso (XP, streak, lições, challenges e flashcards)? Esta ação não pode ser desfeita.',
    )
  ) {
    return
  }
  useXPStore().reset()
  useStreakStore().reset()
  useLevelUpStore().reset()
  useCourseProgressStore().reset()
  useSRSStore().reset()
  window.location.reload()
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner container">
      <RouterLink to="/" class="app-header__brand">
        <span class="app-header__brand-icon">⚡</span>
        <span class="app-header__brand-name">Code Quest</span>
      </RouterLink>

      <nav class="app-header__nav">
        <RouterLink
          v-if="reviewPath"
          :to="reviewPath"
          class="app-header__nav-link"
        >
          Revisão
        </RouterLink>
      </nav>

      <div class="app-header__stats">
        <StreakBadge />
        <XPBar compact />
      </div>

      <button
        type="button"
        class="btn btn-ghost btn-sm"
        title="Resetar progresso"
        @click="handleReset"
      >
        ↺
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 0;
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  color: var(--text);
  font-weight: 700;
  font-size: 1.1rem;
}

.app-header__brand-icon {
  color: var(--primary);
}

.app-header__nav {
  display: flex;
  gap: 0.75rem;
}

.app-header__nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  transition: color 0.2s, background 0.2s;
}

.app-header__nav-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.05);
}

.app-header__nav-link.router-link-active {
  color: var(--primary);
}

.app-header__stats {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .app-header__brand-name {
    display: none;
  }
}
</style>
