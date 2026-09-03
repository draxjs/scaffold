Analizá el archivo `docs/project-overview.md` y generá o actualizá el archivo:

`docs/project-summary.md`

Este archivo será utilizado como fuente de conocimiento por un GPT encargado de interpretar pedidos y generar tickets de Redmine.

El objetivo NO es resumir toda la documentación.

Debés extraer solamente la información necesaria para que otra IA pueda entender rápidamente:

- de qué trata el proyecto;
- qué problema resuelve;
- quiénes lo utilizan;
- cuáles son sus módulos funcionales;
- cuál es el objetivo de cada módulo;
- cuáles son las principales funcionalidades de cada módulo;
- cuáles son los conceptos o entidades importantes;
- cuáles son los flujos principales;
- cuáles son las integraciones relevantes;
- cuáles son los términos propios del negocio;
- qué tecnología resulta útil conocer para interpretar solicitudes técnicas.

Priorizá contexto funcional sobre detalles de implementación.

El documento debe ser compacto y estar optimizado para ser utilizado como contexto por un LLM.

## Restricciones

- No documentar endpoints.
- No documentar clases.
- No documentar atributos completos de entidades.
- No incluir detalles de deployment.
- No incluir comandos.
- No incluir configuraciones.
- No incluir variables de entorno.
- No incluir código.
- No incluir información histórica salvo que sea necesaria para interpretar el sistema actual.
- No incluir funcionalidades en desuso salvo que puedan aparecer en pedidos actuales.
- No inventar información.

## Módulos

La sección más importante debe ser la de módulos.

Para cada módulo indicar:

### Nombre

**Objetivo:** una descripción de una o dos frases.

**Funcionalidades:**
- funcionalidad;
- funcionalidad;
- funcionalidad.

**Conceptos relevantes:**
- entidad;
- término;
- estado;
- concepto de negocio.

No extenderse innecesariamente.

## Extensión

Intentá mantener el documento entre aproximadamente 800 y 2.000 palabras, dependiendo de la complejidad del proyecto.

El objetivo es maximizar la relación entre información útil y cantidad de contexto consumido por el modelo.

Si `docs/project-summary.md` ya existe, actualizarlo en lugar de crear un documento paralelo.
