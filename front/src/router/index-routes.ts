import {createRouter, createWebHistory} from 'vue-router'

import {setupLayouts} from 'virtual:generated-layouts'
import draxRoutes from './drax-routes'
import modulesRoutes from './modules-routes'
import {authGuard} from './auth-guard'


const routes = setupLayouts([
  ...draxRoutes,
  ...modulesRoutes
])


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(authGuard)

export default router
