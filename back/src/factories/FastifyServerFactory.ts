import FastifyServer from "../servers/FastifyServer.js";
import {
    jwtMiddleware,
    rbacMiddleware,
    apiKeyMiddleware,
    UserRoutes,
    RoleRoutes,
    TenantRoutes,
    UserApiKeyRoutes,
    UserSessionRoutes,
    UserLoginFailRoutes
} from "@drax/identity-back"
import {MediaRoutes} from "@drax/media-back"
import {SettingRoutes} from "@drax/settings-back"
import {GoogleFastifyRoutes} from "../modules/google/routes/GoogleRoutes.js"
import {HealthRoutes} from "../modules/base/routes/HealthRoutes.js"
import {DashboardRoutes} from "@drax/dashboard-back";
import {AuditRoutes} from "@drax/audit-back";

function FastifyServerFactory(rootDir:string) {
    const server = new FastifyServer(rootDir);
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
    server.fastifyRegister(UserSessionRoutes)
    server.fastifyRegister(UserLoginFailRoutes)

    server.fastifyRegister(DashboardRoutes)
    server.fastifyRegister(AuditRoutes)

    server.fastifyRegister(GoogleFastifyRoutes)
    return server
}

export default FastifyServerFactory
