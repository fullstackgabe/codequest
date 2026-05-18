<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'

const props = withDefaults(
  defineProps<{
    modelValue: string
    language?: 'html' | 'js'
    readonly?: boolean
  }>(),
  { language: 'js', readonly: false },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorEl = ref<HTMLDivElement | null>(null)
let view: EditorView | null = null

onMounted(() => {
  if (!editorEl.value) return
  const lang = props.language === 'html' ? html() : javascript()

  const extensions = [basicSetup, lang, EditorView.lineWrapping]

  if (props.readonly) {
    extensions.push(EditorState.readOnly.of(true))
  } else {
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString())
        }
      }),
    )
  }

  view = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions,
    }),
    parent: editorEl.value,
  })
})

onBeforeUnmount(() => {
  view?.destroy()
  view = null
})

watch(
  () => props.modelValue,
  (val) => {
    if (!view) return
    const current = view.state.doc.toString()
    if (val !== current) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: val },
      })
    }
  },
)
</script>

<template>
  <div
    ref="editorEl"
    class="code-editor"
    :class="{ 'code-editor--readonly': readonly }"
  />
</template>

<style scoped>
.code-editor {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #0d1117;
}

.code-editor :deep(.cm-editor) {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.code-editor--readonly {
  cursor: default;
  user-select: text;
}
</style>
