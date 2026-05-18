import type { SRSCard, SRSQuality } from '@/types/srsCard'

export const SM2_DEFAULT_EASE = 2.5
export const SM2_MIN_EASE = 1.3
const DAY_MS = 24 * 60 * 60 * 1000

export function sm2(card: SRSCard, q: SRSQuality): SRSCard {
  let { easeFactor, interval, repetitions } = card

  if (q < 3) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  }

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  if (easeFactor < SM2_MIN_EASE) easeFactor = SM2_MIN_EASE

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview: Date.now() + interval * DAY_MS,
  }
}
