# Prompt para relevamiento y documentación de un proyecto


Quiero que analices este proyecto completo y generes una documentación funcional y técnica de alto nivel.


Tu objetivo principal no es describir archivo por archivo ni explicar cada clase, sino entender **qué hace el sistema, cómo está organizado, cuáles son sus módulos funcionales, qué actores intervienen y cómo se relacionan sus principales componentes y entidades**.

## Archivo

Guarda el contenido generado en el archivo docs/project-overview.md

## Contexto proporcionado por mí


Antes de analizar el código, tené en cuenta la siguiente información:


- **Nombre del proyecto:** [COMPLETAR]
- **Objetivo general del sistema:** [COMPLETAR]
- **Usuarios principales:** [COMPLETAR]
- **Problema de negocio que resuelve:** [COMPLETAR]
- **Clientes / áreas que lo utilizan:** [COMPLETAR]
- **Integraciones conocidas:** [COMPLETAR]
- **Arquitectura o decisiones relevantes que conozco:** [COMPLETAR]
- **Módulos que sé que existen:** [COMPLETAR]
- **Procesos críticos:** [COMPLETAR]
- **Información adicional:** [COMPLETAR]


La información anterior puede ser incompleta. Utilizá el código para ampliarla, validarla o detectar inconsistencias.


---


# Metodología de análisis


Antes de escribir la documentación:


1. Analizá la estructura completa del repositorio.
2. Identificá tecnologías, frameworks y librerías principales.
3. Detectá aplicaciones, servicios, APIs, workers, jobs o procesos independientes.
4. Identificá controladores, endpoints, rutas y casos de uso.
5. Analizá entidades, modelos, schemas, DTOs y relaciones.
6. Detectá roles, permisos, guards, middlewares o mecanismos de autorización.
7. Identificá integraciones externas.
8. Analizá configuración, variables de entorno y servicios externos utilizados.
9. Identificá procesos batch, cron, workers, colas o procesamiento asincrónico.
10. Analizá eventos, webhooks y mecanismos de comunicación entre componentes.
11. Si existe frontend, analizá vistas, páginas, módulos, navegación y acciones disponibles para los usuarios.
12. Si existe backend, relacioná endpoints y servicios con las funcionalidades de negocio que implementan.


No hagas una documentación basada solamente en nombres de directorios. Corroborá cada conclusión buscando evidencia en distintas partes del código.


---


# Detección de módulos


Determiná primero si el sistema tiene una arquitectura funcionalmente modular.


Considerá como módulo un conjunto coherente de funcionalidades que represente un dominio o responsabilidad del negocio.


Ejemplos:


- Usuarios
- Seguridad
- Clientes
- Cobranzas
- Transferencias
- Campañas
- Reportes
- Notificaciones
- Configuración
- Auditoría
- Facturación
- Mensajería
- Integraciones


No confundas necesariamente un directorio técnico con un módulo funcional.


Por ejemplo:


controllers/
services/
repositories/


son capas técnicas y no módulos funcionales.


En cambio:


users/
payments/
campaigns/


probablemente representen dominios funcionales.


Si detectás que el proyecto es modular, la documentación debe organizarse principalmente **por módulos funcionales**.


Si el proyecto no es modular, documentá sus principales capacidades funcionales.


---


# Documento a generar


Generá un documento con la siguiente estructura.


# 1. Descripción general


Explicar brevemente:


- qué es el sistema;
- cuál es su objetivo;
- qué problema resuelve;
- quiénes lo utilizan;
- cuáles son sus principales capacidades.


Debe permitir que una persona nueva entienda el propósito del proyecto en pocos minutos.


---


# 2. Alcance funcional


Enumerar las principales capacidades del sistema.


Ejemplo:


- Administración de usuarios.
- Gestión de clientes.
- Procesamiento de operaciones.
- Generación de reportes.
- Integraciones con servicios externos.
- Automatización de procesos.


No entrar todavía en detalle técnico.


---


# 3. Arquitectura general


Describir brevemente la arquitectura detectada.


Por ejemplo:


