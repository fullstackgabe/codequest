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

// Transient flag — true only right after the user solves the last challenge
// of the lesson. Drives the celebration modal so it never reappears on
// revisits (the panel only fires once per fresh completion).
const justCompleted = ref(false)

function closeCelebrationModal(): void {
  justCompleted.value = false
}

watch(lessonId, () => {
  activeTab.value = 'theory'
  theoryIndex.value = 0
  activeChallengeIndex.value = firstIncompleteChallengeIndex()
  justCompleted.value = false
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

const currentTheoryBlock = computed(() => theory.value[theoryIndex.value] ?? null)

// Strip the longest common prefix that ends at "-" from theory tags
// so labels stay short. Example: ['ref-value','ref-dot-value','ref-pitfall']
// → ['value','dot-value','pitfall']. Falls back to the raw tag if stripping
// would empty it.
const theoryPillLabels = computed<string[]>(() => {
  const tags = theory.value.map((b) => b.tag)
  if (tags.length === 0) return []

  let prefix = tags[0] ?? ''
  for (let i = 1; i < tags.length; i++) {
    const t = tags[i] ?? ''
    let j = 0
    while (j < prefix.length && j < t.length && prefix[j] === t[j]) j++
    prefix = prefix.slice(0, j)
    if (prefix.length === 0) break
  }

  const sepIndex = prefix.lastIndexOf('-')
  const stripLen = sepIndex >= 0 ? sepIndex + 1 : 0
  if (stripLen === 0) return tags

  return tags.map((t) => t.slice(stripLen) || t)
})

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
  // ESC closes the celebration modal from anywhere.
  if (event.key === 'Escape' && justCompleted.value) {
    event.preventDefault()
    closeCelebrationModal()
    return
  }
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
  if (lesson.value && allChallengesComplete.value) {
    award.completeLesson(courseId.value, lesson.value.id)
    justCompleted.value = true
  }
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

// Stays scoped to the current lesson. Navigation to the next lesson lives in
// the celebration modal — once dismissed, the user goes via the header.
const nextLabel = computed<string | null>(() =>
  hasNextChallenge.value ? 'Próximo' : null,
)

// "Anterior" only makes sense for browsing back through a fully-completed lesson.
// During first-time solving we keep the focus linear on the current challenge.
const prevLabel = computed<string | null>(() => {
  if (!allChallengesComplete.value) return null
  return activeChallengeIndex.value > 0 ? 'Anterior' : null
})

function goNext(): void {
  if (hasNextChallenge.value) {
    activeChallengeIndex.value += 1
  }
}

function goPrevChallenge(): void {
  if (activeChallengeIndex.value > 0) {
    activeChallengeIndex.value -= 1
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
  if (tab === 'challenges' && challenges.value.length === 0) {
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
            :class="{ 'tabs__btn--active': activeTab === 'challenges' }"
            role="tab"
            :aria-selected="activeTab === 'challenges'"
            @click="switchTab('challenges')"
          >
            ⚔️ Challenges
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
                {{ theoryPillLabels[idx] }}
              </button>
            </div>

            <TheoryBlock :block="currentTheoryBlock" />
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
              :prev-label="prevLabel ?? undefined"
              :next-label="nextLabel ?? undefined"
              @complete="onChallengeComplete"
              @next="goNext"
              @prev="goPrevChallenge"
            />
          </template>
        </section>
      </template>
    </div>

    <Transition name="celebration">
      <div
        v-if="justCompleted"
        class="celebration"
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
      >
        <div class="celebration__backdrop" @click="closeCelebrationModal" />
        <div class="celebration__panel">
          <button
            type="button"
            class="celebration__close"
            aria-label="Fechar"
            @click="closeCelebrationModal"
          >
            ×
          </button>
          <span class="celebration__icon" aria-hidden="true">🎉</span>
          <h2 id="celebration-title" class="celebration__title">
            Parabéns!
          </h2>
          <p class="celebration__message">
            Você resolveu todos os challenges desta lição.
          </p>
          <div class="celebration__actions">
            <button
              v-if="dueCount > 0"
              type="button"
              class="btn btn-primary"
              @click="goToReview"
            >
              Revisar
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="goToNextLesson"
            >
              {{ nextLessonInModule ? 'Próxima lição' : 'Voltar aos módulos' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

.tabs__btn:hover {
  color: var(--text);
}

.tabs__btn--active {
  color: var(--primary);
  border-bottom-color: var(--primary);
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

.lesson-challenges__progress {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-bottom: 0.75rem;
}

.celebration {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.celebration__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(3px);
}

.celebration__panel {
  position: relative;
  width: 100%;
  max-width: 440px;
  background: linear-gradient(135deg, var(--bg-card), var(--bg-card-2));
  border: 1px solid rgba(66, 184, 131, 0.4);
  border-radius: var(--radius);
  box-shadow: var(--shadow), 0 0 60px rgba(66, 184, 131, 0.15);
  padding: 2.25rem 1.75rem 1.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.celebration__close {
  position: absolute;
  top: 0.6rem;
  right: 0.7rem;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: color 0.15s ease, background 0.15s ease;
}

.celebration__close:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
}

.celebration__icon {
  font-size: 3rem;
  animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.celebration__title {
  margin: 0;
  color: var(--primary);
  font-size: 1.5rem;
}

.celebration__message {
  margin: 0;
  color: var(--text-muted);
}

.celebration__actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: center;
}

.celebration-enter-active,
.celebration-leave-active {
  transition: opacity 0.25s ease;
}
.celebration-enter-active .celebration__panel,
.celebration-leave-active .celebration__panel {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.celebration-enter-from,
.celebration-leave-to {
  opacity: 0;
}
.celebration-enter-from .celebration__panel,
.celebration-leave-to .celebration__panel {
  transform: translateY(10px) scale(0.96);
}

@keyframes pop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
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
