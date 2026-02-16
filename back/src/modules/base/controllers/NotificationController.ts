
import NotificationServiceFactory from "../factory/services/NotificationServiceFactory.js";
import {AbstractFastifyController} from "@drax/crud-back";
import NotificationPermissions from "../permissions/NotificationPermissions.js";
import type {INotification, INotificationBase} from "../interfaces/INotification";

class NotificationController extends AbstractFastifyController<INotification, INotificationBase, INotificationBase>   {

    constructor() {
        super(NotificationServiceFactory.instance, NotificationPermissions)
        this.tenantField = "tenant";
        this.userField = "user";
        
        this.tenantFilter = false;
        this.tenantSetter = false;
        this.tenantAssert = false;
        
        this.userFilter = true;
        this.userSetter = true;
        this.userAssert = true;
    }

}

export default NotificationController;
export {
    NotificationController
}