- aplicación monolítica;
- monolito modular;
- frontend + API;
- microservicios;
- workers;
- servicios independientes;
- arquitectura orientada a eventos.


Incluir, cuando corresponda:


- frontend;
- backend;
- base de datos;
- workers;
- colas;
- cache;
- almacenamiento;
- servicios externos.


Mantener esta sección breve y conceptual.


---


# 4. Módulos funcionales


Si el sistema es modular, crear una sección independiente para cada módulo.


## 4.X [Nombre del módulo]


### Objetivo


Explicar qué responsabilidad tiene este módulo dentro del sistema.


### Funcionalidades


Enumerar las principales funcionalidades implementadas.


Para cada funcionalidad importante explicar brevemente:


- qué permite hacer;
- quién puede ejecutarla;
- qué resultado produce.


### Entidades principales


Describir solamente las entidades relevantes desde el punto de vista funcional.


Para cada entidad indicar:


**[Entidad]**


Propósito:
Explicar qué representa dentro del negocio.


Información principal:
Enumerar los atributos conceptualmente relevantes, evitando documentar campos técnicos sin importancia.


Relaciones:
Explicar relaciones relevantes con otras entidades.


Estados:
Si tiene un ciclo de vida o estados, describirlos.


Ejemplo:


Pedido


Propósito:
Representa una solicitud realizada por un cliente.


Información principal:


- cliente;
- fecha;
- importe;
- estado;
- productos.


Relaciones:


- pertenece a un cliente;
- contiene uno o más productos;
- puede generar uno o más pagos.


Estados:


PENDIENTE → CONFIRMADO → PROCESADO → FINALIZADO


### Procesos principales


Describir flujos importantes del módulo.


Por ejemplo:


1. El usuario crea una solicitud.
2. El sistema valida la información.
3. Se registra la operación.
4. Se ejecuta una integración externa.
5. Se actualiza el estado.
6. Se notifica al usuario.


### Reglas de negocio relevantes


Identificar validaciones o restricciones importantes encontradas en el código.


No listar validaciones triviales.


### Integraciones


Indicar servicios externos utilizados específicamente por el módulo.


### Observaciones


Incluir particularidades, limitaciones o decisiones de diseño relevantes.


Repetir esta estructura para cada módulo detectado.


---


# 5. Roles y usuarios


Identificar todos los roles o perfiles relevantes.


Para cada rol indicar:


## [Rol]


**Objetivo**


Qué tipo de usuario representa.


**Principales permisos**


Qué operaciones puede realizar.


**Módulos a los que accede**


Indicar las áreas principales del sistema disponibles para ese rol.


Si los permisos son dinámicos o utilizan RBAC, ACL, scopes o permisos individuales, explicarlo.


Si no existen roles explícitos pero pueden inferirse perfiles funcionales, diferenciarlos claramente como inferencias.


---


# 6. Modelo de información


Crear un resumen conceptual de las entidades principales del sistema.


No documentar todas las tablas o colecciones.


Priorizar las entidades de negocio.


Explicar las relaciones más importantes.


Ejemplo:


Cliente
↓
Contrato
↓
Operación
↓
Pago


Si resulta útil, generar también un diagrama Mermaid `erDiagram`.


---


# 7. Flujos principales del sistema


Identificar entre 3 y 10 procesos representativos del proyecto.


Por ejemplo:


- alta de usuario;
- creación de operación;
- procesamiento de pago;
- asignación de trabajo;
- envío de notificación;
- cierre de una gestión.


Para cada flujo explicar paso a paso qué ocurre.


Cuando ayude a comprenderlo, generar un diagrama Mermaid `sequenceDiagram` o `flowchart`.


---


# 8. Integraciones externas


Crear una tabla:


| Integración | Propósito | Tipo | Módulos que la utilizan |
|---|---|---|---|
| Servicio X | ... | REST / SOAP / SMTP / Webhook / etc. | ... |


Incluir solamente integraciones detectadas o indicadas explícitamente.


---


# 9. Procesos automáticos


Documentar si existen:


