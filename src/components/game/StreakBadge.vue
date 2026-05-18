<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStreakStore } from '@/stores/streak'

const { streakDays } = storeToRefs(useStreakStore())
</script>

<template>
  <span v-if="streakDays > 0" class="badge badge-orange">
    🔥 {{ streakDays }} {{ streakDays === 1 ? 'dia' : 'dias' }}
  </span>
</template>
