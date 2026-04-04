import { AbstractService } from "@drax/crud-back";
class NotificationService extends AbstractService {
    constructor(NotificationRepository, baseSchema, fullSchema) {
        super(NotificationRepository, baseSchema, fullSchema);
        this._validateOutput = false;
    }
}
export default NotificationService;
export { NotificationService };
