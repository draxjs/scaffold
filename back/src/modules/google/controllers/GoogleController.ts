import GoogleAuthServiceFactory from "../factory/GoogleAuthServiceFactory.js";
import {BadCredentialsError, RoleServiceFactory, UserServiceFactory} from "@drax/identity-back";

class GoogleController {

    constructor() {

    }

    async login(request, reply) {

        try{
            const { credential } = request.body
            const payload = await GoogleAuthServiceFactory.instance.validateToken(credential)
            const userService = UserServiceFactory()
            const roleService = RoleServiceFactory()
            const role = await roleService.findByName('Learner')
            const userData = {
                email: payload.email,
                username: payload.name.replace(' ', ''),
                name: payload.name,
                avatar: payload.picture,
                role: role.id,
                active: true,
                phone: '',
                password: undefined,
                origin: 'Google'
            }
            return await userService.authByEmail(payload.email,true, userData)


        }catch (e){
            console.error('/api/google/login error', e)
            if (e instanceof BadCredentialsError) {
                reply.code(401)
                reply.send({error: e.message})
            }
            reply.code(500)
            reply.send({error: 'error.server'})
        }

    }

    async logout(request, reply) {

    }


}

export default GoogleController;
export {
    GoogleController
}

