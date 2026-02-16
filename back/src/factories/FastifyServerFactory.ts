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
import {DashboardRoutes} from "@drax/dashboard-back";
import {AuditRoutes} from "@drax/audit-back";
//Local modules routes
import {GoogleFastifyRoutes} from "../modules/google/routes/GoogleRoutes.js"
import {HealthRoutes} from "../modules/base/routes/HealthRoutes.js"
import {NotificationFastifyRoutes} from "../modules/base/routes/NotificationRoutes.js"

function FastifyServerFactory(rootDir:string) {
    const server = new FastifyServer(rootDir);
    server.fastifyDecorateRequest('authUser',null)

    //MIDDLEWARES
    server.fastifyHook('onRequest',jwtMiddleware)
    server.fastifyHook('onRequest',apiKeyMiddleware)
    server.fastifyHook('onRequest',rbacMiddleware)

    //IDENTITY ROUTES
    server.fastifyRegister(UserRoutes)
    server.fastifyRegister(RoleRoutes)
    server.fastifyRegister(TenantRoutes)
    server.fastifyRegister(UserApiKeyRoutes)
    server.fastifyRegister(UserSessionRoutes)
    server.fastifyRegister(UserLoginFailRoutes)

    //DRAX MODULES ROUTES
    server.fastifyRegister(AuditRoutes)
    server.fastifyRegister(MediaRoutes)
    server.fastifyRegister(SettingRoutes)
    server.fastifyRegister(DashboardRoutes)

    //LOCAL MODULES ROUTES
    server.fastifyRegister(GoogleFastifyRoutes)
    server.fastifyRegister(HealthRoutes)
    server.fastifyRegister(NotificationFastifyRoutes)


    return server
}

export default FastifyServerFactory
