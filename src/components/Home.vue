<script setup lang="ts">
// Componente estático de la pantalla de inicio principal. No requiere lógica de estado en este momento.
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
    <!-- Elementos de fondo compartidos con texturas arcanas -->
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('/bg_texture.png')] bg-repeat"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

    <!-- Elemento mágico y runas giratorias del centro -->
    <div class="relative z-10 mb-12">
      <div class="w-64 h-64 md:w-96 md:h-96 relative">
        <!-- Anillos exteriores giratorios concéntricos -->
        <div class="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
        <div class="absolute inset-4 border-2 border-dashed border-amber-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        <div class="absolute inset-12 border border-amber-500/30 rounded-full animate-pulse"></div>
        
        <!-- Resplandor central de la luna moribunda -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <span class="text-8xl md:text-9xl drop-shadow-[0_0_30px_rgba(245,158,11,0.6)] select-none">🌙</span>
        </div>

        <!-- Runas flotantes y en rotación alrededor del centro -->
        <div class="absolute inset-0 animate-[spin_30s_linear_infinite]">
           <span class="absolute top-0 left-1/2 -translate-x-1/2 text-amber-500/40 text-2xl">ᚠ</span>
           <span class="absolute bottom-0 left-1/2 -translate-x-1/2 text-amber-500/40 text-2xl">ᚢ</span>
           <span class="absolute left-0 top-1/2 -translate-y-1/2 text-amber-500/40 text-2xl">ᚦ</span>
           <span class="absolute right-0 top-1/2 -translate-y-1/2 text-amber-500/40 text-2xl">ᚨ</span>
        </div>
      </div>
    </div>

    <!-- Título y narrativa introductoria del videojuego -->
    <div class="text-center relative z-10 space-y-6">
      <h2 class="text-amber-500 uppercase tracking-[0.8em] text-xs font-black drop-shadow-glow">
        Ecos de una Luna Moribunda
      </h2>
      <h1 class="text-7xl md:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-50 via-slate-300 to-slate-700 leading-tight">
        The Arcane Codex
      </h1>
      <p class="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-light italic leading-relaxed">
        "Cuando Lumina se fragmentó, el tiempo se detuvo. Solo los Guardianes pueden reunir las piezas del destino."
      </p>
      
      <div class="pt-8 flex flex-col items-center">
        <div class="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mb-8"></div>
        <button 
          @click="$emit('navigate', 'bestiary')"
          class="group relative px-12 py-4 bg-transparent border border-amber-500/30 rounded-full overflow-hidden transition-all duration-500 hover:border-amber-500/60"
        >
          <div class="absolute inset-0 bg-amber-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span class="relative z-10 text-amber-500 uppercase tracking-[0.4em] text-xs font-bold">Abrir el Códice</span>
        </button>
      </div>
    </div>

    <!-- Partículas mágicas de energía flotando libremente -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div v-for="n in 20" :key="n" 
        class="absolute w-1 h-1 bg-amber-500/20 rounded-full animate-float"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: (Math.random() * 20 + 15) + 's'
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Cinzel', serif;
}

.drop-shadow-glow {
  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.4));
}

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
  50% { transform: translateY(-150px) translateX(30px); opacity: 0.5; }
}

.animate-float {
  animation: float linear infinite;
}
</style>
