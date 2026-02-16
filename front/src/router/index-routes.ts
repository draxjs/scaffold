import {createRouter, createWebHistory} from 'vue-router'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {setupLayouts} from 'virtual:generated-layouts'
import draxRoutes from './drax-routes'
import modulesRoutes from './modules-routes'


const routes = setupLayouts([
  ...draxRoutes,
  ...modulesRoutes
])


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

import {useAuth} from "@drax/identity-vue";

router.beforeEach((to) => {
  const {isAuthenticated, hasPermission} = useAuth()
  if ( !['Login'].includes(to.name as string) && (to.meta.auth && !isAuthenticated()) || (to.meta.permission && !hasPermission(to.meta.permission as string))) {
    return {path: '/login', query: {redirect: to.fullPath}}
  }
})

export default router
