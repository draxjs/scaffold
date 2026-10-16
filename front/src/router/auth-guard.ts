import {isRememberMeEnabled, refreshAuthSession, useAuth, useAuthStore} from '@drax/identity-vue'
import type {NavigationGuard} from 'vue-router'

export const authGuard: NavigationGuard = async (to) => {
  try {
    await refreshAuthSession()
  } catch {
    // Rejected credentials are cleared by Drax; transient failures remain recoverable.
  }

  const {isAuthenticated, hasPermission} = useAuth()
  const requiresAuth = to.name !== 'Login' && to.meta.auth
  const requiresPermission = to.meta.permission
  const authenticated = isAuthenticated()

  if ((requiresAuth || requiresPermission) && !authenticated &&
      isRememberMeEnabled() && useAuthStore().refreshToken) {
    return false
  }

  if ((requiresAuth && !authenticated) ||
      (requiresPermission && !hasPermission(requiresPermission as string))) {
    return {path: '/login', query: {redirect: to.fullPath}}
  }
}
