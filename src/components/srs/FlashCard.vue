<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Flashcard } from '@/types/flashcard'
import type { SRSQuality } from '@/types/srsCard'
import CodeEditor from '@/components/lesson/CodeEditor.vue'

const props = defineProps<{ card: Flashcard }>()
const emit = defineEmits<{
  (e: 'rated', payload: { cardId: string; quality: SRSQuality }): void
}>()

const revealed = ref(false)

watch(
  () => props.card.id,
  () => {
    revealed.value = false
  },
)

const codeLanguage = computed<'html' | 'js'>(() => {
  const code = props.card.code ?? ''
  return /<template[\s>]|<script[\s>]/.test(code) ? 'html' : 'js'
})

interface RatingOption {
  quality: SRSQuality
  label: string
  tone: 'fail' | 'ok' | 'good' | 'perfect'
}

const ratings: RatingOption[] = [
  { quality: 0, label: 'Esqueci', tone: 'fail' },
  { quality: 1, label: 'Errei', tone: 'fail' },
  { quality: 2, label: 'Errei (fácil)', tone: 'fail' },
  { quality: 3, label: 'Difícil', tone: 'ok' },
  { quality: 4, label: 'Hesitação', tone: 'good' },
  { quality: 5, label: 'Perfeito', tone: 'perfect' },
]

function rate(quality: SRSQuality): void {
  emit('rated', { cardId: props.card.id, quality })
}

function reveal(): void {
  revealed.value = true
}
</script>

<template>
  <article class="flashcard">
    <div v-if="card.lessonTitle" class="flashcard__meta">
      {{ card.lessonTitle }}
    </div>

    <div class="flashcard__face flashcard__face--front">
      <p>{{ card.front }}</p>
    </div>

    <div v-if="revealed" class="flashcard__face flashcard__face--back">
      <p>{{ card.back }}</p>
      <CodeEditor
        v-if="card.code"
        :model-value="card.code"
        :language="codeLanguage"
        readonly
      />
    </div>

    <div class="flashcard__actions">
      <button
        v-if="!revealed"
        type="button"
        class="btn btn-primary"
        @click="reveal"
      >
        Mostrar resposta
      </button>
      <div v-else class="flashcard__ratings">
        <button
          v-for="r in ratings"
          :key="r.quality"
          type="button"
          class="flashcard__rating"
          :class="`flashcard__rating--${r.tone}`"
          @click="rate(r.quality)"
        >
          <span class="flashcard__rating-q">{{ r.quality }}</span>
          <span class="flashcard__rating-label">{{ r.label }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.flashcard {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flashcard__meta {
  color: var(--text-dim);
  font-size: 0.8rem;
  font-family: var(--font-mono);
}

.flashcard__face p {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.5;
  white-space: pre-line;
}

.flashcard__face--back {
  border-top: 1px dashed var(--border);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.flashcard__ratings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.5rem;
}

.flashcard__rating {
  background: var(--bg-card-2);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 0.6rem 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  font: inherit;
  transition: border-color 0.2s, transform 0.2s;
}

.flashcard__rating:hover {
  transform: translateY(-1px);
}

.flashcard__rating--fail {
  border-color: rgba(239, 68, 68, 0.5);
}
.flashcard__rating--fail:hover {
  border-color: var(--danger);
}

.flashcard__rating--ok {
  border-color: rgba(56, 189, 248, 0.5);
}
.flashcard__rating--ok:hover {
  border-color: var(--info);
}

.flashcard__rating--good {
  border-color: rgba(251, 191, 36, 0.5);
}
.flashcard__rating--good:hover {
  border-color: var(--xp-gold);
}

.flashcard__rating--perfect {
  border-color: rgba(16, 185, 129, 0.6);
}
.flashcard__rating--perfect:hover {
  border-color: var(--success);
}

.flashcard__rating-q {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 1.1rem;
}

.flashcard__rating-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
