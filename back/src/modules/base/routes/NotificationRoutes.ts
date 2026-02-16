
import NotificationController from "../controllers/NotificationController.js";
import {CrudSchemaBuilder} from "@drax/crud-back";
import {NotificationSchema, NotificationBaseSchema} from '../schemas/NotificationSchema.js'

async function NotificationFastifyRoutes(fastify, options) {

    const controller: NotificationController = new NotificationController()
    const schemas = new CrudSchemaBuilder(NotificationSchema, NotificationBaseSchema,NotificationBaseSchema, 'Notification', 'openapi-3.0', ['Base']);

    fastify.get('/api/notifications', {schema: schemas.paginateSchema}, (req,rep) => controller.paginate(req,rep))
    
    fastify.get('/api/notifications/find', {schema: schemas.findSchema}, (req,rep) => controller.find(req,rep))
    
    fastify.get('/api/notifications/search', {schema: schemas.searchSchema}, (req,rep) => controller.search(req,rep))
    
    fastify.get('/api/notifications/:id', {schema: schemas.findByIdSchema}, (req,rep) => controller.findById(req,rep))
    
    fastify.get('/api/notifications/find-one', {schema: schemas.findOneSchema}, (req,rep) => controller.findOne(req,rep))
    
    fastify.get('/api/notifications/group-by', {schema: schemas.groupBySchema}, (req,rep) => controller.groupBy(req,rep))

    fastify.post('/api/notifications', {schema: schemas.createSchema}, (req,rep) =>controller.create(req,rep))

    fastify.put('/api/notifications/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.update(req,rep))
    
    fastify.patch('/api/notifications/:id', {schema: schemas.updateSchema}, (req,rep) =>controller.updatePartial(req,rep))

    fastify.delete('/api/notifications/:id', {schema: schemas.deleteSchema}, (req,rep) =>controller.delete(req,rep))
    
}

export default NotificationFastifyRoutes;
export {NotificationFastifyRoutes}
