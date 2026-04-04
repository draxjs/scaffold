import { AbstractMongoRepository } from "@drax/crud-back";
import { NotificationModel } from "../../models/NotificationModel.js";
class NotificationMongoRepository extends AbstractMongoRepository {
    constructor() {
        super();
        this._model = NotificationModel;
        this._searchFields = ['title', 'message', 'type', 'status'];
        this._populateFields = ['user'];
    }
}
export default NotificationMongoRepository;
export { NotificationMongoRepository };
