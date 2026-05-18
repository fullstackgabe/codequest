<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
// Placeholder — F8 (SRS review) substitui com sessão de flashcards.
</script>

<template>
  <div class="page">
    <div class="container">
      <h1>ReviewView</h1>
      <p class="text-muted">Placeholder · F8 substitui.</p>
      <pre>courseId: {{ route.params.courseId }}</pre>
      <pre>fullPath: {{ route.fullPath }}</pre>
    </div>
  </div>
</template>
