import NotificationMongoRepository from '../../repository/mongo/NotificationMongoRepository.js';
import NotificationSqliteRepository from '../../repository/sqlite/NotificationSqliteRepository.js';
import { NotificationService } from '../../services/NotificationService.js';
import { NotificationBaseSchema, NotificationSchema } from "../../schemas/NotificationSchema.js";
import { COMMON, CommonConfig, DraxConfig } from "@drax/common-back";
class NotificationServiceFactory {
    static get instance() {
        if (!NotificationServiceFactory.service) {
            let repository;
            switch (DraxConfig.getOrLoad(CommonConfig.DbEngine)) {
                case COMMON.DB_ENGINES.MONGODB:
                    repository = new NotificationMongoRepository();
                    break;
                case COMMON.DB_ENGINES.SQLITE:
                    const dbFile = DraxConfig.getOrLoad(CommonConfig.SqliteDbFile);
                    repository = new NotificationSqliteRepository(dbFile, false);
                    repository.build();
                    break;
                default:
                    throw new Error("DraxConfig.DB_ENGINE must be one of " + Object.values(COMMON.DB_ENGINES).join(", "));
            }
            const baseSchema = NotificationBaseSchema;
            const fullSchema = NotificationSchema;
            NotificationServiceFactory.service = new NotificationService(repository, baseSchema, fullSchema);
        }
        return NotificationServiceFactory.service;
    }
}
export default NotificationServiceFactory;
export { NotificationServiceFactory };
