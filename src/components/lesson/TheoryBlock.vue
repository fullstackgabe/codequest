<script setup lang="ts">
import { computed } from 'vue'
import type { TheoryBlock } from '@/types/theory'
import CodeEditor from './CodeEditor.vue'

const props = defineProps<{ block: TheoryBlock }>()

const language = computed<'html' | 'js'>(() => {
  const code = props.block.code ?? ''
  if (/<template[\s>]|<script[\s>]/.test(code)) return 'html'
  return 'js'
})
</script>

<template>
  <article class="theory-block">
    <h3 class="theory-block__title">{{ block.title }}</h3>
    <p class="theory-block__body">{{ block.body }}</p>
    <CodeEditor
      v-if="block.code"
      :model-value="block.code"
      :language="language"
      readonly
    />
  </article>
</template>

<style scoped>
.theory-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.theory-block__title {
  margin: 0;
  color: var(--primary);
}

.theory-block__body {
  margin: 0;
  white-space: pre-line;
  line-height: 1.7;
  color: var(--text);
}
</style>
