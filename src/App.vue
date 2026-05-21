<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Home from './components/Home.vue';
import Bestiary from './components/Bestiary.vue';
import Ranking from './components/Ranking.vue';
import Login from './components/Login.vue';
import { getPlayerStats, initializeUserStats } from './services/userService';
import type { PlayerStats } from './types';

// Define la sección o vista que se está mostrando actualmente
const currentView = ref('home');
// Almacena el usuario de Firebase Auth autenticado actualmente
const user = ref<any>(null);
// Almacena las estadísticas y datos del perfil del jugador en sesión
const userStats = ref<PlayerStats | null>(null);
// Controla el estado visual de carga mientras se verifica la sesión en Firebase Auth
const authLoading = ref(true);

// Determina si el usuario autenticado tiene el correo de administración
const isAdmin = computed(() => user.value?.email === 'admin@arcanecodex.com');

onMounted(() => {
  // Observa los cambios en el estado de autenticación de Firebase
  onAuthStateChanged(auth, async (u) => {
    user.value = u;
    
    if (u) {
      // Si el usuario estaba en la vista de login, lo redirige automáticamente a la pantalla de inicio de forma instantánea
      if (currentView.value === 'login') currentView.value = 'home';
      
      // Ejecutar la inicialización y obtención de estadísticas en segundo plano de manera no bloqueante
      (async () => {
        try {
          await initializeUserStats(u.uid, u.email || '');
          getPlayerStats(u.uid, (stats) => {
            userStats.value = stats;
          });
        } catch (err) {
          console.error("Error al inicializar o recuperar estadísticas del jugador en Firestore:", err);
        }
      })();
    } else {
      // Limpia las estadísticas si no hay sesión activa
      userStats.value = null;
    }
    
    authLoading.value = false;
  });
});

/**
 * Gestiona la navegación de la aplicación web entre las diferentes secciones.
 *
 * @param view Identificador de la sección a visualizar.
 */
const navigate = (view: string) => {
  currentView.value = view;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Cierra la sesión activa del usuario en Firebase Auth y redirige a la vista principal.
 */
const logout = async () => {
  await signOut(auth);
  currentView.value = 'home';
};
</script>

<template>
  <div v-if="!authLoading" class="bg-slate-950 min-h-screen text-slate-200 selection:bg-amber-500/30">
    <!-- Contenedor de contenido principal -->
    <main class="pb-32">
      <transition name="fade" mode="out-in">
        <Login v-if="currentView === 'login'" />
        <Home v-else-if="currentView === 'home'" @navigate="navigate" />
        <Bestiary 
          v-else-if="currentView === 'bestiary'" 
          :is-admin="isAdmin" 
          :unlocked-ecos="userStats?.unlockedEcos || []"
        />
        <Ranking v-else-if="currentView === 'ranking'" />
      </transition>
    </main>

    <!-- Barra de navegación arcana global (visible para invitados y usuarios registrados) -->
    <nav class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div class="flex items-center gap-8 px-10 py-5 bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-full shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
        
        <!-- Sección de Inicio -->
        <button 
          @click="navigate('home')"
          class="group relative transition-all duration-300"
          :class="currentView === 'home' ? 'scale-125' : 'hover:scale-110 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'"
        >
          <span class="text-3xl block filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">⚔️</span>
          <div v-if="currentView === 'home'" class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
        </button>

        <!-- Sección del Bestiario (Wiki) -->
        <button 
          @click="navigate('bestiary')"
          class="group relative transition-all duration-300"
          :class="currentView === 'bestiary' ? 'scale-125' : 'hover:scale-110 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'"
        >
          <span class="text-3xl block filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">📜</span>
          <div v-if="currentView === 'bestiary'" class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
        </button>

        <!-- Sección de Clasificación (Ranking) -->
        <button 
          @click="navigate('ranking')"
          class="group relative transition-all duration-300"
          :class="currentView === 'ranking' ? 'scale-125' : 'hover:scale-110 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'"
        >
          <span class="text-3xl block filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">🔮</span>
          <div v-if="currentView === 'ranking'" class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
        </button>

        <!-- Control de Sesión / Acceso Guardián -->
        <button 
          v-if="user"
          @click="logout"
          title="Cerrar sesión"
          class="group relative transition-all duration-300 hover:scale-110 opacity-40 hover:opacity-100"
        >
          <span class="text-2xl block">🚪</span>
        </button>
        <button 
          v-else
          @click="navigate('login')"
          title="Acceso Guardián"
          class="group relative transition-all duration-300"
          :class="currentView === 'login' ? 'scale-125' : 'hover:scale-110 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'"
        >
          <span class="text-2xl block">🔑</span>
          <div v-if="currentView === 'login'" class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
        </button>

      </div>
    </nav>
  </div>

  <!-- Pantalla de carga inicial mientras se verifica la sesión -->
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

/* Color de selección de texto personalizado al estilo arcano */
::selection {
  background: rgba(245, 158, 11, 0.3);
  color: white;
}
</style>
