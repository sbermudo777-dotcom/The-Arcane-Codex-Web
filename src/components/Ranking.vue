<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRanking, getCachedRanking } from '../services/rankingService';
import type { PlayerStats } from '../types';

const rankings = ref<PlayerStats[]>([]);
const loading = ref(true);

onMounted(() => {
  // Load from cache first for instant UI
  rankings.value = getCachedRanking();
  if (rankings.value.length > 0) loading.value = false;

  getRanking((data) => {
    // Excluimos al Admin del ranking competitivo
    rankings.value = data.filter(player => player.username.toLowerCase() !== 'admin');
    loading.value = false;
  });
});

const getRankColor = (index: number) => {
  if (index === 0) return 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]';
  if (index === 1) return 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]';
  if (index === 2) return 'text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.4)]';
  return 'text-slate-500';
};
</script>

<template>
  <div class="min-h-screen py-24 px-4 sm:px-8 relative overflow-hidden">
    <!-- Shared Background -->
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('/bg_texture.png')] bg-repeat"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

    <div class="max-w-5xl mx-auto relative z-10">
      <!-- Header -->
      <header class="text-center mb-20 space-y-6">
        <div class="flex items-center justify-center gap-4 mb-2">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
          <h2 class="text-amber-500 uppercase tracking-[0.6em] text-[10px] font-bold">Registro de Almas</h2>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
        </div>
        <h1 class="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-500">
          Salón de los Ecos
        </h1>
        <p class="max-w-2xl mx-auto text-slate-400 italic text-lg leading-relaxed">
          "Aquellos que han reunido los fragmentos de Lumina verán su nombre grabado en la eternidad del Códice."
        </p>
      </header>

      <!-- Ranking Table -->
      <div class="relative group">
        <!-- Table Border Glow -->
        <div class="absolute -inset-1 bg-gradient-to-b from-amber-500/20 to-transparent rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
        
        <div class="relative bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2rem] overflow-hidden shadow-2xl">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800/50 bg-slate-950/50">
                <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">Rango</th>
                <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">Guardián</th>
                <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black text-center">Nivel</th>
                <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black text-right">Ecos</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/30">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="4" class="px-8 py-12 text-center text-slate-600 italic">Consultando el Reino...</td>
              </tr>
              <tr 
                v-else 
                v-for="(player, index) in rankings" 
                :key="player.uid"
                class="hover:bg-amber-500/5 transition-colors duration-300 group/row"
              >
                <td class="px-8 py-6">
                  <span class="font-serif text-3xl font-bold" :class="getRankColor(index)">
                    {{ index + 1 }}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="text-xl font-serif text-slate-100 group-hover/row:text-amber-400 transition-colors">
                      {{ player.username }}
                    </span>
                    <span class="text-[9px] uppercase tracking-widest text-slate-600 mt-1">ID: {{ player.uid.slice(0, 8) }}</span>
                  </div>
                </td>
                <td class="px-8 py-6 text-center">
                  <span class="px-3 py-1 bg-slate-800/50 rounded-md border border-slate-700 text-amber-500/80 font-bold text-xs">
                    {{ player.level }}
                  </span>
                </td>
                <td class="px-8 py-6 text-right">
                  <div class="flex flex-col items-end">
                    <span class="text-2xl font-serif font-bold text-amber-500">
                      {{ player.ecosCollected }}
                    </span>
                    <span class="text-[8px] text-slate-500 uppercase tracking-tighter">Fragmentos</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sync Info -->
      <footer class="mt-16 flex items-center justify-between px-8">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
          <span class="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Sincronización en tiempo real activa</span>
        </div>
        <div class="text-[9px] uppercase tracking-widest text-slate-600 font-bold italic">
          Actualizado hace instantes
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Cinzel', serif;
}
</style>
