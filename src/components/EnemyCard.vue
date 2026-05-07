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
      
      <!-- Overlay Gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90"></div>
      
      <!-- Status Badge -->
      <div v-if="!eco.unlocked" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
        <div class="w-16 h-16 rounded-full border border-slate-700 flex items-center justify-center mb-2 bg-slate-900/50">
           <span class="text-2xl">🔒</span>
        </div>
        <p class="text-[9px] uppercase tracking-[0.4em] text-slate-500 font-black">Restauración Pendiente</p>
      </div>

      <!-- Corner Rune -->
      <div v-if="eco.unlocked" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-amber-500/20 rounded-lg backdrop-blur-md text-[10px] text-amber-500/50 font-serif">
        {{ eco.rarity.charAt(0).toUpperCase() }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-8 relative">
      <div class="flex items-center gap-3 mb-4">
        <div class="h-px flex-grow bg-gradient-to-r from-transparent to-slate-800"></div>
        <span class="text-[9px] uppercase tracking-[0.3em] text-amber-500/80 font-bold whitespace-nowrap">{{ eco.rarity }} • {{ eco.type }}</span>
        <div class="h-px flex-grow bg-gradient-to-l from-transparent to-slate-800"></div>
      </div>
      
      <h3 class="text-3xl font-serif font-bold text-slate-50 mb-3 group-hover:text-amber-400 transition-colors drop-shadow-md">
        {{ eco.unlocked ? eco.name : '???' }}
      </h3>
      
      <p class="text-sm text-slate-400 leading-relaxed italic mb-6 min-h-[3rem]">
        {{ eco.unlocked ? eco.description : 'Los fragmentos de este Eco se encuentran dispersos en la penumbra de Aethelgard.' }}
      </p>

      <div v-if="eco.unlocked" class="space-y-4 overflow-hidden">
        <div class="h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent"></div>
        <div class="max-h-0 group-hover:max-h-40 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
           <p class="text-[11px] text-slate-500 leading-loose font-medium text-justify">
            {{ eco.lore }}
          </p>
        </div>
      </div>
    </div>

    <!-- Animated Border Glow -->
    <div v-if="eco.unlocked" class="absolute inset-0 pointer-events-none border border-amber-500/0 group-hover:border-amber-500/10 rounded-3xl transition-all duration-700"></div>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Cinzel', serif;
}
</style>
