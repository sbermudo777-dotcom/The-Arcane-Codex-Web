<script setup lang="ts">
import type { Eco } from '../types';

defineProps<{
  eco: Eco;
}>();
</script>

<template>
  <div 
    class="relative group overflow-hidden rounded-3xl border transition-all duration-700"
    :class="[
      eco.unlocked 
        ? 'bg-slate-900/40 border-slate-800 hover:border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-amber-500/10' 
        : 'bg-slate-950/60 border-slate-900 grayscale sepia opacity-40 cursor-not-allowed'
    ]"
  >
    <!-- Card Inner Glow -->
    <div v-if="eco.unlocked" class="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

    <!-- Image Container -->
    <div class="aspect-[3/4] overflow-hidden relative">
      <img 
        :src="eco.imageUrl || '/enemies/placeholder.png'" 
        :alt="eco.name"
        class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90"></div>
      
      <!-- Status Badge -->
      <div v-if="!eco.unlocked" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
        <div class="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center mb-2 bg-slate-900/50">
           <span class="text-2xl">🔒</span>
        </div>
        <p class="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-black">Restauración Pendiente</p>
      </div>
    </div>

    <!-- Content -->
    <div class="p-8 relative">
      <h3 class="text-3xl font-serif font-bold text-slate-50 mb-3 group-hover:text-amber-400 transition-colors">
        {{ eco.unlocked ? eco.name : '???' }}
      </h3>
      <p class="text-sm text-slate-400 leading-relaxed italic mb-6 min-h-[3rem]">
        {{ eco.unlocked ? eco.description : 'Los fragmentos de este Eco se encuentran dispersos en la penumbra de Aethelgard.' }}
      </p>
    </div>
  </div>
</template>
