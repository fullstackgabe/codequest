<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useLesson } from '@/composables/useLesson'
import { useCourseProgressStore } from '@/stores/courseProgress'
import { useSRSStore } from '@/stores/srs'
import { useAwardActivity } from '@/composables/useAwardActivity'
import TheoryBlock from '@/components/lesson/TheoryBlock.vue'
import ChallengeRunner from '@/components/lesson/ChallengeRunner.vue'

const route = useRoute()
const router = useRouter()
const courseId = toRef(() => String(route.params.courseId ?? ''))
const lessonId = toRef(() => String(route.params.lessonId ?? ''))

const { lesson, module, course, notFound } = useLesson(lessonId)
const progress = useCourseProgressStore()
const award = useAwardActivity()

type Tab = 'theory' | 'challenges'
const activeTab = ref<Tab>('theory')

const theoryIndex = ref(0)

watch(lessonId, () => {
  activeTab.value = 'theory'
  theoryIndex.value = 0
  activeChallengeIndex.value = firstIncompleteChallengeIndex()
})

// Find where the user should resume in this lesson's challenges.
// First unfinished one; if all are done, point at the last (so the celebration shows).
function firstIncompleteChallengeIndex(): number {
  const list = challenges.value
  for (let i = 0; i < list.length; i++) {
    const c = list[i]
    if (c && !progress.isChallengeComplete(courseId.value, c.id)) return i
  }
  return Math.max(0, list.length - 1)
}

const theory = computed(() => lesson.value?.theory ?? [])
const challenges = computed(() => lesson.value?.challenges ?? [])

const theoryComplete = computed(() =>
  lesson.value
    ? progress.isLessonComplete(courseId.value, lesson.value.id)
    : false,
)

const currentTheoryBlock = computed(() => theory.value[theoryIndex.value] ?? null)

const isLastTheory = computed(
  () => theoryIndex.value === Math.max(0, theory.value.length - 1),
)

function nextTheory(): void {
  if (theoryIndex.value < theory.value.length - 1) theoryIndex.value += 1
}

function prevTheory(): void {
  if (theoryIndex.value > 0) theoryIndex.value -= 1
}

function goToTheory(idx: number): void {
  if (idx >= 0 && idx < theory.value.length) theoryIndex.value = idx
}

function handleTheoryKey(event: KeyboardEvent): void {
  if (activeTab.value !== 'theory') return
  const target = event.target as HTMLElement | null
  // Don't hijack arrows when the user is typing in an editor or input.
  if (target?.closest('input, textarea, [contenteditable="true"], .cm-editor'))
    return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextTheory()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prevTheory()
  }
}

onMounted(() => window.addEventListener('keydown', handleTheoryKey))
onBeforeUnmount(() => window.removeEventListener('keydown', handleTheoryKey))

function completeTheory(): void {
  if (!lesson.value) return
  award.completeLesson(courseId.value, lesson.value.id)
  activeTab.value = 'challenges'
}

const activeChallengeIndex = ref(0)
const activeChallenge = computed(
  () => challenges.value[activeChallengeIndex.value] ?? null,
)

function isChallengeComplete(id: string): boolean {
  return progress.isChallengeComplete(courseId.value, id)
}

function onChallengeComplete(payload: {
  challengeId: string
  firstTry: boolean
}): void {
  award.completeChallenge(courseId.value, payload.challengeId, payload.firstTry)
}

const hasNextChallenge = computed(
  () => activeChallengeIndex.value < challenges.value.length - 1,
)

const nextLessonInModule = computed(() => {
  const mod = module.value
  const cur = lesson.value
  if (!mod || !cur) return null
  const idx = mod.lessons.findIndex((l) => l.id === cur.id)
  if (idx < 0 || idx >= mod.lessons.length - 1) return null
  return mod.lessons[idx + 1] ?? null
})

// Inside the lesson, only "Próximo challenge →" advances. End-of-lesson navigation
// (review, next lesson, back to modules) lives in the completion panel below.
const nextLabel = computed<string | null>(() =>
  hasNextChallenge.value ? 'Próximo challenge →' : null,
)

function goNext(): void {
  if (hasNextChallenge.value) {
    activeChallengeIndex.value += 1
  }
}

// Lesson is "done" once every challenge has been completed.
const allChallengesComplete = computed(() => {
  const list = challenges.value
  if (list.length === 0) return false
  return list.every((c) => progress.isChallengeComplete(courseId.value, c.id))
})

const srs = useSRSStore()
const dueCount = computed(() => srs.dueCount(courseId.value))

function goToReview(): void {
  router.push(`/course/${courseId.value}/review`)
}

function goToNextLesson(): void {
  const next = nextLessonInModule.value
  if (next) {
    router.push(`/course/${courseId.value}/lesson/${next.id}`)
  } else {
    router.push(`/course/${courseId.value}`)
  }
}

function switchTab(tab: Tab): void {
  if (tab === 'challenges' && !theoryComplete.value && theory.value.length > 0) {
    return
  }
  activeTab.value = tab
}
</script>

