<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import LevelUpToast from '@/components/game/LevelUpToast.vue'
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <LevelUpToast />
</template>
