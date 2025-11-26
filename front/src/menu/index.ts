import type {MenuItem} from '../types/menu'

const menu: MenuItem[] = [
  {
    icon: 'mdi-home',
    text:'HOME',
    link: { name: "Home" },
    gallery: false,
    auth: false
  },
  {
    icon: 'mdi-account-circle',
    text:'Admin',
    gallery: true,
    permission: 'user:manage',
    children: [
      {
        icon: 'mdi-domain',
        text:'Tenant',
        link: { name: "CrudTenant" },
        gallery: true,
        permission: 'tenant:manage'
      },
      {
        icon: 'mdi-chair-rolling',
        text:'Roles',
        link: { name: "CrudRole" },
        gallery: true,
        permission: 'role:manage'
      },

      {
        icon: 'mdi-table-account',
        text:'Users',
        link: { name: "CrudUser" },
        gallery: true,
        permission: 'user:manage'
      },
      {
        icon: 'mdi mdi-table-key',
        text:'Api Keys',
        link: { name: "CrudUserApiKey" },
        gallery: true,
        permission: 'userApiKey:manage'
      },
      {
        icon: 'mdi-account-arrow-right',
        text:'UserSession',
        link: { name: "UserSessionCrudPage" },
        gallery: true,
        permission: 'usersession:manage'
      },
      {
        icon: 'mdi-lock-alert-outline',
        text:'UserLoginFail',
        link: { name: "UserLoginFailCrudPage" },
        gallery: true,
        permission: 'userloginfail:manage'
      },
      {
        icon: 'mdi mdi-cog',
        text:'Ajustes',
        link: { name: "SettingPage" },
        gallery: true,
        permission: 'setting:manage'
      },

      {
        icon: 'mdi-view-dashboard-edit',
        text:'DashboardCrudPage',
        link: { name: "DashboardCrudPage" },
        gallery: true,
        permission: 'dashboard:manage'
      },
    ]
  },
  {
    icon: 'mdi-information-box',
    text:'INFO',
    gallery: true,
    auth: false,
    children: [
      {
        icon: 'mdi-information-outline',
        text:'POLITICA PRIVACIDAD',
        link: { name: "PoliticaPrivacidad" },
        gallery: true,
        auth: true
      },
      {
        icon: 'mdi-frequently-asked-questions',
        text:'CONDICIONES SERVICIO',
        link: { name: "CondicionesServicio" },
        gallery: true,
        auth: true
      },
    ]
  }
]

export default menu

export {
  menu
}


