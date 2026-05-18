<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
// Placeholder — F7 (Lesson view) substitui com teoria + challenges.
</script>

<template>
  <div class="page">
    <div class="container">
      <h1>LessonView</h1>
      <p class="text-muted">Placeholder · F7 substitui.</p>
      <pre>courseId: {{ route.params.courseId }}</pre>
      <pre>lessonId: {{ route.params.lessonId }}</pre>
      <pre>fullPath: {{ route.fullPath }}</pre>
    </div>
  </div>
</template>
