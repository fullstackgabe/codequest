import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loadJSON, removeKey, saveJSON } from '@/utils/storage'
import { SM2_DEFAULT_EASE, sm2 } from '@/utils/sm2'
import type { SRSCard, SRSQuality } from '@/types/srsCard'

const STORAGE_KEY = 'codequest_srs'

export type SRSCardMap = Record<string, Record<string, SRSCard>>

export interface DueCard extends SRSCard {
  cardId: string
}

function freshCard(): SRSCard {
  return {
    easeFactor: SM2_DEFAULT_EASE,
    interval: 1,
    repetitions: 0,
    nextReview: null,
  }
}

export const useSRSStore = defineStore('srs', () => {
  const cards = ref<SRSCardMap>(loadJSON<SRSCardMap>(STORAGE_KEY, {}))

  function persist(): void {
    saveJSON(STORAGE_KEY, cards.value)
  }

  function ensureBucket(courseId: string): Record<string, SRSCard> {
    let bucket = cards.value[courseId]
    if (!bucket) {
      bucket = {}
      cards.value[courseId] = bucket
    }
    return bucket
  }

  function registerCard(courseId: string, cardId: string): void {
    const bucket = ensureBucket(courseId)
    if (bucket[cardId]) return
    bucket[cardId] = freshCard()
    persist()
  }

  function review(courseId: string, cardId: string, quality: SRSQuality): SRSCard {
    const bucket = ensureBucket(courseId)
    const existing = bucket[cardId] ?? freshCard()
    const updated = sm2(existing, quality)
    bucket[cardId] = updated
    persist()
    return updated
  }

  function getCard(courseId: string, cardId: string): SRSCard | null {
    return cards.value[courseId]?.[cardId] ?? null
  }

  function dueCount(courseId: string): number {
    const bucket = cards.value[courseId]
    if (!bucket) return 0
    const now = Date.now()
    let count = 0
    for (const card of Object.values(bucket)) {
      if (card.nextReview === null || card.nextReview <= now) count++
    }
    return count
  }

  function getDueCards(courseId: string): DueCard[] {
    const bucket = cards.value[courseId]
    if (!bucket) return []
    const now = Date.now()
    const out: DueCard[] = []
    for (const [cardId, card] of Object.entries(bucket)) {
      if (card.nextReview === null || card.nextReview <= now) {
        out.push({ cardId, ...card })
      }
    }
    return out
  }

  function reset(): void {
    cards.value = {}
    removeKey(STORAGE_KEY)
  }

  return {
    cards,
    registerCard,
    review,
    getCard,
    dueCount,
    getDueCards,
    reset,
  }
})
