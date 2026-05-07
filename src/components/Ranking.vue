<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRanking, getCachedRanking } from '../services/rankingService';
import type { PlayerStats } from '../types';

const rankings = ref<PlayerStats[]>([]);
const loading = ref(true);

onMounted(() => {
  rankings.value = getCachedRanking();
  if (rankings.value.length > 0) loading.value = false;

  getRanking((data) => {
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
  <div class="min-h-screen py-24 px-4 sm:px-8 relative overflow-hidden bg-slate-950">
    <div class="max-w-5xl mx-auto relative z-10">
      <header class="text-center mb-20 space-y-6">
        <h1 class="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-500">
          Salón de los Ecos
        </h1>
        <p class="max-w-2xl mx-auto text-slate-400 italic text-lg">
          "Aquellos que han reunido los fragmentos de Lumina verán su nombre grabado en la eternidad del Códice."
        </p>
      </header>

      <div class="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2rem] overflow-hidden shadow-2xl">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-800/50 bg-slate-950/50">
              <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">Rango</th>
              <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black text-right">Ecos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in rankings" :key="player.uid" class="hover:bg-amber-500/5 transition-colors duration-300">
              <td class="px-8 py-6">
                <span class="font-serif text-3xl font-bold" :class="getRankColor(index)">{{ index + 1 }}</span>
                <span class="ml-4 text-xl font-serif text-slate-100">{{ player.username }}</span>
              </td>
              <td class="px-8 py-6 text-right">
                <span class="text-2xl font-serif font-bold text-amber-500">{{ player.ecosCollected }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-serif { font-family: 'Cinzel', serif; }
</style>
