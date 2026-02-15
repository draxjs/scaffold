import baseRoutes from '../modules/base/routes/index.js'
import googleRoutes from '../modules/google/routes/index.js'

const modulesRoutes = [
  ...baseRoutes,
  ...googleRoutes

]

export default modulesRoutes
export {modulesRoutes}
