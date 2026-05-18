export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000, 7000, 9500, 12500,
  16000, 20000,
] as const

export const LEVEL_TITLES = [
  'Iniciante',
  'Explorador',
  'Aprendiz',
  'Praticante',
  'Desenvolvedor',
  'Code Padawan',
  'Construtor',
  'Reativo',
  'Compositor',
  'Arquiteto',
  'Code Knight',
  'Mestre da Refatoração',
  'Sensei do Type',
  'Guardião do Estado',
  'Code Master',
] as const

export function getLevelFromXP(xp: number): number {
  let level = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = LEVEL_THRESHOLDS[i]
    if (threshold !== undefined && xp >= threshold) {
      level = i + 1
      break
    }
  }
  return Math.min(level, LEVEL_THRESHOLDS.length)
}

export function getLevelTitle(level: number): string {
  const idx = Math.max(0, Math.min(level - 1, LEVEL_TITLES.length - 1))
  return LEVEL_TITLES[idx] ?? 'Iniciante'
}

export function getXPForNextLevel(xp: number): number | null {
  const level = getLevelFromXP(xp)
  const nextThreshold = LEVEL_THRESHOLDS[level]
  if (nextThreshold === undefined) return null
  return nextThreshold - xp
}

export function getLevelProgress(xp: number): number {
  const level = getLevelFromXP(xp)
  const current = LEVEL_THRESHOLDS[level - 1]
  const next = LEVEL_THRESHOLDS[level]
  if (current === undefined) return 0
  if (next === undefined) return 100
  return Math.round(((xp - current) / (next - current)) * 100)
}
