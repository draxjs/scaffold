import HomePage from '@/modules/base/pages/home/index.vue'
import LoginPage from "@/modules/base/pages/user/LoginPage.vue";
import PoliticaPrivacidad from "@/modules/base/pages/info/PoliticaPrivacidad.vue";
import CondicionesServicio from "@/modules/base/pages/info/CondicionesServicio.vue";

const index = [
  {
    name: 'Root',
    path: '/',
    component: HomePage,
    meta: {
      auth: true,
    }
  },
  {
    name: 'Home',
    path: '/home',
    component: HomePage,
    meta: {
      auth: true,
    }
  },
  {
    name: 'Login',
    path: '/login',
    component: LoginPage,
    meta: {
      auth: false,
    }
  },

  {
    name: 'PoliticaPrivacidad',
    path: '/politica-privacidad',
    component: PoliticaPrivacidad,
    meta: {
      auth: false,
    }
  },
  {
    name: 'CondicionesServicio',
    path: '/condiciones-servicio',
    component: CondicionesServicio,
    meta: {
      auth: false,
    }
  },
]


export default index
