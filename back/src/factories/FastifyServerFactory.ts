import FastifyServer from "../servers/FastifyServer.js";
import {jwtMiddleware, rbacMiddleware, apiKeyMiddleware, UserRoutes, RoleRoutes, TenantRoutes, UserApiKeyRoutes} from "@drax/identity-back"
import {MediaRoutes} from "@drax/media-back"
import {SettingRoutes} from "@drax/settings-back"
import {GoogleFastifyRoutes} from "../modules/google/routes/GoogleRoutes.js"

function FastifyServerFactory(rootDir:string) {
    const server = new FastifyServer(rootDir);
    server.fastifyDecorateRequest('authUser',null)
    server.fastifyHook('onRequest',jwtMiddleware)
    server.fastifyHook('onRequest',apiKeyMiddleware)
    server.fastifyHook('onRequest',rbacMiddleware)
    server.fastifyRegister(MediaRoutes)
    server.fastifyRegister(SettingRoutes)
    server.fastifyRegister(UserRoutes)
    server.fastifyRegister(RoleRoutes)
    server.fastifyRegister(TenantRoutes)
    server.fastifyRegister(UserApiKeyRoutes)

    server.fastifyRegister(GoogleFastifyRoutes)
    return server
}

export default FastifyServerFactory
