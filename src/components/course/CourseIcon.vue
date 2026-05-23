<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ icon: string; color?: string }>()

const isSvg = computed(() => props.icon.trim().startsWith('<svg'))
</script>

<template>
  <span
    class="course-icon"
    :class="{ 'course-icon--svg': isSvg }"
    :style="isSvg ? { color: color ?? 'currentColor' } : {}"
  >
    <span v-if="isSvg" class="course-icon__svg" v-html="icon" />
    <template v-else>{{ icon }}</template>
  </span>
</template>

<style scoped>
.course-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.course-icon__svg {
  display: inline-flex;
  width: 1em;
  height: 1em;
}

.course-icon__svg :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  fill: currentColor;
}
</style>
