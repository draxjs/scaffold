import type {MenuItem} from '../types/menu'

const menu: MenuItem[] = [
  {
    icon: 'mdi-home',
    text:'home',
    link: { name: "Home" },
    gallery: false,
    auth: false
  },
  {
    icon: 'mdi-account-circle',
    text:'admin',
    gallery: true,
    permission: 'user:manage',
    children: [
      {
        icon: 'mdi-domain',
        text:'tenant.menu',
        link: { name: "CrudTenant" },
        gallery: true,
        permission: 'tenant:manage'
      },
      {
        icon: 'mdi-chair-rolling',
        text:'role.menu',
        link: { name: "CrudRole" },
        gallery: true,
        permission: 'role:manage'
      },

      {
        icon: 'mdi-table-account',
        text:'user.menu',
        link: { name: "CrudUser" },
        gallery: true,
        permission: 'user:manage'
      },
      {
        icon: 'mdi mdi-table-key',
        text:'userapikey.menu',
        link: { name: "CrudUserApiKey" },
        gallery: true,
        permission: 'userApiKey:manage'
      },
      {
        icon: 'mdi-account-arrow-right',
        text:'usersession.menu',
        link: { name: "UserSessionCrudPage" },
        gallery: true,
        permission: 'usersession:menu'
      },
      {
        icon: 'mdi-lock-alert-outline',
        text:'userloginfail.menu',
        link: { name: "UserLoginFailCrudPage" },
        gallery: true,
        permission: 'userloginfail:manage'
      },
      {
        icon: 'mdi mdi-cog',
        text:'setting.menu',
        link: { name: "SettingPage" },
        gallery: true,
        permission: 'setting:manage'
      },

      {
        icon: 'mdi-view-dashboard-edit',
        text:'dashboard.menu',
        link: { name: "DashboardCrudPage" },
        gallery: true,
        permission: 'dashboard:manage'
      },
      {
        icon: 'mdi-police-badge',
        text:'audit.menu',
        link: { name: "AuditCrudPage" },
        gallery: true,
        permission: 'audit:manage'
      },
    ]
  },
  {
    icon: 'mdi-information-box',
    text:'info',
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


