<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Controla si se visualiza el formulario de inicio de sesión o de registro de nuevo usuario
const isLogin = ref(true);
// Almacena el nombre de usuario (apodo) o correo electrónico para iniciar sesión
const usernameOrEmail = ref('');
// Almacena el nombre de usuario para el registro
const username = ref('');
// Almacena el correo electrónico para el registro
const email = ref('');
// Almacena la contraseña ingresada
const password = ref('');
// Mensaje de error para mostrar validaciones fallidas
const error = ref('');
// Indica si hay un proceso de autenticación en curso
const loading = ref(false);

/**
 * Ejecuta el proceso de autenticación (inicio de sesión o creación de cuenta) con Firebase Auth.
 * Valida que los campos no estén vacíos y gestiona los códigos de error comunes de Firebase.
 */
const handleAuth = async () => {
  error.value = '';
  
  if (isLogin.value) {
    // LOGIN DUAL (POR USUARIO O POR EMAIL)
    if (!usernameOrEmail.value || !password.value) {
      error.value = "Ingresa tus credenciales, Guardián.";
      return;
    }
    
    loading.value = true;
    try {
      let emailToUse = usernameOrEmail.value.trim();
      
      // Si no contiene '@', asumimos que es un nombre de usuario y lo buscamos en Firestore
      if (!emailToUse.includes('@')) {
        const q = query(
          collection(db, "rankings"), 
          where("username", "==", emailToUse)
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Intentamos buscando en minúsculas por si acaso
          const qLower = query(
            collection(db, "rankings"), 
            where("username", "==", emailToUse.toLowerCase())
          );
          const querySnapshotLower = await getDocs(qLower);
          
          if (querySnapshotLower.empty) {
            error.value = "No se encontró ningún Guardián con ese nombre de usuario.";
            loading.value = false;
            return;
          } else {
            const docData = querySnapshotLower.docs[0].data();
            if (docData.email) {
              emailToUse = docData.email;
            } else {
              error.value = "Este usuario no posee un correo electrónico asociado.";
              loading.value = false;
              return;
            }
          }
        } else {
          const docData = querySnapshot.docs[0].data();
          if (docData.email) {
            emailToUse = docData.email;
          } else {
            error.value = "Este usuario no posee un correo electrónico asociado.";
            loading.value = false;
            return;
          }
        }
      }
      
      await signInWithEmailAndPassword(auth, emailToUse, password.value);
    } catch (e: any) {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        error.value = "Acceso denegado. Las runas no coinciden.";
      } else {
        error.value = "Error al intentar iniciar sesión: " + (e.message || e);
      }
      console.error(e);
    } finally {
      loading.value = false;
    }
  } else {
    // REGISTRO CON NOMBRE DE USUARIO
    if (!username.value || !email.value || !password.value) {
      error.value = "Completa todos los campos para el rito de registro.";
      return;
    }
    
    // Validar formato de nombre de usuario (letras, números, guiones y guiones bajos, entre 3 y 20 caracteres)
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username.value)) {
      error.value = "El usuario debe tener entre 3 y 20 caracteres alfanuméricos, guiones o guiones bajos.";
      return;
    }
    
    loading.value = true;
    try {
      // 1. Verificar disponibilidad del nombre de usuario en la colección rankings
      const q = query(
        collection(db, "rankings"), 
        where("username", "==", username.value)
      );
      const querySnapshot = await getDocs(q);
      
      // Control adicional insensible a mayúsculas
      const qLower = query(
        collection(db, "rankings"), 
        where("username", "==", username.value.toLowerCase())
      );
      const querySnapshotLower = await getDocs(qLower);
      
      if (!querySnapshot.empty || !querySnapshotLower.empty) {
        error.value = "Este nombre de usuario ya está registrado.";
        loading.value = false;
        return;
      }
      
      // 2. Si está disponible, guardamos temporalmente el nombre de usuario en localStorage
      // para que el hook onAuthStateChanged en App.vue lo recupere inmediatamente tras la creación exitosa.
      localStorage.setItem('pending_username', username.value.trim());
      
      // 3. Crear el usuario en Firebase Auth
      await createUserWithEmailAndPassword(auth, email.value.trim(), password.value);
    } catch (e: any) {
      localStorage.removeItem('pending_username');
      if (e.code === 'auth/email-already-in-use') {
        error.value = "Este identificador (email) ya pertenece a otro Guardián.";
      } else if (e.code === 'auth/weak-password') {
        error.value = "El sello es demasiado débil. Usa 6 o más caracteres.";
      } else if (e.code === 'auth/invalid-email') {
        error.value = "El formato del identificador de alma (email) no es válido.";
      } else {
        error.value = "Error al invocar el nuevo registro: " + (e.message || e);
      }
      console.error(e);
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
    <!-- Ilustración y filtros de fondo arcanos -->
    <div class="absolute inset-0 z-0 opacity-40 bg-[url('/bg_moon.png')] bg-cover bg-center grayscale-[0.5] contrast-[1.2]"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md px-6 py-12">
      <!-- Panel del título del videojuego -->
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

      <!-- Formulario de autenticación -->
      <div class="bg-slate-900/80 backdrop-blur-xl border-x border-y border-slate-700/50 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        <div class="p-10 space-y-8">
          <div class="flex border-b border-slate-800">
            <button 
              @click="isLogin = true; error = ''; usernameOrEmail = ''; password = ''"
              class="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
              :class="isLogin ? 'text-cyan-400 border-b border-cyan-500 bg-cyan-500/5' : 'text-slate-500 hover:text-slate-300'"
            >
              Iniciar Sesión
            </button>
            <button 
              @click="isLogin = false; error = ''; username = ''; email = ''; password = ''"
              class="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
              :class="!isLogin ? 'text-cyan-400 border-b border-cyan-500 bg-cyan-500/5' : 'text-slate-500 hover:text-slate-300'"
            >
              Nuevo Registro
            </button>
          </div>

          <div class="space-y-4 pt-4">
            <!-- INPUTS PARA INICIAR SESIÓN -->
            <div v-if="isLogin" class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Usuario o Correo Electrónico</label>
                <input 
                  v-model="usernameOrEmail"
                  type="text" 
                  placeholder="usuario@arcanecodex.com"
                  class="w-full bg-slate-950/50 border border-slate-800 px-4 py-3 rounded-lg focus:border-cyan-500/50 focus:outline-none text-slate-200 transition-all font-sans"
                />
              </div>
            </div>

            <!-- INPUTS PARA REGISTRO -->
            <div v-else class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Nombre de Usuario</label>
                <input 
                  v-model="username"
                  type="text" 
                  placeholder="Usuario"
                  class="w-full bg-slate-950/50 border border-slate-800 px-4 py-3 rounded-lg focus:border-cyan-500/50 focus:outline-none text-slate-200 transition-all font-sans"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Correo Electrónico</label>
                <input 
                  v-model="email"
                  type="email" 
                  placeholder="usuario@arcanecodex.com"
                  class="w-full bg-slate-950/50 border border-slate-800 px-4 py-3 rounded-lg focus:border-cyan-500/50 focus:outline-none text-slate-200 transition-all font-sans"
                />
              </div>
            </div>

            <!-- CONTRASEÑA (Siempre visible en ambos modos) -->
            <div class="space-y-2">
              <label class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Contraseña</label>
              <input 
                v-model="password"
                type="password" 
                placeholder="contraseña"
                class="w-full bg-slate-950/50 border border-slate-800 px-4 py-3 rounded-lg focus:border-cyan-500/50 focus:outline-none text-slate-200 transition-all font-sans"
              />
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-[10px] text-center font-bold animate-pulse uppercase tracking-wider">
            {{ error }}
          </div>

          <!-- Botón rústico con efecto rúnico -->
          <button 
            @click="handleAuth"
            :disabled="loading"
            class="w-full group relative cursor-pointer"
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
