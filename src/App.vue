<script setup lang="ts">
import { ref, computed } from 'vue';
import Bestiary from './components/Bestiary.vue';
import type { PlayerStats } from './types';

const userStats = ref<PlayerStats | null>({
  uid: 'dev',
  username: 'Arcane Dev',
  level: 1,
  ecosCollected: 0,
  unlockedEcos: [],
  lastSync: new Date()
});
const authLoading = ref(false);

const isAdmin = computed(() => true);
</script>

<template>
  <div v-if="!authLoading" class="bg-slate-950 min-h-screen text-slate-200 selection:bg-amber-500/30">
    <!-- Main Content -->
    <main>
      <transition name="fade" mode="out-in">
        <Bestiary 
          :is-admin="isAdmin" 
          :unlocked-ecos="userStats?.unlockedEcos || []"
        />
      </transition>
    </main>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-slate-950 flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Custom selection color */
::selection {
  background: rgba(245, 158, 11, 0.3);
  color: white;
}
</style>
