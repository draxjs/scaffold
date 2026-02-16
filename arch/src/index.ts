import { ArchGenerator } from '@drax/arch';

//Import schemas
import NotificationSchema from './schemas/base/NotificationSchema.js';

const schemas = [
    NotificationSchema
];

const generator = new ArchGenerator(schemas);
generator.build()
