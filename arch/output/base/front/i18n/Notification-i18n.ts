
const messages = {
  en: {
  
    notification: {
          entity: 'Notification',
          menu: 'Notification',
          crud: 'Manage Notification',
          field:{
                       title:'title',
           message:'message',
           type:'type',
           status:'status',
           user:'user',
           metadata:'metadata',
           readAt:'readAt'
          }
      },
      permission: {
              'notification:view': 'View Notification',
              'notification:create': 'Create Notification',
              'notification:update': 'Edit Notification',
              'notification:delete': 'Delete Notification',
              'notification:manage': 'Manage Notification',
      }
  },
  es: {
     notification: {
          entity: 'Notification',
          menu: 'Notification',
          crud: 'Gestionar Notification',
          field:{
                       title:'title',
           message:'message',
           type:'type',
           status:'status',
           user:'user',
           metadata:'metadata',
           readAt:'readAt'
          }
      },
     permission: {
              'notification:view': 'Ver Notification',
              'notification:create': 'Crear Notification',
              'notification:update': 'Editar Notification',
              'notification:delete': 'Eliminar Notification',
              'notification:manage': 'Gestionar Notification',
     }
  }
}

export default messages;  
