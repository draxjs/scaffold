# Historia de usuario

Como: administrador del sistema  
Quiero: gestionar Notification  
Para: mantener informados a los usuarios sobre eventos importantes del sistema mediante notificaciones personalizadas

## Atributos

| Field | Type | Required | Index | Validations | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| id | string | yes | yes | - | Identificador único de la notificación |
| title | string | yes | yes | min:3, max:100 | Título de la notificación |
| message | string | yes | no | min:10, max:500 | Mensaje descriptivo de la notificación |
| type | enum:['info','success','warning','error'] | yes | yes | - | Tipo de notificación que determina su presentación visual |
| status | enum:['unread','read'] | yes | yes | - | Estado de lectura de la notificación |
| userId | ref:User | yes | yes | - | Usuario destinatario de la notificación |
| metadata | object | no | no | - | Datos adicionales contextuales en formato JSON |
| readAt | date | no | no | - | Fecha y hora en que se marcó como leída |
| createdAt | date | yes | yes | - | Fecha de creación de la notificación |
| updatedAt | date | yes | no | - | Fecha de última actualización |
| deletedAt | date | no | no | - | Fecha de eliminación lógica (soft delete) |

## Criterios de aceptación

### Escenario 1: Crear Notification exitosamente
Dado: que el administrador del sistema se encuentra en la pantalla de gestión de Notification  
Cuando: completa los campos obligatorios (title, message, type, status, userId) con información válida y confirma la operación  
Entonces: el sistema registra la nueva Notification con estado 'unread' por defecto y muestra un mensaje de confirmación

### Escenario 2: Validación de campos obligatorios
Dado: que el administrador del sistema intenta crear o actualizar una Notification  
Cuando: omite uno o más campos obligatorios (title, message, type, status, userId) o ingresa datos inválidos  
Entonces: el sistema muestra mensajes de validación claros indicando los errores específicos y no permite continuar

### Escenario 3: Validación de tipo de notificación
Dado: que el administrador del sistema está creando una Notification  
Cuando: selecciona un tipo de notificación (info, success, warning, error)  
Entonces: el sistema valida que el tipo sea uno de los valores permitidos

### Escenario 4: Visualizar listado de Notification
Dado: que existen una o más Notification registradas  
Cuando: el administrador del sistema accede a la sección correspondiente  
Entonces: el sistema muestra el listado actualizado con información relevante (title, type, status, userId, createdAt) ordenado por fecha de creación descendente

### Escenario 5: Filtrar notificaciones por estado
Dado: que existen notificaciones con diferentes estados (unread, read)  
Cuando: el administrador del sistema aplica un filtro por estado  
Entonces: el sistema muestra únicamente las notificaciones que coinciden con el estado seleccionado

### Escenario 6: Filtrar notificaciones por tipo
Dado: que existen notificaciones con diferentes tipos (info, success, warning, error)  
Cuando: el administrador del sistema aplica un filtro por tipo  
Entonces: el sistema muestra únicamente las notificaciones del tipo seleccionado

### Escenario 7: Marcar notificación como leída
Dado: que existe una Notification con status 'unread'  
Cuando: el usuario marca la notificación como leída  
Entonces: el sistema actualiza el status a 'read', registra la fecha actual en readAt y muestra confirmación

### Escenario 8: Editar Notification
Dado: que el administrador del sistema selecciona una Notification existente  
Cuando: modifica los datos permitidos (title, message, type, metadata) y confirma la operación  
Entonces: el sistema actualiza la información, actualiza el campo updatedAt y muestra confirmación

### Escenario 9: Eliminar Notification (soft delete)
Dado: que el administrador del sistema selecciona una Notification existente  
Cuando: confirma la eliminación  
Entonces: el sistema marca el registro con deletedAt (eliminación lógica), lo remueve del listado principal y muestra confirmación

### Escenario 10: Almacenar metadata adicional
Dado: que el administrador del sistema está creando o editando una Notification  
Cuando: proporciona datos adicionales en el campo metadata como objeto JSON  
Entonces: el sistema almacena correctamente la información adicional sin validaciones estrictas de estructura

### Escenario 11: Búsqueda de notificaciones
Dado: que existen múltiples Notification registradas  
Cuando: el administrador del sistema realiza una búsqueda por título o mensaje  
Entonces: el sistema muestra las notificaciones que coinciden con los criterios de búsqueda
