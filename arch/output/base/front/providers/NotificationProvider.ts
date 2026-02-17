
import {AbstractCrudRestProvider} from "@drax/crud-front";
import type {INotification, INotificationBase} from '../interfaces/INotification'

class NotificationProvider extends AbstractCrudRestProvider<INotification, INotificationBase, INotificationBase> {
    
  static singleton: NotificationProvider
    
  constructor() {
   super('/api/notifications')
  }
  
  static get instance() {
    if(!NotificationProvider.singleton){
      NotificationProvider.singleton = new NotificationProvider()
    }
    return NotificationProvider.singleton
  }

}

export default NotificationProvider

