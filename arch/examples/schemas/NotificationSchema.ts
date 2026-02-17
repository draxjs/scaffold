import { IEntitySchema } from "@drax/arch";

const schema: IEntitySchema = {
    module: "base",
    name: "Notification",
    apiBasePath: 'notifications',
    apiTag: 'Base',
    schema: {
        title: {
            type: 'string',
            required: true,
            index: true,
            search: true,
            header: true
        },
        message: {
            type: 'string',
            required: true,
            search: true,
            header: false
        },
        type: {
            type: 'enum',
            enum: ['info', 'success', 'warning', 'error'],
            required: true,
            index: true,
            search: true,
            header: true
        },
        status: {
            type: 'enum',
            enum: ['unread', 'read'],
            required: true,
            index: true,
            search: true,
            header: true,
            default: 'unread'
        },
        user: {
            type: 'ref',
            ref: 'User',
            refDisplay: 'username',
            required: true,
            index: true,
            header: true
        },
        metadata: {
            type: 'record',
            required: false,
            header: false,
            schema: {}
        },
        readAt: {
            type: 'date',
            required: false,
            header: false
        }
    }
}

export default schema;
export { schema };
