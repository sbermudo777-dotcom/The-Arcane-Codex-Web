<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getEcos } from '../services/ecoService';
import type { Eco } from '../types';
import EnemyCard from './EnemyCard.vue';

// Define las propiedades de entrada para el Bestiario (Códice)
const props = defineProps<{
  // Indica si el usuario autenticado tiene rol de administrador
  isAdmin: boolean;
  // Identificadores de los Ecos que el jugador ha desbloqueado en su aventura
  unlockedEcos: string[];
}>();

// Listado de Ecos cargados desde la base de datos
const ecos = ref<Eco[]>([]);
// Controla el estado visual de carga del Códice
const loading = ref(true);
// Almacena posibles mensajes de error en la consulta
const errorMsg = ref<string | null>(null);

onMounted(() => {
  // Suscripción en tiempo real a la colección de Ecos en Firestore con manejo de errores
  getEcos(
    (data) => {
      ecos.value = data;
      errorMsg.value = null;
      loading.value = false;
    },
    (err) => {
      console.error("Error al obtener los ecos de Firestore:", err);
      errorMsg.value = err.message || String(err);
      loading.value = false;
    }
  );
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Textura y superposición de fondo arcanos -->
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('/bg_texture.png')] bg-repeat"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

    <!-- Partículas mágicas flotantes (Ecos) -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div v-for="n in 15" :key="n" 
        class="absolute w-1 h-1 bg-amber-500/30 rounded-full animate-float"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: (Math.random() * 15 + 10) + 's'
        }"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Sección de encabezado principal -->
      <header class="text-center mb-24 space-y-8 relative">
        <div class="flex items-center justify-center gap-4 mb-2">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
          <h2 class="text-amber-500 uppercase tracking-[0.6em] text-[10px] font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            Bestiario de Aethelgard
          </h2>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
        </div>

        <h1 class="text-6xl md:text-9xl font-serif font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-50 via-slate-300 to-slate-600 drop-shadow-2xl">
          El Códice Arcano
        </h1>
        
        <div class="relative flex justify-center py-4">
          <div class="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent"></div>
          <div class="relative bg-slate-950 px-10 py-2 border border-amber-900/40 rounded-full backdrop-blur-xl shadow-[0_0_20px_rgba(120,53,15,0.2)]">
             <span class="text-amber-400 font-serif text-xl animate-pulse">✦</span>
          </div>
        </div>

        <p class="max-w-4xl mx-auto text-slate-400 italic text-xl md:text-2xl leading-relaxed font-light">
          "Las páginas del Códice se esparcieron en forma de Ecos. Solo recuperándolos podremos entender lo que la Fractura le hizo a nuestro mundo." 
          <span class="block mt-6 font-bold text-amber-500/80 not-italic text-xs uppercase tracking-[0.4em]">— Lyra la Archivista</span>
        </p>
      </header>

      <!-- Visualización del progreso de restauración -->
      <div class="flex flex-col items-center mb-20 space-y-4">
        <div class="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Sincronización del Códice</div>
        <div class="w-80 h-1.5 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800 shadow-inner relative">
          <div 
            class="h-full bg-gradient-to-r from-amber-900 via-amber-600 to-amber-400 transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            :style="{ width: (ecos.filter(e => isAdmin || props.unlockedEcos.includes(e.id || '')).length / (ecos.length || 1) * 100) + '%' }"
          ></div>
        </div>
        <div class="text-[10px] font-serif text-amber-500/60 tracking-widest uppercase">
          {{ ecos.filter(e => isAdmin || props.unlockedEcos.includes(e.id || '')).length }} / {{ ecos.length }} Ecos Restaurados
        </div>
      </div>

      <!-- Rejilla de cartas de Ecos -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-32 space-y-6">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 border-2 border-amber-500/10 rounded-full"></div>
          <div class="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin"></div>
          <div class="absolute inset-4 border border-amber-500/20 rounded-full animate-pulse"></div>
        </div>
        <span class="text-[10px] uppercase tracking-[0.5em] text-amber-500 animate-pulse font-bold">Consultando el Códice Arcano...</span>
      </div>

      <!-- Mensaje de Error en caso de fallo de conexión -->
      <div v-else-if="errorMsg" class="flex flex-col justify-center items-center py-20 px-8 space-y-6 max-w-lg mx-auto text-center border border-red-500/20 bg-red-950/10 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <span class="text-5xl animate-bounce">⚠️</span>
        <h3 class="text-2xl font-serif font-bold text-red-400 tracking-wider">Error de Sincronización</h3>
        <p class="text-sm text-slate-300 leading-relaxed font-light">
          No se pudo establecer conexión con el Códice Arcano en Firestore.
        </p>
        <p class="text-[10px] uppercase tracking-wider text-red-500/90 font-mono bg-red-950/40 py-2 px-4 rounded-xl border border-red-500/10">
          Detalle: {{ errorMsg }}
        </p>
        <div class="text-xs text-slate-400 mt-4 leading-relaxed font-sans">
          Esto suele deberse a <strong class="text-amber-500">permisos insuficientes</strong> en las reglas de seguridad de Firestore (por ejemplo, si la base de datos requiere inicio de sesión) o a problemas de red.
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <EnemyCard 
          v-for="eco in ecos" 
          :key="eco.id" 
          :eco="{ ...eco, unlocked: isAdmin || eco.type === 'enemy' || props.unlockedEcos.includes(eco.id || '') }" 
        />
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;600;700&display=swap');

.font-serif {
  font-family: 'Cinzel', serif;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #020617;
}

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
  25% { opacity: 0.3; }
  50% { transform: translateY(-120px) translateX(30px); opacity: 0.6; }
  75% { opacity: 0.3; }
}

.animate-float {
  animation: float linear infinite;
}

/* Barra de desplazamiento personalizada para estilo visual premium */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