<template>
  <div class="page">
    <div class="container">
      <div v-if="notFound" class="not-found">
        <h1>Lição não encontrada</h1>
        <p class="text-muted">Não foi possível encontrar essa lição.</p>
        <RouterLink :to="`/course/${courseId}`" class="btn btn-secondary">
          ← Voltar pro curso
        </RouterLink>
      </div>

      <template v-else-if="lesson && module && course">
        <header class="lesson-header">
          <RouterLink
            :to="`/course/${courseId}/module/${module.id}`"
            class="lesson-header__back"
          >
            ← {{ module.title }}
          </RouterLink>
          <div class="lesson-header__title">
            <span class="lesson-header__icon">{{ lesson.icon }}</span>
            <h1>{{ lesson.title }}</h1>
            <span class="badge badge-gold">+{{ lesson.xpReward }} XP</span>
          </div>
        </header>

        <nav class="tabs" role="tablist">
          <button
            type="button"
            class="tabs__btn"
            :class="{ 'tabs__btn--active': activeTab === 'theory' }"
            role="tab"
            :aria-selected="activeTab === 'theory'"
            @click="switchTab('theory')"
          >
            📖 Teoria
          </button>
          <button
            type="button"
            class="tabs__btn"
            :class="{
              'tabs__btn--active': activeTab === 'challenges',
              'tabs__btn--locked': !theoryComplete && theory.length > 0,
            }"
            role="tab"
            :aria-selected="activeTab === 'challenges'"
            :title="
              !theoryComplete && theory.length > 0
                ? 'Conclua a teoria primeiro'
                : ''
            "
            @click="switchTab('challenges')"
          >
            ⚔️ Challenges
            <span v-if="!theoryComplete && theory.length > 0">🔒</span>
          </button>
        </nav>

        <section v-if="activeTab === 'theory'" class="lesson-theory">
          <div v-if="theory.length === 0" class="empty-state">
            Esta lição não tem teoria. Pode ir direto pros challenges.
          </div>
          <template v-else-if="currentTheoryBlock">
            <div class="lesson-theory__pills" role="tablist" aria-label="Blocos de teoria">
              <button
                v-for="(block, idx) in theory"
                :key="block.tag"
                type="button"
                role="tab"
                :aria-selected="idx === theoryIndex"
                class="lesson-theory__pill"
                :class="{ 'lesson-theory__pill--active': idx === theoryIndex }"
                @click="goToTheory(idx)"
              >
                {{ block.title }}
              </button>
            </div>

            <TheoryBlock :block="currentTheoryBlock" />

            <div v-if="isLastTheory" class="lesson-theory__finish">
              <button
                type="button"
                class="btn btn-primary"
                @click="completeTheory"
              >
                {{ theoryComplete ? 'Ir para os challenges →' : 'Concluir teoria →' }}
              </button>
            </div>
          </template>
        </section>

        <section v-else-if="activeTab === 'challenges'" class="lesson-challenges">
          <div v-if="challenges.length === 0" class="empty-state">
            Não há desafios nesta lição.
          </div>
          <template v-else-if="activeChallenge">
            <div class="lesson-challenges__progress">
              Challenge {{ activeChallengeIndex + 1 }} de {{ challenges.length }}
            </div>
            <ChallengeRunner
              :challenge="activeChallenge"
              :complete="isChallengeComplete(activeChallenge.id)"
              :next-label="nextLabel ?? undefined"
              @complete="onChallengeComplete"
              @next="goNext"
            />

            <section v-if="allChallengesComplete" class="lesson-complete">
              <span class="lesson-complete__icon">🎉</span>
              <h3 class="lesson-complete__title">Lição concluída!</h3>
              <p class="lesson-complete__message">
                Você resolveu todos os challenges desta lição.
              </p>
              <div class="lesson-complete__actions">
                <button
                  v-if="dueCount > 0"
                  type="button"
                  class="btn btn-primary"
                  @click="goToReview"
                >
                  Revisar {{ dueCount }} {{ dueCount === 1 ? 'card' : 'cards' }} →
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="goToNextLesson"
                >
                  {{ nextLessonInModule ? 'Próxima lição →' : '← Voltar aos módulos' }}
                </button>
              </div>
            </section>
          </template>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.lesson-header {
  margin-bottom: 1.5rem;
}

.lesson-header__back {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
}

.lesson-header__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.lesson-header__title h1 {
  margin: 0;
}

.lesson-header__icon {
  font-size: 1.75rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.5rem;
}

.tabs__btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font: inherit;
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tabs__btn:hover:not(.tabs__btn--locked) {
  color: var(--text);
}

.tabs__btn--active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tabs__btn--locked {
  cursor: not-allowed;
  opacity: 0.6;
}

.lesson-theory__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.lesson-theory__pill {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font: inherit;
  font-size: 0.85rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}

.lesson-theory__pill:hover {
  color: var(--text);
  border-color: var(--primary);
}

.lesson-theory__pill--active {
  color: var(--primary);
  border-color: var(--primary);
  background: rgba(66, 184, 131, 0.1);
}

.lesson-theory__finish {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.lesson-challenges__progress {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-bottom: 0.75rem;
}

.lesson-complete {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--bg-card), var(--bg-card-2));
  border: 1px solid rgba(66, 184, 131, 0.4);
  border-radius: var(--radius);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: fadeIn 0.4s ease;
}

.lesson-complete__icon {
  font-size: 2.25rem;
}

.lesson-complete__title {
  margin: 0;
  color: var(--primary);
}

.lesson-complete__message {
  margin: 0;
  color: var(--text-muted);
}

.lesson-complete__actions {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
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
