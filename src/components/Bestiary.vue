<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getEcos } from '../services/ecoService';
import type { Eco } from '../types';
import EnemyCard from './EnemyCard.vue';

const props = defineProps<{
  isAdmin: boolean;
  unlockedEcos: string[];
}>();

const ecos = ref<Eco[]>([]);
const loading = ref(true);

onMounted(() => {
  getEcos((data) => {
    ecos.value = data;
    loading.value = false;
  });
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Texture & Overlay -->
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('/bg_texture.png')] bg-repeat"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Header Section -->
      <header class="text-center mb-24 space-y-8 relative">
        <h2 class="text-amber-500 uppercase tracking-[0.6em] text-[10px] font-bold">Bestiario de Aethelgard</h2>
        <h1 class="text-6xl md:text-9xl font-serif font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-50 to-slate-600">
          El Códice Arcano
        </h1>
        <p class="max-w-4xl mx-auto text-slate-400 italic text-xl md:text-2xl leading-relaxed">
          "Las páginas del Códice se esparcieron en forma de Ecos. Solo recuperándolos podremos entender lo que la Fractura le hizo a nuestro mundo."
        </p>
      </header>

      <!-- Stats Display -->
      <div class="flex flex-col items-center mb-20 space-y-4">
        <div class="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Sincronización del Códice</div>
        <div class="w-80 h-1.5 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800 relative">
          <div 
            class="h-full bg-gradient-to-r from-amber-900 to-amber-400 transition-all duration-1000"
            :style="{ width: (ecos.filter(e => isAdmin || props.unlockedEcos.includes(e.id || '')).length / (ecos.length || 1) * 100) + '%' }"
          ></div>
        </div>
        <div class="text-[10px] font-serif text-amber-500/60 tracking-widest uppercase">
          {{ ecos.filter(e => isAdmin || props.unlockedEcos.includes(e.id || '')).length }} / {{ ecos.length }} Ecos Restaurados
        </div>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="text-center py-32 text-amber-500 animate-pulse uppercase tracking-[0.5em] text-[10px]">Consultando el Códice Arcano...</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <EnemyCard 
          v-for="eco in ecos" 
          :key="eco.id" 
          :eco="{ ...eco, unlocked: isAdmin || props.unlockedEcos.includes(eco.id || '') }" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-serif { font-family: 'Cinzel', serif; }
</style>
