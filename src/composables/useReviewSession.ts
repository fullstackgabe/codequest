import { computed, ref } from 'vue'
import type { ComputedRef } from 'vue'
import type { Flashcard } from '@/types/flashcard'
import type { SRSQuality } from '@/types/srsCard'
import { useSRSStore } from '@/stores/srs'
import { useXPStore } from '@/stores/xp'
import type { AddXPResult } from '@/stores/xp'
import { getAllFlashcards } from '@/data/courses'
import { XP_REWARDS } from '@/utils/xpRewards'

export const SESSION_LIMIT = 5

export interface SessionStats {
  perfect: number
  good: number
  ok: number
  fail: number
}

export interface SessionProgress {
  index: number
  total: number
}

export interface RateResult {
  xpResult: AddXPResult
}

export interface UseReviewSessionReturn {
  currentCard: ComputedRef<Flashcard | null>
  sessionStats: ComputedRef<SessionStats>
  progress: ComputedRef<SessionProgress>
  isFinished: ComputedRef<boolean>
  rate: (quality: SRSQuality) => RateResult
  restart: () => void
}

function qualityToXP(q: SRSQuality): number {
  if (q === 5) return XP_REWARDS.REVIEW_PERFECT
  if (q === 4) return XP_REWARDS.REVIEW_GOOD
  if (q === 3) return XP_REWARDS.REVIEW_OK
  return 0
}

export function useReviewSession(courseId: string): UseReviewSessionReturn {
  const srs = useSRSStore()
  const xp = useXPStore()

  const cards = ref<Flashcard[]>([])
  const index = ref(0)
  const stats = ref<SessionStats>({ perfect: 0, good: 0, ok: 0, fail: 0 })

  function buildSnapshot(): void {
    const dueIds = new Set(srs.getDueCards(courseId).map((c) => c.cardId))
    const augmentedAll = getAllFlashcards()
    const due: Flashcard[] = []
    for (const card of augmentedAll) {
      if (card.courseId === courseId && dueIds.has(card.id)) {
        due.push(card)
        if (due.length === SESSION_LIMIT) break
      }
    }
    cards.value = due
    index.value = 0
    stats.value = { perfect: 0, good: 0, ok: 0, fail: 0 }
  }

  buildSnapshot()

  const currentCard = computed<Flashcard | null>(
    () => cards.value[index.value] ?? null,
  )

  const sessionStats = computed(() => stats.value)
  const progress = computed<SessionProgress>(() => ({
    index: index.value,
    total: cards.value.length,
  }))
  const isFinished = computed(
    () => cards.value.length > 0 && index.value >= cards.value.length,
  )

  function rate(quality: SRSQuality): RateResult {
    const card = currentCard.value
    if (!card) return { xpResult: { levelUp: false } }

    srs.review(courseId, card.id, quality)

    if (quality === 5) stats.value.perfect += 1
    else if (quality === 4) stats.value.good += 1
    else if (quality === 3) stats.value.ok += 1
    else stats.value.fail += 1

    const amount = qualityToXP(quality)
    const xpResult = amount > 0 ? xp.addXP(amount) : { levelUp: false as const }

    index.value += 1
    return { xpResult }
  }

  function restart(): void {
    buildSnapshot()
  }

  return {
    currentCard,
    sessionStats,
    progress,
    isFinished,
    rate,
    restart,
  }
}
