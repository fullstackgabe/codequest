<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useXPStore } from '@/stores/xp'

const { level, levelTitle } = storeToRefs(useXPStore())
</script>

<template>
  <span class="badge badge-green">Lv {{ level }} · {{ levelTitle }}</span>
</template>
