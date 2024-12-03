
import GoogleController from "../controllers/GoogleController.js";

async function GoogleFastifyRoutes(fastify, options) {

    const controller: GoogleController = new GoogleController()

    fastify.post('/api/google/login', (req,rep) => controller.login(req,rep))

    fastify.post('/api/google/logout', (req,rep) => controller.logout(req,rep))
}

export default GoogleFastifyRoutes;
export {GoogleFastifyRoutes}
