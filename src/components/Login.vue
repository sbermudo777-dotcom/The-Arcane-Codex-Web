<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleAuth = async () => {
  if (!email.value || !password.value) {
    error.value = "Ingresa tus credenciales, Guardián.";
    return;
  }
  
  loading.value = true;
  error.value = '';
  
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    }
  } catch (e: any) {
    if (e.code === 'auth/email-already-in-use') {
      error.value = "Este identificador ya pertenece a otro Guardián.";
    } else if (e.code === 'auth/weak-password') {
      error.value = "El sello es demasiado débil. Usa 6 o más caracteres.";
    } else {
      error.value = isLogin.value ? "Acceso denegado. Las runas no coinciden." : "Error al invocar el nuevo registro.";
    }
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0 opacity-40 bg-[url('/bg_moon.png')] bg-cover bg-center grayscale-[0.5] contrast-[1.2]"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md px-6 py-12">
      <!-- Title Box -->
      <div class="mb-12 text-center">
        <div class="inline-block p-1 bg-gradient-to-b from-slate-700 to-slate-900 rounded-lg shadow-2xl border border-slate-600/50">
          <div class="px-8 py-4 bg-slate-900/90 rounded border-t border-slate-500/30">
            <h1 class="text-3xl md:text-4xl font-serif font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-100 to-slate-400">
              THE ARCANE CODEX
            </h1>
            <p class="text-[10px] uppercase tracking-[0.4em] text-cyan-400/80 font-bold mt-1">ECHOES OF A DYING MOON</p>
          </div>
        </div>
      </div>

      <!-- Auth Form (Stone Panel) -->
      <div class="bg-slate-900/80 backdrop-blur-xl border-x border-y border-slate-700/50 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        <div class="p-10 space-y-8">
          <div class="flex border-b border-slate-800">
            <button 
              @click="isLogin = true; error = ''"
              class="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all"
              :class="isLogin ? 'text-cyan-400 border-b border-cyan-500 bg-cyan-500/5' : 'text-slate-500 hover:text-slate-300'"
            >
              Iniciar Sesión
            </button>
            <button 
              @click="isLogin = false; error = ''"
              class="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all"
              :class="!isLogin ? 'text-cyan-400 border-b border-cyan-500 bg-cyan-500/5' : 'text-slate-500 hover:text-slate-300'"
            >
              Nuevo Registro
            </button>
          </div>

          <div class="space-y-4 pt-4">
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Identificador de Alma (Email)</label>
              <input 
                v-model="email"
                type="email" 
                placeholder="guardian@aethelgard.com"
                class="w-full bg-slate-950/50 border border-slate-800 px-4 py-3 rounded-lg focus:border-cyan-500/50 focus:outline-none text-slate-200 transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Sello Secreto (Password)</label>
              <input 
                v-model="password"
                type="password" 
                placeholder="••••••••"
                class="w-full bg-slate-950/50 border border-slate-800 px-4 py-3 rounded-lg focus:border-cyan-500/50 focus:outline-none text-slate-200 transition-all"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-[10px] text-center font-bold animate-pulse uppercase tracking-wider">
            {{ error }}
          </div>

          <!-- Stone Button -->
          <button 
            @click="handleAuth"
            :disabled="loading"
            class="w-full group relative"
          >
            <div class="absolute -inset-0.5 bg-slate-600 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div class="relative flex items-center justify-center px-8 py-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg border-t border-slate-500/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_0_#1e293b] active:translate-y-1 active:shadow-none transition-all">
              <span class="text-cyan-400 uppercase tracking-[0.3em] font-black text-sm drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {{ loading ? 'Invocando...' : (isLogin ? 'Acceder' : 'Registrar Alma') }}
              </span>
            </div>
          </button>

          <p class="text-center text-[10px] text-slate-600 uppercase tracking-widest pt-2">
            {{ isLogin ? 'Destino: El Umbral de Aethelgard' : 'Iniciando Rito de Iniciación' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Cinzel', serif;
}
</style>
