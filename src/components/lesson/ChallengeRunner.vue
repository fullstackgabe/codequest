<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Challenge } from '@/types/challenge'
import CodeEditor from './CodeEditor.vue'
import { checkAnswer } from '@/composables/useChallenge'

const props = defineProps<{
  challenge: Challenge
  complete: boolean
  nextLabel?: string
}>()

const emit = defineEmits<{
  (e: 'complete', payload: { challengeId: string; firstTry: boolean }): void
  (e: 'next'): void
}>()

function initialCode(c: Challenge): string {
  if (c.type === 'fill-blank') return c.template
  if (c.type === 'fix-bug') return c.buggyCode
  return c.template ?? ''
}

const language = computed<'html' | 'js'>(() => {
  const sample = props.challenge.solution + initialCode(props.challenge)
  return /<template[\s>]|<script[\s>]/.test(sample) ? 'html' : 'js'
})

const userCode = ref(
  props.complete ? props.challenge.solution : initialCode(props.challenge),
)
const feedback = ref<{ ok: boolean; message: string } | null>(null)
const showingSolution = ref(props.complete)
const attempts = ref(0)
const savedUserCode = ref(userCode.value)

watch(
  () => props.challenge.id,
  () => {
    userCode.value = props.complete
      ? props.challenge.solution
      : initialCode(props.challenge)
    feedback.value = null
    showingSolution.value = props.complete
    attempts.value = 0
    savedUserCode.value = userCode.value
  },
)

function verify(): void {
  const passed = checkAnswer(userCode.value, props.challenge)
  if (passed) {
    feedback.value = {
      ok: true,
      message: 'Correto!',
    }
    emit('complete', {
      challengeId: props.challenge.id,
      firstTry: attempts.value === 0,
    })
    attempts.value += 1
  } else {
    attempts.value += 1
    feedback.value = {
      ok: false,
      message: 'Ainda não está certo.',
    }
  }
}

function toggleSolution(): void {
  if (showingSolution.value) {
    showingSolution.value = false
    userCode.value = savedUserCode.value
  } else {
    savedUserCode.value = userCode.value
    showingSolution.value = true
    userCode.value = props.challenge.solution
  }
}

function onPrimaryClick(): void {
  if (props.complete) {
    emit('next')
  } else {
    verify()
  }
}

function reset(): void {
  userCode.value = initialCode(props.challenge)
  feedback.value = null
  showingSolution.value = false
  savedUserCode.value = userCode.value
}

const typeBadgeText = computed<string>(() => {
  switch (props.challenge.type) {
    case 'fill-blank':
      return 'Preencha as lacunas'
    case 'write-from-scratch':
      return 'Escreva do zero'
    case 'fix-bug':
      return 'Corrija o bug'
  }
})
</script>

<template>
  <section class="challenge">
    <header class="challenge__head">
      <span class="badge badge-purple">{{ typeBadgeText }}</span>
      <span class="badge badge-gold">+{{ challenge.xpReward }} XP</span>
      <span v-if="complete" class="badge badge-green">Concluído ✓</span>
    </header>

    <h3 class="challenge__title">{{ challenge.title }}</h3>
    <p class="challenge__description">{{ challenge.description }}</p>

    <CodeEditor
      v-model="userCode"
      :language="language"
      :readonly="complete || showingSolution"
    />

    <p
      v-if="feedback && !feedback.ok"
      class="challenge__error"
      role="alert"
    >
      <span class="challenge__error-icon" aria-hidden="true">✗</span>
      <span>{{ feedback.message }}</span>
    </p>

    <p
      v-if="complete && feedback?.ok && nextLabel"
      class="challenge__success"
      role="status"
    >
      <span class="challenge__success-icon" aria-hidden="true">✓</span>
      <span>Correto!</span>
    </p>

    <div class="challenge__actions">
      <div class="challenge__actions-main">
        <button
          v-if="!complete || nextLabel"
          type="button"
          class="btn btn-primary challenge__btn"
          :class="{ 'challenge__btn--celebrated': complete && feedback?.ok }"
          :disabled="!complete && showingSolution"
          @click="onPrimaryClick"
        >
          <template v-if="complete">Próximo</template>
          <template v-else>Verificar</template>
        </button>
        <button
          v-if="!complete"
          type="button"
          class="btn btn-secondary challenge__btn"
          @click="toggleSolution"
        >
          {{ showingSolution ? 'Esconder solução' : 'Ver solução' }}
        </button>
      </div>
      <button
        v-if="!complete"
        type="button"
        class="challenge__reset-link"
        title="Limpar e tentar de novo"
        @click="reset"
      >
        ↻ Reiniciar
      </button>
    </div>
  </section>
</template>

<style scoped>
.challenge {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.challenge__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.challenge__title {
  margin: 0.5rem 0 0;
  color: var(--text);
}

.challenge__description {
  margin: 0;
  color: var(--text-muted);
  white-space: pre-line;
}

.challenge__error,
.challenge__success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.challenge__error {
  background: rgba(239, 68, 68, 0.08);
  border-left: 3px solid var(--danger);
  color: var(--danger);
  animation: errorShake 0.4s ease;
}

.challenge__success {
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid var(--success);
  color: var(--success);
  animation: successFadeIn 0.3s ease;
}

.challenge__error-icon,
.challenge__success-icon {
  font-weight: 700;
  font-size: 1rem;
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
}

@keyframes successFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.challenge__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.challenge__actions-main {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.challenge__btn {
  min-width: 9rem;
  justify-content: center;
}

.challenge__reset-link {
  background: transparent;
  border: none;
  padding: 0.5rem 0.25rem;
  color: var(--text-dim);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.15s ease;
}

.challenge__reset-link:hover {
  color: var(--text);
}

.challenge__btn--celebrated {
  background: linear-gradient(135deg, var(--primary), var(--primary-bright));
  box-shadow:
    0 0 0 4px rgba(66, 184, 131, 0.18),
    var(--shadow-glow);
  animation: nextPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes nextPop {
  0% {
    transform: scale(0.96);
  }
  60% {
    transform: scale(1.04);
  }
  100% {
    transform: scale(1);
  }
}
</style>
