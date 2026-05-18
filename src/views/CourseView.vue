<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
// Placeholder — F6 (Course detail) substitui com lista de módulos do curso.
</script>

<template>
  <div class="page">
    <div class="container">
      <h1>CourseView</h1>
      <p class="text-muted">Placeholder · F6 substitui.</p>
      <pre>courseId: {{ route.params.courseId }}</pre>
      <pre>fullPath: {{ route.fullPath }}</pre>
    </div>
  </div>
</template>
