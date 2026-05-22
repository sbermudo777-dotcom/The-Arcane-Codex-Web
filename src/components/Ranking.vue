<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRanking, getCachedRanking } from '../services/rankingService';
import type { PlayerStats } from '../types';

// Almacena el listado de clasificación de los jugadores
const rankings = ref<PlayerStats[]>([]);
// Controla el estado de carga visual de la consulta
const loading = ref(true);

onMounted(() => {
  // Carga inicial instantánea desde la memoria local (caché)
  rankings.value = getCachedRanking();
  if (rankings.value.length > 0) loading.value = false;

  // Escucha los cambios en tiempo real en la colección de rankings de Firestore
  getRanking((data) => {
    // Excluye al usuario administrador de la visualización del ranking competitivo
    rankings.value = data.filter(player => 
      !player.username || player.username.toLowerCase() !== 'admin'
    );
    loading.value = false;
  });
});

/**
 * Devuelve clases de estilos CSS específicas para los colores del podio de clasificación.
 *
 * @param index Posición en la tabla de clasificación (basado en índice 0).
 * @returns Cadena con las clases de Tailwind correspondientes al puesto.
 */
const getRankColor = (index: number): string => {
  if (index === 0) return 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'; // Oro
  if (index === 1) return 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]'; // Plata
  if (index === 2) return 'text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.4)]';  // Bronce
  return 'text-slate-500';
};

/**
 * Convierte un valor de tiempo en segundos a un formato de cronómetro legible (MM:SS).
 *
 * @param seconds Tiempo transcurrido en segundos.
 * @returns Cadena formateada como minutos y segundos (ej. "02:45").
 */
const formatTime = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds <= 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
};
</script>

<template>
  <div class="min-h-screen py-24 px-4 sm:px-8 relative overflow-hidden bg-slate-950">
    <!-- Capas de textura y degradado de fondo compartido -->
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('/bg_texture.png')] bg-repeat"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

    <div class="max-w-5xl mx-auto relative z-10">
      <!-- Encabezado de la Sección -->
      <header class="text-center mb-20 space-y-6">
        <div class="flex items-center justify-center gap-4 mb-2">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
          <h2 class="text-amber-500 uppercase tracking-[0.6em] text-[10px] font-bold">Salón de los Ecos</h2>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
        </div>
        <h1 class="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-500">
          Códice del Tiempo
        </h1>
        <p class="max-w-2xl mx-auto text-slate-400 italic text-lg leading-relaxed font-light">
          "Aquellos Guardianes que desafiaron el tiempo y completaron el rito de Aethelgard verán sus nombres grabados en la eternidad."
        </p>
      </header>

      <!-- Tabla de Clasificación Principal -->
      <div class="relative group">
        <!-- Efecto de resplandor difuminado de borde de la tabla -->
        <div class="absolute -inset-1 bg-gradient-to-b from-amber-500/20 to-transparent rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
        
        <div class="relative bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2rem] overflow-hidden shadow-2xl">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-800/50 bg-slate-950/50">
                <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">Rango</th>
                <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">Guardián</th>
                <th class="px-8 py-6 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black text-right">Tiempo Récord</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/30">
              <!-- Mensaje de carga mientras se sincroniza con el servidor -->
              <tr v-if="loading" class="animate-pulse">
                <td colspan="3" class="px-8 py-12 text-center text-slate-600 italic tracking-widest text-xs uppercase font-bold">Consultando los registros del reino...</td>
              </tr>
              <!-- Listado de posiciones del Top 10 -->
              <tr 
                v-else 
                v-for="(player, index) in rankings" 
                :key="player.uid"
                class="hover:bg-amber-500/5 transition-colors duration-300 group/row"
              >
                <!-- Columna: Puesto en el ranking -->
                <td class="px-8 py-6">
                  <span class="font-serif text-3xl font-bold" :class="getRankColor(index)">
                    {{ index + 1 }}
                  </span>
                </td>
                
                <!-- Columna: Nombre de victoria del Guardián -->
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="text-xl font-serif text-slate-100 group-hover/row:text-amber-400 transition-colors">
                      {{ player.username || player.playerName || 'Guardián Anónimo' }}
                    </span>
                  </div>
                </td>
                
                <!-- Columna: Mejor tiempo registrado (formato MM:SS) -->
                <td class="px-8 py-6 text-right">
                  <div class="flex flex-col items-end">
                    <span class="text-2xl font-serif font-bold text-amber-500 group-hover/row:scale-105 transition-transform duration-300 origin-right">
                      {{ formatTime(player.bestTime) }}
                    </span>
                    <span class="text-[8px] text-slate-500 uppercase tracking-tighter mt-1">Minutos : Segundos</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pie de página con información de sincronización -->
      <footer class="mt-16 flex items-center justify-between px-8">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
          <span class="text-[9px] uppercase tracking-widest text-slate-600 font-bold">Sincronización del códice activa</span>
        </div>
        <div class="text-[9px] uppercase tracking-widest text-slate-600 font-bold italic">
          Tiempo Real
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

.font-serif {
  font-family: 'Cinzel', serif;
}
</style>
