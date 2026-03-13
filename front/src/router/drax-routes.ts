import {IdentityRoutes} from "@drax/identity-vue";
import {SettingRoutes} from "@drax/settings-vue";
import {DashboardCrudRoute} from "@drax/dashboard-vue";
import {AuditRoutes} from "@drax/audit-vue";
import {MediaRoutes} from "@drax/media-vue";


const draxRoutes = [
  ...IdentityRoutes,
  ...SettingRoutes,
  ...DashboardCrudRoute,
  ...AuditRoutes,
  ...MediaRoutes
]

export default draxRoutes
export {draxRoutes}
