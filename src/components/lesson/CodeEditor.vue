<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Compartment, EditorState } from '@codemirror/state'
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
// Compartments let us swap individual extensions at runtime — required so the
// editor reacts to `readonly` toggling (e.g. user clicks "Ver solução" then
// goes back to editing).
const readOnlyCompartment = new Compartment()

onMounted(() => {
  if (!editorEl.value) return
  const lang = props.language === 'html' ? html() : javascript()

  view = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        lang,
        EditorView.lineWrapping,
        readOnlyCompartment.of(EditorState.readOnly.of(props.readonly)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            emit('update:modelValue', update.state.doc.toString())
          }
        }),
      ],
    }),
    parent: editorEl.value,
  })
})

onBeforeUnmount(() => {
  view?.destroy()
  view = null
})

watch(
  () => props.readonly,
  (val) => {
    view?.dispatch({
      effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(val)),
    })
  },
)

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
}

/* Use CodeMirror's default (light) theme — explicit white bg ensures
   consistency across browsers regardless of system color scheme. */
.code-editor :deep(.cm-editor) {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  background: #ffffff;
  color: #1f2328;
}

.code-editor :deep(.cm-gutters) {
  background: #f6f8fa;
  color: #6e7781;
  border-right: 1px solid #d0d7de;
}

.code-editor :deep(.cm-activeLine) {
  background: rgba(208, 215, 222, 0.18);
}

.code-editor :deep(.cm-activeLineGutter) {
  background: rgba(208, 215, 222, 0.3);
}

.code-editor :deep(.cm-cursor) {
  border-left-color: #1f2328;
}

.code-editor :deep(.cm-selectionBackground),
.code-editor :deep(.cm-focused .cm-selectionBackground) {
  background: #b6d7ff !important;
}

.code-editor--readonly {
  cursor: default;
  user-select: text;
}
</style>
