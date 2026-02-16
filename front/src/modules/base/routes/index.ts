import NotificationCrudRoute from "./NotificationCrudRoute"
import BaseRoutes from "./base-routes"

export const routes = [
  ...BaseRoutes,
  ...NotificationCrudRoute
]

export default routes
