
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { INotification } from '../interfaces/INotification'
import NotificationProvider from '../providers/NotificationProvider'

const notificationProvider = NotificationProvider.instance

// State
const notifications = ref<INotification[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const menuOpen = ref(false)

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.readAt).length
})

// Methods
async function fetchNotifications(page: number = 1) {
  loading.value = true
  try {
    const result = await notificationProvider.paginate({
      page,
      limit: 10,
      orderBy: 'createdAt',
      order: 'desc'
    })

    if (page === 1) {
      notifications.value = result.items || []
    } else {
      notifications.value = [...notifications.value, ...(result.items || [])]
    }

    currentPage.value = result.page || 1
    totalPages.value = Math.ceil((result.total || 0) / (result.limit || 10))
  } catch (error) {
    console.error('Error fetching notifications:', error)
  } finally {
    loading.value = false
  }
}

// Refresh “suave”: trae la página 1 y agrega solo las nuevas arriba
async function refreshLatest() {
  if (loading.value) return

  try {
    const result = await notificationProvider.paginate({
      page: 1,
      limit: 10,
      orderBy: 'createdAt',
      order: 'desc'
    })

    const incoming = result.items || []
    if (incoming.length === 0) return

    const existingIds = new Set(notifications.value.map(n => n._id))
    const newOnes = incoming.filter(n => !existingIds.has(n._id))

    if (newOnes.length > 0) {
      notifications.value = [...newOnes, ...notifications.value]
    }

    // Mantener metadatos actualizados sin pisar la página actual del usuario
    totalPages.value = Math.ceil((result.total || 0) / (result.limit || 10))
  } catch (error) {
    console.error('Error refreshing notifications:', error)
  }
}

async function markAsRead(notification: INotification) {
  if (notification.readAt) return

  try {
    await notificationProvider.updatePartial(notification._id, {
      status: 'read',
      readAt: new Date()
    })

    // Update local state
    const index = notifications.value.findIndex(n => n._id === notification._id)
    if (index !== -1) {
      notifications.value[index].readAt = new Date()
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

function onScroll(event: Event) {
  const target = event.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // Check if scrolled to bottom (with 10px threshold)
  if (scrollHeight - scrollTop - clientHeight < 10) {
    loadMore()
  }
}

async function loadMore() {
  if (loading.value || currentPage.value >= totalPages.value) return

  await fetchNotifications(currentPage.value + 1)
}

function getNotificationIcon(type: string) {
  const icons: Record<string, string> = {
    info: 'mdi-information',
    success: 'mdi-check-circle',
    warning: 'mdi-alert',
    error: 'mdi-alert-circle',
    default: 'mdi-bell'
  }
  return icons[type] || icons.default
}

function getNotificationColor(type: string) {
  const colors: Record<string, string> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
    default: 'primary'
  }
  return colors[type] || colors.default
}

function formatDate(date?: Date) {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes}m`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days}d`

  return d.toLocaleDateString()
}

onMounted(async () => {
  await fetchNotifications()

  // Polling cada 60s
  pollTimer = window.setInterval(() => {
    void refreshLatest()
  }, 60_000)
})

let pollTimer: number | null = null

onUnmounted(() => {
  if (pollTimer != null) {
    window.clearInterval(pollTimer)
    pollTimer = null
  }
})

// Si abren el menú, refrescamos en el momento (mejor sensación de “en vivo”)
watch(menuOpen, (open) => {
  if (open) void refreshLatest()
})
</script>

<template>
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    location="bottom"
    offset="8"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        v-bind="props"
      >
        <v-badge
          :content="unreadCount"
          :model-value="unreadCount > 0"
          color="error"
          overlap
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </template>

    <v-card
      min-width="360"
      max-width="400"
      class="notification-menu"
    >
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Notificaciones</span>
        <v-chip
          v-if="unreadCount > 0"
          size="small"
          color="primary"
        >
          {{ unreadCount }} nuevas
        </v-chip>
      </v-card-title>

      <v-divider></v-divider>

      <div
        ref="scrollContainer"
        class="notification-list"
        @scroll="onScroll"
      >
        <template v-if="notifications.length > 0">
          <v-list lines="three" class="pa-0">
            <template v-for="(notification, index) in notifications" :key="notification._id">
              <v-list-item
                :class="{ 'notification-unread': !notification.readAt }"
                @click="markAsRead(notification)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getNotificationColor(notification.type)">
                    <v-icon :icon="getNotificationIcon(notification.type)" color="white"></v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="text-wrap">
                  {{ notification.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-wrap mt-1">
                  {{ notification.message }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex flex-column align-end">
                    <v-icon
                      v-if="!notification.readAt"
                      size="small"
                      color="primary"
                    >
                      mdi-circle
                    </v-icon>
                    <span class="text-caption text-medium-emphasis mt-1">
                      {{ formatDate(notification.createdAt) }}
                    </span>
                  </div>
                </template>
              </v-list-item>

              <v-divider
                v-if="index < notifications.length - 1"
                :key="`divider-${notification._id}`"
              ></v-divider>
            </template>
          </v-list>

          <div v-if="loading" class="text-center pa-4">
            <v-progress-circular
              indeterminate
              color="primary"
              size="32"
            ></v-progress-circular>
          </div>

          <div
            v-else-if="currentPage >= totalPages && notifications.length > 0"
            class="text-center pa-3 text-caption text-medium-emphasis"
          >
            No hay más notificaciones
          </div>
        </template>

        <div
          v-else-if="!loading"
          class="text-center pa-8 text-medium-emphasis"
        >
          <v-icon size="64" color="grey-lighten-1">mdi-bell-outline</v-icon>
          <div class="mt-2">No hay notificaciones</div>
        </div>

        <div v-else class="text-center pa-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          ></v-progress-circular>
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

<style scoped>
.notification-menu {
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.notification-list {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.notification-unread {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.notification-unread:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

/* Scrollbar styling */
.notification-list::-webkit-scrollbar {
  width: 8px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
