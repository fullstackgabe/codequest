<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSRSStore } from '@/stores/srs'
import { useCourse } from '@/composables/useCourse'
import { useReviewSession } from '@/composables/useReviewSession'
import FlashCard from '@/components/srs/FlashCard.vue'
import type { SRSQuality } from '@/types/srsCard'

const route = useRoute()
const courseId = toRef(() => String(route.params.courseId ?? ''))
const { course, notFound } = useCourse(courseId)
const srs = useSRSStore()

const session = useReviewSession(courseId.value)

const due = computed(() => srs.dueCount(courseId.value))

interface RateToast {
  // Unique id forces Vue to remount the toast element so the animation replays
  // even when the same tone fires twice in a row.
  id: number
  text: string
  tone: 'perfect' | 'good' | 'ok' | 'fail'
}

const toast = ref<RateToast | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null
let toastSeq = 0

function showToast(quality: SRSQuality): void {
  const next: RateToast =
    quality === 5
      ? { id: ++toastSeq, text: '+15 XP · Perfeito!', tone: 'perfect' }
      : quality === 4
        ? { id: ++toastSeq, text: '+10 XP · Boa!', tone: 'good' }
        : quality === 3
          ? { id: ++toastSeq, text: '+5 XP · Acertou', tone: 'ok' }
          : { id: ++toastSeq, text: 'Vai voltar a aparecer', tone: 'fail' }

  toast.value = next
  if (toastTimer !== null) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 1400)
}

function onRated(payload: { cardId: string; quality: SRSQuality }): void {
  session.rate(payload.quality)
  showToast(payload.quality)
}
</script>

<template>
  <div class="page">
    <div class="container">
      <div v-if="notFound" class="not-found">
        <h1>Curso não encontrado</h1>
        <RouterLink to="/" class="btn btn-secondary">← Voltar pro hub</RouterLink>
      </div>

      <template v-else-if="course">
        <header class="review-header">
          <RouterLink :to="`/course/${courseId}`" class="review-header__back">
            ← {{ course.title }}
          </RouterLink>
          <h1>🔁 Revisão</h1>
          <p class="text-muted">
            <template v-if="due > 0">
              {{ due }} cards aguardam revisão neste curso.
            </template>
            <template v-else>
              Nenhum card pra revisar agora — volte mais tarde.
            </template>
          </p>
        </header>

        <section v-if="session.progress.value.total === 0" class="empty-state">
          <p>Você está em dia. 🎉</p>
          <p class="text-muted">
            Complete mais lições para registrar novos flashcards.
          </p>
          <RouterLink :to="`/course/${courseId}`" class="btn btn-primary">
            Voltar ao curso
          </RouterLink>
        </section>

        <section v-else-if="session.isFinished.value" class="review-summary">
          <h2>Sessão concluída 🎉</h2>
          <div class="review-summary__stats">
            <span class="badge badge-green"
              >✅ {{ session.sessionStats.value.perfect }} perfeitos</span
            >
            <span class="badge badge-gold"
              >👍 {{ session.sessionStats.value.good }} hesitações</span
            >
            <span class="badge badge-blue"
              >👌 {{ session.sessionStats.value.ok }} difíceis</span
            >
            <span class="badge"
              :style="{ background: 'rgba(239,68,68,0.12)', color: 'var(--danger)' }"
              >❌ {{ session.sessionStats.value.fail }} falhas</span
            >
          </div>
          <div class="review-summary__actions">
            <RouterLink
              :to="`/course/${courseId}`"
              class="btn btn-primary"
            >
              Voltar ao curso
            </RouterLink>
          </div>
        </section>

        <section v-else-if="session.currentCard.value" class="review-card">
          <div class="review-card__progress">
            Card {{ session.progress.value.index + 1 }} de
            {{ session.progress.value.total }}
          </div>
          <FlashCard :card="session.currentCard.value" @rated="onRated" />
        </section>
      </template>
    </div>

    <Transition name="rate-toast">
      <div
        v-if="toast"
        :key="toast.id"
        class="rate-toast"
        :class="`rate-toast--${toast.tone}`"
        role="status"
      >
        {{ toast.text }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.review-header {
  margin-bottom: 1.5rem;
}

.review-header__back {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.review-header h1 {
  margin: 0.5rem 0 0.25rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.empty-state p {
  margin: 0;
}

.review-card__progress {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-bottom: 0.5rem;
}

.review-summary {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  padding: 2rem 0;
}

.review-summary h2 {
  margin: 0;
}

.review-summary__stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.review-summary__actions {
  display: flex;
  gap: 0.5rem;
}

.not-found {
  text-align: center;
  padding: 2rem 0;
}

.rate-toast {
  position: fixed;
  left: 50%;
  bottom: 2.5rem;
  transform: translateX(-50%);
  padding: 0.65rem 1.1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 1100;
  pointer-events: none;
  box-shadow: var(--shadow);
}

.rate-toast--perfect {
  background: rgba(16, 185, 129, 0.95);
  color: #0f0f1a;
}
.rate-toast--good {
  background: rgba(251, 191, 36, 0.95);
  color: #0f0f1a;
}
.rate-toast--ok {
  background: rgba(56, 189, 248, 0.95);
  color: #0f0f1a;
}
.rate-toast--fail {
  background: rgba(239, 68, 68, 0.95);
  color: #fff;
}

.rate-toast-enter-active,
.rate-toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.rate-toast-enter-from {
  opacity: 0;
  transform: translate(-50%, 18px);
}
.rate-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
