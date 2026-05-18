<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useLesson } from '@/composables/useLesson'
import { useCourseProgressStore } from '@/stores/courseProgress'
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
})

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

function selectChallenge(idx: number): void {
  activeChallengeIndex.value = idx
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

const isEndOfModule = computed(
  () => !hasNextChallenge.value && nextLessonInModule.value === null,
)

const nextLabel = computed<string | null>(() => {
  if (hasNextChallenge.value) return 'Próximo challenge →'
  if (nextLessonInModule.value) return 'Próxima lição →'
  if (isEndOfModule.value) return '← Voltar aos módulos'
  return null
})

function goNext(): void {
  if (hasNextChallenge.value) {
    activeChallengeIndex.value += 1
    return
  }
  const next = nextLessonInModule.value
  if (next) {
    router.push(`/course/${courseId.value}/lesson/${next.id}`)
    return
  }
  // End of module — back to the modules list (CourseView).
  router.push(`/course/${courseId.value}`)
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
            <TheoryBlock :block="currentTheoryBlock" />

            <div class="lesson-theory__nav">
              <span class="lesson-theory__index">
                {{ theoryIndex + 1 }} / {{ theory.length }}
              </span>
              <button
                type="button"
                class="btn btn-ghost btn-sm"
                :disabled="theoryIndex === 0"
                @click="prevTheory"
              >
                ← Anterior
              </button>
              <button
                v-if="!isLastTheory"
                type="button"
                class="btn btn-secondary btn-sm"
                @click="nextTheory"
              >
                Próximo →
              </button>
              <button
                v-else
                type="button"
                class="btn btn-primary btn-sm"
                @click="completeTheory"
              >
                {{ theoryComplete ? 'Continuar' : 'Concluir teoria' }}
              </button>
            </div>
          </template>
        </section>

        <section v-else-if="activeTab === 'challenges'" class="lesson-challenges">
          <div v-if="challenges.length === 0" class="empty-state">
            Não há desafios nesta lição.
          </div>
          <template v-else-if="activeChallenge">
            <div class="lesson-challenges__nav">
              <button
                v-for="(ch, idx) in challenges"
                :key="ch.id"
                type="button"
                class="lesson-challenges__chip"
                :class="{
                  'lesson-challenges__chip--active': idx === activeChallengeIndex,
                  'lesson-challenges__chip--complete': isChallengeComplete(ch.id),
                }"
                @click="selectChallenge(idx)"
              >
                {{ idx + 1 }}
                <span v-if="isChallengeComplete(ch.id)">✓</span>
              </button>
            </div>
            <ChallengeRunner
              :challenge="activeChallenge"
              :complete="isChallengeComplete(activeChallenge.id)"
              :next-label="nextLabel ?? undefined"
              @complete="onChallengeComplete"
              @next="goNext"
            />
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

.lesson-theory__nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.lesson-theory__index {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-dim);
  margin-right: auto;
}

.lesson-challenges__nav {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.lesson-challenges__chip {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font: inherit;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.lesson-challenges__chip:hover {
  border-color: var(--primary);
  color: var(--text);
}

.lesson-challenges__chip--active {
  border-color: var(--primary);
  color: var(--primary);
}

.lesson-challenges__chip--complete {
  border-color: var(--success);
  color: var(--success);
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
