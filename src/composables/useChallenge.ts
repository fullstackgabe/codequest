import type { Challenge, FillBlankChallenge } from '@/types/challenge'

// Trade-off: also tightens spaces inside short strings around these operators,
// acceptable for v1 challenge content (short, simple strings).
const OPERATOR_PATTERN = /\s*([=,(){}\[\];])\s*/g

export function normalizeCode(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // /* ... */
    .replace(/<!--[\s\S]*?-->/g, '') // <!-- ... -->
    .replace(/\/\/[^\n]*/g, '') // // ...
    .replace(OPERATOR_PATTERN, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function fillTemplate(challenge: FillBlankChallenge): string {
  let result = challenge.template
  for (const blank of challenge.blanks) {
    result = result.replace('___', blank)
  }
  return result
}

export function checkAnswer(userCode: string, challenge: Challenge): boolean {
  if (!userCode.trim()) return false

  if (challenge.type === 'fill-blank') {
    const expected = fillTemplate(challenge)
    return normalizeCode(userCode) === normalizeCode(expected)
  }

  return normalizeCode(userCode) === normalizeCode(challenge.solution)
}
