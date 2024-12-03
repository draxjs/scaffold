import baseRoutes from '../modules/base/routes/index.js'
import googleRoutes from '../modules/google/routes/index.js'

const routes = [
  ...baseRoutes,
  ...googleRoutes

]

export default routes
export {routes}
