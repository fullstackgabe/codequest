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
      message: '✅ Correto! Bom trabalho.',
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
      message:
        props.challenge.explanation ??
        '❌ Ainda não está certo. Compare com a teoria e tente novamente.',
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

    <div
      v-if="feedback"
      class="challenge__feedback"
      :class="feedback.ok ? 'is-ok' : 'is-error'"
    >
      {{ feedback.message }}
    </div>

    <div class="challenge__actions">
      <button
        v-if="!complete"
        type="button"
        class="btn btn-primary"
        :disabled="showingSolution"
        @click="verify"
      >
        Verificar
      </button>
      <button
        v-if="!complete"
        type="button"
        class="btn btn-secondary"
        @click="toggleSolution"
      >
        {{ showingSolution ? 'Esconder solução' : 'Ver solução' }}
      </button>
      <button
        v-if="!complete"
        type="button"
        class="btn btn-ghost btn-sm"
        @click="reset"
      >
        Reset
      </button>
      <button
        v-if="complete && nextLabel"
        type="button"
        class="btn btn-primary"
        @click="emit('next')"
      >
        {{ nextLabel }}
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

.challenge__feedback {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.challenge__feedback.is-ok {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: var(--success);
}

.challenge__feedback.is-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: var(--danger);
}

.challenge__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
