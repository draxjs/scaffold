
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

  async markAsRead(id: string): Promise<INotification> {
    const url = this.basePath + '/' + id + '/read-state'
    const item = await this.httpClient.put(url,null)
    return item as INotification
  }

}

export default NotificationProvider

