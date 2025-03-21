import YogaFastifyServer from "../servers/YogaFastifyServer.js";
import {jwtMiddleware, rbacMiddleware, apiKeyMiddleware, UserRoutes, RoleRoutes, TenantRoutes, UserApiKeyRoutes} from "@drax/identity-back"
import {MediaRoutes} from "@drax/media-back"
import ModuleMerger from "../merge/ModuleMerger.js";
const {typeDefs, resolvers} = await ModuleMerger()
import {GoogleFastifyRoutes} from "../modules/google/routes/GoogleRoutes.js"
import {SettingRoutes} from "@drax/settings-back";
function YogaFastifyServerFactory(rootDir:string) {
    const server = new YogaFastifyServer(typeDefs, resolvers, rootDir);
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

export default YogaFastifyServerFactory
