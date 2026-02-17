<script setup lang="ts">
import { ref } from 'vue'
import NotificationProvider from '../providers/NotificationProvider'
import type { INotificationBase } from '../interfaces/INotification'

const notificationProvider = NotificationProvider.instance

const loading = ref(false)
const lastId = ref<string | null>(null)
const errorMsg = ref<string | null>(null)
const okMsg = ref<string | null>(null)

async function createTestNotification() {
  if (loading.value) return

  loading.value = true
  errorMsg.value = null
  okMsg.value = null
  lastId.value = null

  try {
    const payload: INotificationBase = {
      title: 'Notificación de prueba',
      message: `Esto es una notificación generada para test (${new Date().toLocaleString()})`,
      type: 'info',
      status: 'unread',
      user: null,
      metadata: {
        source: 'NotificationTestButton',
        kind: 'test'
      }
    }

    const created = await notificationProvider.create(payload)
    lastId.value = created?._id ?? null
    okMsg.value = lastId.value
      ? `Notificación creada (id: ${lastId.value})`
      : 'Notificación creada'
  } catch (e: any) {
    console.error('Error creating test notification:', e)
    errorMsg.value = e?.message ?? 'No se pudo crear la notificación de prueba'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="d-flex align-center ga-3">
    <v-btn
      color="primary"
      variant="elevated"
      :loading="loading"
      :disabled="loading"
      prepend-icon="mdi-bell-plus"
      @click="createTestNotification"
    >
      Notificación de prueba
    </v-btn>

    <div class="text-caption">
      <div v-if="okMsg" class="text-success">
        {{ okMsg }}
      </div>
      <div v-else-if="errorMsg" class="text-error">
        {{ errorMsg }}
      </div>
      <div v-else class="text-medium-emphasis">
        Crea una notificación en <code>/api/notifications</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* sin estilos extra por ahora */
</style>
