
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

   async updatePartial(id: string, data: any): Promise<INotification> {
        const url = this.basePath + '/' + id
        const item = await this.httpClient.patch(url, data)
        return item as INotification
    }

}

export default NotificationProvider

