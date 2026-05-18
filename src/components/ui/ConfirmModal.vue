<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
  }>(),
  {
    title: 'Confirmar',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    danger: false,
  },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function close(): void {
  emit('update:open', false)
  emit('cancel')
}

function confirm(): void {
  emit('update:open', false)
  emit('confirm')
}

function onKey(event: KeyboardEvent): void {
  if (!props.open) return
  if (event.key === 'Escape') close()
  if (event.key === 'Enter') confirm()
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onKey)
    } else {
      window.removeEventListener('keydown', onKey)
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Transition name="confirm">
    <div v-if="open" class="confirm" role="dialog" aria-modal="true">
      <div class="confirm__backdrop" @click="close" />
      <div class="confirm__panel" :class="{ 'confirm__panel--danger': danger }">
        <header class="confirm__header">
          <h3 class="confirm__title">{{ title }}</h3>
        </header>
        <p class="confirm__message">{{ message }}</p>
        <footer class="confirm__actions">
          <button type="button" class="btn btn-ghost" @click="close">
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="btn"
            :class="danger ? 'btn-danger' : 'btn-primary'"
            @click="confirm"
          >
            {{ confirmText }}
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.confirm {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.confirm__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

.confirm__panel {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.confirm__panel--danger {
  border-color: rgba(239, 68, 68, 0.4);
}

.confirm__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.confirm__title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text);
}

.confirm__panel--danger .confirm__title {
  color: var(--danger);
}

.confirm__message {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.5;
}

.confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 0.18s ease;
}
.confirm-enter-active .confirm__panel,
.confirm-leave-active .confirm__panel {
  transition: transform 0.18s ease;
}
.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}
.confirm-enter-from .confirm__panel,
.confirm-leave-to .confirm__panel {
  transform: translateY(8px) scale(0.98);
}
</style>
