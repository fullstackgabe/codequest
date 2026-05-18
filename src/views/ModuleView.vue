<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
// Placeholder — F6 substitui com lista de lições do módulo.
</script>

<template>
  <div class="page">
    <div class="container">
      <h1>ModuleView</h1>
      <p class="text-muted">Placeholder · F6 substitui.</p>
      <pre>courseId: {{ route.params.courseId }}</pre>
      <pre>moduleId: {{ route.params.moduleId }}</pre>
      <pre>fullPath: {{ route.fullPath }}</pre>
    </div>
  </div>
</template>
