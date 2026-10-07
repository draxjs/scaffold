SKILL: redmine_issue_management
Descripción

Permite consultar, crear y modificar tickets (issues) en Redmine utilizando la API REST oficial.

Referencia oficial:
https://www.redmine.org/projects/redmine/wiki/Rest_Issues
https://www.redmine.org/projects/redmine/wiki/Rest_Projects
https://www.redmine.org/projects/redmine/wiki/Rest_Trackers
https://www.redmine.org/projects/redmine/wiki/Rest_CustomFields

# Utiliza estos datos para conectarte y autenticar
- redmine_base_url: http://redmine.showvlad.com/
- api_key: solicitar la apikey al desarrollador


### Autenticación

Todas las llamadas deben incluir el siguiente header:

X-Redmine-API-Key: {api_key}
Content-Type: application/json

### Base de endpoints:

{redmine_base_url}/issues.json
{redmine_base_url}/issues/{id}.json
{redmine_base_url}/projects.json
{redmine_base_url}/projects/{id}.json
{redmine_base_url}/trackers.json
{redmine_base_url}/custom_fields.json

### Proyectos

#### Listar proyectos

Endpoint `GET /projects.json`

Ejemplo CURL
```
curl -X GET "{redmine_base_url}/projects.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json"
```

##### Parametros:

* offset: skip this number of projects in response (optional)
* limit: number of projects per page (optional)
* include: fetch associated data (optional, use comma to fetch multiple associations). Possible values: trackers, issue_categories, enabled_modules, time_entry_activities, issue_custom_fields

#### Obtener un proyecto específico

Endpoint `GET /projects/{id}.json` (también soporta buscar por identificador, ej. `GET /projects/backend.json`)

Ejemplo CURL
```
curl -X GET "{redmine_base_url}/projects/123.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json"
```

### Trackers

#### Listar trackers

Endpoint `GET /trackers.json`

Ejemplo CURL
```
curl -X GET "{redmine_base_url}/trackers.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json"
```

##### Esquema esperado (JSON):

```json
{
  "trackers": [
    {
      "id": 1,
      "name": "Defect",
      "default_status": {
        "id": 1,
        "name": "New"
      },
      "description": "Description for Bug tracker",
      "enabled_standard_fields": [
        "assigned_to_id",
        "category_id",
        "fixed_version_id",
        "parent_issue_id",
        "start_date",
        "due_date",
        "estimated_hours",
        "done_ratio",
        "description"
      ]
    }
  ]
}
```

### Custom Fields

#### Listar custom fields

Endpoint `GET /custom_fields.json`

**Nota:** Este endpoint requiere privilegios de administrador.

Ejemplo CURL
```
curl -X GET "{redmine_base_url}/custom_fields.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json"
```

##### Esquema esperado (JSON):

```json
{
  "custom_fields": [
    {
      "id": 1,
      "name": "Affected version",
      "customized_type": "issue",
      "field_format": "list",
      "regexp": "",
      "min_length": null,
      "max_length": null,
      "is_required": true,
      "is_filter": true,
      "searchable": true,
      "multiple": true,
      "default_value": "",
      "visible": false,
      "possible_values": [
        {
          "value": "0.5.x"
        },
        {
          "value": "0.6.x"
        }
      ]
    }
  ]
}
```

### Tickets

#### Listar tickets

Endpoint `GET /issues.json`

Ejemplo CURL
```
curl -X GET "{redmine_base_url}/issues.json?project_id=backend&status_id=open&limit=10" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json"
```

##### Filtros comunes

* issue_id: get issue with the given id or multiple issues by id using ',' to separate id.
* project_id: get issues from the project with the given id (a numeric value, not a project identifier).
* subproject_id: get issues from the subproject with the given id. You can use project_id=XXX&subproject_id=!* to get only the issues of a given project and none of its subprojects.
* tracker_id: get issues from the tracker with the given id
* status_id: get issues with the given status id only. Possible values: open, closed, * to get open and closed issues, status id
* assigned_to_id: get issues which are assigned to the given user id. me can be used instead an ID to fetch all issues from the logged in user (via API key or HTTP auth)
* parent_id: get issues whose parent issue is given id.
* cf_x: get issues with the given value for custom field with an ID of x. (Custom field must have 'used as a filter' checked.)


#####  Parametros:

* offset: skip this number of issues in response (optional)
* limit: number of issues per page (optional)
* sort: column to sort with. Append :desc to invert the order.
* include: fetch associated data (optional, use comma to fetch multiple associations). Possible values:
  * attachments - Since 3.4.0
  * relations

#### Obtener un issue específico

Endpoint `GET /issues/{id}.json`

Ejemplo CURL
```
curl -X GET "{redmine_base_url}/issues/123.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json"
```

### Crear un ticket

Endpoint `POST /issues.json`


#### Parametros:

* issue - A hash of the issue attributes:
  * project_id
  * tracker_id
  * status_id
  * priority_id
  * subject
  * description
  * category_id
  * fixed_version_id - ID of the Target Versions (previously called 'Fixed Version' and still referred to as such in the API)
  * assigned_to_id - ID of the user to assign the issue to (currently no mechanism to assign by name)
  * parent_issue_id - ID of the parent issue
  * custom_fields - See Custom fields
  * watcher_user_ids - Array of user ids to add as watchers (since 2.3.0)
  * is_private - Use true or false to indicate whether the issue is private or not
  * estimated_hours - Number of hours estimated for issue

Campos mínimos requeridos

* project_id
* subject

Ejemplo CURL
```
curl -X POST "{redmine_base_url}/issues.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "issue": {
      "project_id": "backend",
      "subject": "Error en login OAuth",
      "description": "El endpoint /auth/google retorna 500",
      "tracker_id": 1,
      "priority_id": 2,
      "assigned_to_id": 5
    }
  }'
```

#### Modificar un ticket

Endpoint `PUT /issues/{id}.json`

Ejemplo CURL
```
curl -X PUT "{redmine_base_url}/issues/123.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "issue": {
      "subject": "Actualizado: Error en login OAuth",
      "priority_id": 3
    }
  }'
```

#### Agregar una nota a un ticket

En Redmine las notas se agregan usando notes dentro de un update.

```
curl -X PUT "{redmine_base_url}/issues/123.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "issue": {
      "notes": "Se aplicó fix en commit abc123",
      "private_notes": false
    }
  }'
```

#### Cambiar estado de un ticket

Es necesario conocer previamente el status_id.

```
curl -X PUT "{redmine_base_url}/issues/123.json" \
  -H "X-Redmine-API-Key: {api_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "issue": {
      "status_id": 2
    }
  }'
  ```


### Manejo de errores

* 401: API Key inválida
* 403: Sin permisos suficientes
* 404: Issue no encontrado
* 422: Error de validación de datos

#### Comportamiento esperado para la IA

La IA debe: Mapear lenguaje natural a acciones.

* Validar que existan campos obligatorios antes de generar el request.
* Generar siempre el comando CURL completo.
* Mostrar claramente el endpoint y el body.
* Informar posibles errores de validación antes de generar la llamada.


#### Ejemplo de interpretación en lenguaje natural

##### Input del usuario:

Creame un ticket en backend diciendo que necesita que se agregue un nuevo requerimiento sobre un crud de legajos

##### La IA debe:


1. Determinar o consultar el proyecto
2. Determinar el tracker adecuado
3. Generar el asunto y descripcion del requerimiento 
4. Generar el CURL para realizar la invocación a redmine
5. Ejecutar el CURL y mostrar el resultado
