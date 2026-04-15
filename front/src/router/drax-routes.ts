import {IdentityRoutes} from "@drax/identity-vue";
import {SettingRoutes} from "@drax/settings-vue";
import {DashboardCrudRoute} from "@drax/dashboard-vue";
import {AuditRoutes} from "@drax/audit-vue";
import {MediaRoutes} from "@drax/media-vue";
import {AiRoutes} from "@drax/ai-vue";


const draxRoutes = [
  ...IdentityRoutes,
  ...SettingRoutes,
  ...DashboardCrudRoute,
  ...AuditRoutes,
  ...MediaRoutes,
  ...AiRoutes
]

export default draxRoutes
export {draxRoutes}