- cron jobs;
- workers;
- consumers;
- queues;
- procesamiento batch;
- procesos programados;
- tareas automáticas;
- reconciliaciones;
- importaciones;
- exportaciones.


Para cada uno explicar:


- objetivo;
- cuándo se ejecuta;
- qué información procesa;
- qué resultado genera.


---


# 10. API


Si el sistema expone APIs, describirlas a nivel funcional.


Agrupar endpoints por módulo.


No generar una referencia exhaustiva estilo Swagger salvo que se solicite expresamente.


Ejemplo:


## Clientes


`GET /clients`


Obtiene clientes disponibles.


`POST /clients`


Crea un nuevo cliente.


## Operaciones


...


---


# 11. Tecnología


Mantener esta sección intencionalmente breve.


Indicar:


- lenguaje;
- framework principal;
- frontend;
- backend;
- base de datos;
- ORM / ODM;
- cache;
- colas;
- infraestructura relevante;
- librerías estructurales importantes.


No listar todas las dependencias del proyecto.


---


# 12. Configuración y ejecución


Documentar de manera resumida:


- requisitos;
- variables de entorno relevantes;
- servicios necesarios;
- forma de ejecutar el proyecto;
- comandos principales;
- perfiles o ambientes disponibles.


Nunca incluir passwords, tokens, secretos, API keys ni credenciales reales.


---


# 13. Dependencias entre módulos


Si el proyecto es modular, explicar qué módulos dependen de otros.


Ejemplo:


Usuarios
↓
Seguridad
↓
Operaciones
↓
Facturación


Indicar dependencias fuertes cuando sean evidentes.


Generar un `flowchart` Mermaid si facilita la comprensión.


---


# 14. Puntos críticos


Identificar componentes que parezcan especialmente importantes para el funcionamiento del sistema.


Por ejemplo:


- procesos centrales;
- entidades compartidas;
- integraciones críticas;
- componentes con alto acoplamiento;
- puntos únicos de fallo;
- procesos con impacto financiero;
- operaciones que modifican información sensible.


No realizar una auditoría completa de código salvo que se solicite.


---


# 15. Glosario


Crear un pequeño glosario con términos propios del proyecto, acrónimos, estados o conceptos de negocio encontrados en el código.


---


# 16. Dudas y puntos a validar


Esta sección es obligatoria.


Enumerar información que no pueda determinarse con suficiente certeza a partir del código.


Ejemplo:


- No fue posible determinar si X continúa utilizándose en producción.
- Existen dos implementaciones para Y y no queda claro cuál está activa.
- El rol Z aparece definido pero no se encontraron usos.
- La integración X parece estar parcialmente implementada.


Estos puntos deben convertirse en preguntas concretas para el responsable del proyecto.


---


# 17. Información inferida


Separar explícitamente las conclusiones que no sean completamente comprobables.


Utilizar las siguientes etiquetas cuando corresponda:


**Confirmado por código**


**Informado como contexto**


**Inferido**


Nunca presentar una inferencia como un hecho.


---


# Criterios de calidad


La documentación debe:


- estar orientada a entender el sistema;
- utilizar lenguaje claro;
- evitar explicaciones innecesariamente técnicas;
- evitar describir clase por clase;
- evitar copiar código salvo que sea imprescindible;
- priorizar funcionalidades y conceptos de negocio;
- relacionar funcionalidades con módulos y entidades;
- explicar roles y permisos;
- identificar procesos importantes;
- detectar módulos automáticamente;
- ser útil tanto para desarrolladores como para responsables funcionales.


El resultado debe permitir que una persona que nunca vio el proyecto pueda entender razonablemente:


1. para qué existe;
2. quién lo utiliza;
3. cuáles son sus módulos;
4. qué puede hacerse en cada módulo;
5. cuáles son sus entidades principales;
6. cuáles son los principales flujos;
7. cómo interactúan los módulos;
8. qué integraciones existen;
9. con qué tecnología está construido.


Antes de finalizar, revisá nuevamente el repositorio para comprobar que no hayan quedado módulos o funcionalidades importantes sin documentar.



