
import NotificationCrudPage from "../pages/crud/NotificationCrudPage.vue";


const NotificationCrudRoute = [
  {
    name: 'NotificationCrudPage',
    path: '/crud/notification',
    component: NotificationCrudPage,
    meta: {
      auth: true,
      permission: 'notification:manage',
    }
  },
]

export default NotificationCrudRoute
export { NotificationCrudRoute }
