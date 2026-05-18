<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import XPBar from '@/components/game/XPBar.vue'
import StreakBadge from '@/components/game/StreakBadge.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
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

const srs = useSRSStore()
const dueCount = computed(() =>
  currentCourseId.value ? srs.dueCount(currentCourseId.value) : 0,
)

const showResetModal = ref(false)

function openResetModal(): void {
  showResetModal.value = true
}

function confirmReset(): void {
  useXPStore().reset()
  useStreakStore().reset()
  useLevelUpStore().reset()
  useCourseProgressStore().reset()
  useSRSStore().reset()
  // Hard navigate to the hub so any in-memory state held by views is
  // re-initialised from the now-empty stores.
  window.location.href = '/'
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
          <span v-if="dueCount > 0" class="app-header__nav-badge">
            {{ dueCount }}
          </span>
        </RouterLink>
      </nav>

      <div class="app-header__stats">
        <StreakBadge />
        <XPBar compact />
      </div>

      <button
        type="button"
        class="app-header__reset"
        title="Resetar todo o progresso"
        aria-label="Resetar progresso"
        @click="openResetModal"
      >
        🗑️
      </button>
    </div>

    <ConfirmModal
      v-model:open="showResetModal"
      title="Resetar progresso?"
      message="Isso vai apagar XP, streak, lições e challenges completados, e flashcards. Esta ação não pode ser desfeita."
      confirm-text="Resetar tudo"
      cancel-text="Cancelar"
      danger
      @confirm="confirmReset"
    />
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
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

.app-header__nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: #0f0f1a;
  background: var(--xp-gold);
  border-radius: 999px;
  line-height: 1;
}

.app-header__stats {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-header__reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.15s ease, background 0.15s ease;
}

.app-header__reset:hover {
  opacity: 1;
  background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 640px) {
  .app-header__brand-name {
    display: none;
  }
}
</style>
