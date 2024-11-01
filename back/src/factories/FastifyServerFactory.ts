import FastifyServer from "../servers/FastifyServer.js";
import {jwtMiddleware, rbacMiddleware, apiKeyMiddleware, UserRoutes, RoleRoutes, TenantRoutes, UserApiKeyRoutes} from "@drax/identity-back"
import {MediaRoutes} from "@drax/media-back"

function YogaFastifyServerFactory(rootDir:string) {
    const server = new FastifyServer(rootDir);
    server.fastifyDecorateRequest('authUser',null)
    server.fastifyHook('onRequest',jwtMiddleware)
    server.fastifyHook('onRequest',apiKeyMiddleware)
    server.fastifyHook('onRequest',rbacMiddleware)
    server.fastifyRegister(MediaRoutes)
    server.fastifyRegister(UserRoutes)
    server.fastifyRegister(RoleRoutes)
    server.fastifyRegister(TenantRoutes)
    server.fastifyRegister(UserApiKeyRoutes)
    return server
}

export default YogaFastifyServerFactory
