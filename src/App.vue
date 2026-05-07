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

const currentView = ref('home');
const user = ref<any>(null);
const userStats = ref<PlayerStats | null>(null);
const authLoading = ref(true);

const isAdmin = computed(() => user.value?.email === 'admin@arcanecodex.com');

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u;
    
    if (u) {
      await initializeUserStats(u.uid, u.email || '');
      getPlayerStats(u.uid, (stats) => {
        userStats.value = stats;
      });
      if (currentView.value === 'login') currentView.value = 'home';
    } else {
      userStats.value = null;
      currentView.value = 'login';
    }
    
    authLoading.value = false;
  });
});

const navigate = (view: string) => {
  if (!user.value && view !== 'login') {
    currentView.value = 'login';
    return;
  }
  currentView.value = view;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const logout = async () => {
  await signOut(auth);
};
</script>

<template>
  <div v-if="!authLoading" class="bg-slate-950 min-h-screen text-slate-200 selection:bg-amber-500/30">
    <!-- Main Content -->
    <main :class="{ 'pb-32': user }">
      <transition name="fade" mode="out-in">
        <Login v-if="!user" />
        <Home v-else-if="currentView === 'home'" @navigate="navigate" />
        <Bestiary 
          v-else-if="currentView === 'bestiary'" 
          :is-admin="isAdmin" 
          :unlocked-ecos="userStats?.unlockedEcos || []"
        />
        <Ranking v-else-if="currentView === 'ranking'" />
      </transition>
    </main>

    <!-- Global Arcane Navigation (Only if logged in) -->
    <nav v-if="user" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div class="flex items-center gap-8 px-10 py-5 bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-full shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
        
        <!-- Home -->
        <button 
          @click="navigate('home')"
          class="group relative transition-all duration-300"
          :class="currentView === 'home' ? 'scale-125' : 'hover:scale-110 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'"
        >
          <span class="text-3xl block filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">⚔️</span>
          <div v-if="currentView === 'home'" class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
        </button>

        <!-- Bestiary -->
        <button 
          @click="navigate('bestiary')"
          class="group relative transition-all duration-300"
          :class="currentView === 'bestiary' ? 'scale-125' : 'hover:scale-110 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'"
        >
          <span class="text-3xl block filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">📜</span>
          <div v-if="currentView === 'bestiary'" class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
        </button>

        <!-- Ranking -->
        <button 
          @click="navigate('ranking')"
          class="group relative transition-all duration-300"
          :class="currentView === 'ranking' ? 'scale-125' : 'hover:scale-110 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'"
        >
          <span class="text-3xl block filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">🔮</span>
          <div v-if="currentView === 'ranking'" class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
        </button>

        <!-- Logout -->
        <button 
          @click="logout"
          class="group relative transition-all duration-300 hover:scale-110 opacity-40 hover:opacity-100"
        >
          <span class="text-2xl block">🚪</span>
        </button>

      </div>
    </nav>
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
