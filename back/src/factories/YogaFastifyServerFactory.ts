import YogaFastifyServer from "../servers/YogaFastifyServer.js";
import {jwtMiddleware, rbacMiddleware, apiKeyMiddleware, UserRoutes, RoleRoutes, TenantRoutes, UserApiKeyRoutes,     UserLoginFailRoutes, UserSessionRoutes} from "@drax/identity-back"
import {MediaRoutes} from "@drax/media-back"
import ModuleMerger from "../merge/ModuleMerger.js";
const {typeDefs, resolvers} = await ModuleMerger()
import {GoogleFastifyRoutes} from "../modules/google/routes/GoogleRoutes.js"
import {SettingRoutes} from "@drax/settings-back";
import {DashboardRoutes} from "@drax/dashboard-back";
import {AuditRoutes} from "@drax/audit-back";
import {HealthRoutes} from "../modules/base/routes/HealthRoutes.js"


function YogaFastifyServerFactory(rootDir:string) {
    const server = new YogaFastifyServer(typeDefs, resolvers, rootDir);
    server.fastifyDecorateRequest('authUser',null)
    server.fastifyHook('onRequest',jwtMiddleware)
    server.fastifyHook('onRequest',apiKeyMiddleware)
    server.fastifyHook('onRequest',rbacMiddleware)

    server.fastifyRegister(HealthRoutes)

    server.fastifyRegister(MediaRoutes)
    server.fastifyRegister(SettingRoutes)
    server.fastifyRegister(UserRoutes)
    server.fastifyRegister(RoleRoutes)
    server.fastifyRegister(TenantRoutes)
    server.fastifyRegister(UserApiKeyRoutes)
    server.fastifyRegister(GoogleFastifyRoutes)

    server.fastifyRegister(UserLoginFailRoutes)
    server.fastifyRegister(UserSessionRoutes)
    server.fastifyRegister(DashboardRoutes)
    server.fastifyRegister(AuditRoutes)
    return server
}

export default YogaFastifyServerFactory
