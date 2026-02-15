import {IdentityRoutes} from "@drax/identity-vue";
import {SettingRoutes} from "@drax/settings-vue";
import {DashboardCrudRoute} from "@drax/dashboard-vue";
import {AuditRoutes} from "@drax/audit-vue";


const draxRoutes = [
  ...IdentityRoutes,
  ...SettingRoutes,
  ...DashboardCrudRoute,
  ...AuditRoutes
]

export default draxRoutes
export {draxRoutes}
