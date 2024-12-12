<script setup lang="ts">
import GoogleProvider from "@/modules/google/providers/GoogleProvider";
import {defineEmits} from "vue";
import {useDarkMode} from "@/composables/useDarkMode";

declare global {
  interface Window {
    gapi: any,
    handleCredentialResponse: Function
  }
}

const {darkMode} = useDarkMode()

async function loadGoogleScript() {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

const emit = defineEmits(['loginSuccess', 'loginFail'])

onMounted(async () => {
  await loadGoogleScript()
})

async function handleCredentialResponse(event: { credential: any }) {
  // Implementar el manejo de la respuesta de credenciales
  try {
    await GoogleProvider.instance.login(event.credential)
    emit('loginSuccess')
  } catch (e) {
    console.error('Error en el login:', e)
    emit('loginFail')
  }


}

const clientId = computed(() => import.meta.env.VITE_GOOGLE_CLIENT_ID)

// Expose the function to the global scope
window.handleCredentialResponse = handleCredentialResponse;

</script>

<template>
  <div v-if="clientId">
    <div id="g_id_onload"
         :data-client_id="clientId"
         data-callback="handleCredentialResponse"
    >
    </div>
    <div class="g_id_signin"
         data-type="standard"
         :data-theme="darkMode ? 'filled_black' : ''"
         data-shape="rectangular"
         style="color-scheme: light"
    ></div>
  </div>
</template>

<style scoped>

</style>
