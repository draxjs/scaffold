import { AbstractSqliteRepository } from "@drax/crud-back";
class NotificationSqliteRepository extends AbstractSqliteRepository {
    constructor() {
        super(...arguments);
        this.tableName = 'Notification';
        this.searchFields = ['title', 'message', 'type', 'status'];
        this.booleanFields = [];
        this.identifier = '_id';
        this.populateFields = [
            { field: 'user', table: 'user', identifier: '_id' }
        ];
        this.verbose = false;
        this.tableFields = [
            { name: "title", type: "TEXT", unique: undefined, primary: false },
            { name: "message", type: "TEXT", unique: undefined, primary: false },
            { name: "type", type: "TEXT", unique: undefined, primary: false },
            { name: "status", type: "TEXT", unique: undefined, primary: false },
            { name: "user", type: "TEXT", unique: undefined, primary: false },
            { name: "metadata", type: "TEXT", unique: undefined, primary: false },
            { name: "readAt", type: "TEXT", unique: undefined, primary: false }
        ];
    }
}
export default NotificationSqliteRepository;
export { NotificationSqliteRepository };
