# Sesiones recordadas (remember-me)

## Estado de la integración

El frontend utiliza las APIs de Drax 3.65.0: `setupAuthSession()` después de instalar Pinia con persistencia y antes de cargas API/router; el guard espera `refreshAuthSession()` antes de comprobar autenticación y permisos. Si falla la red y queda una sesión recuperable, cancela la navegación protegida sin borrar credenciales. Con la flag desactivada conserva la redirección normal aunque exista un refresh token antiguo.

Se sincronizaron las dependencias frontend y su lockfile con los rangos 3.65.0 ya declarados en el proyecto. Se verificaron `common-front`, `identity-front`, `identity-vue` e `identity-share` 3.65.0 sin duplicados de esos singletons. El backend ya tenía `identity-back` e `identity-share` 3.65.0, `LoadIdentityConfigFromEnv()` y `UserRoutes` con `/api/auth/refresh` y `/api/auth/logout`; el middleware admite esas rutas incluso con bearer vencido. No necesita rutas ni almacenamiento de refresh adicionales en este proyecto.

`IdentityLogin` ya incorpora el checkbox, desmarcado inicialmente. No se modifica la duración de `DRAX_JWT_EXPIRATION`. Google conserva su login normal con token externo: esta integración no le agrega sesión recordada. El flujo validado es REST, no GraphQL.

## Activación pendiente: variables protegidas

El editor impidió leer/editar `.env` y `.env.example`. No se comprobó su contenido ni se eludió esa restricción. Aplicar explícitamente en el entorno deseado, sin habilitar otros despliegues automáticamente:

Backend (runtime):

```dotenv
DRAX_REMEMBER_ME_ENABLED=true
DRAX_REFRESH_TOKEN_TTL_SECONDS=2592000
```

Frontend (Vite, build):

```dotenv
VITE_DRAX_REMEMBER_ME_ENABLED=true
```

Las flags requieren el literal `true`; ausentes están deshabilitadas. El TTL es opcional, entero positivo, 2592000 segundos (30 días) por defecto. Es un vencimiento absoluto: renovar no lo extiende. En plantillas compartidas documentar el opt-in, no habilitarlo universalmente.

1. Aplicar el entorno y desplegar/reiniciar primero el backend compatible. Asegurar que el proxy permita POST a refresh/logout y que la cuenta de BD pueda crear/actualizar el almacenamiento privado de Identity. Seguir la política de respaldo; no ejecutar migraciones destructivas.
2. Aplicar la flag Vite, reconstruir y desplegar el frontend; cambiar solo el entorno del servidor no cambia un bundle ya generado.
3. Iniciar sesión nuevamente y marcar «Recordar mi sesión en este dispositivo». Las sesiones normales existentes no se convierten automáticamente.

## Verificación

Desde `front/`: `npm test` y `npm run vuetsc`. Los tests usan store, provider y cliente REST reales con red simulada, reloj fijo y almacenamiento en memoria. Cubren flags ausentes/desactivadas, login normal/opt-in, permisos y rutas públicas, restauración, rechazo de credenciales, perfil ausente, offline, concurrencia sin deadlock y headers nuevos, logout online/offline y respuesta tardía de refresh.

Desde `back/`: `npx --no-install tsc --noEmit -p tsconfig.json`.

Validación ejecutada: 21/21 tests, type-check frontend/backend y build frontend satisfactorios. El build advierte chunks mayores de 500 kB. `npm audit` reportó 24 vulnerabilidades frontend (2 críticas): las críticas incluyen la cadena de desarrollo Vitest/tinypool agregada para las pruebas. El runner se usa solo en modo `run`, sin servidor expuesto. La corrección propuesta por npm salta a Vitest 5 y exige Node/tipos más nuevos; requiere una actualización de tooling separada, no se aplicó `audit fix --force`.

Pendiente de validar en un entorno seguro con flags aplicadas: checkbox en navegador, persistencia con el plugin real tras recargar, login/refresh/logout contra backend y BD reales, vencimiento/reutilización de refresh, usuario inactivo/cambio de contraseña, coordinación entre pestañas y tenant. Las pruebas no usan ni modifican usuarios o bases reales.

## Seguridad y límites

- Los tokens persistidos en `localStorage` son credenciales sensibles, no cookies HttpOnly: usar HTTPS y protección contra XSS.
- Web Locks coordina pestañas cuando está disponible; sin esa API solo hay garantía single-flight dentro de cada pestaña.
- Logout limpia localmente aunque no haya red; la revocación remota necesita conectividad.
- Cada refresh obtiene usuario, estado activo, contraseña, rol y tenant actuales de BD. Inactivar/eliminar al usuario o cambiar su contraseña impide renovar. Los JWT emitidos siguen vigentes hasta expirar: no hay revocación inmediata.
- En una aplicación multi-tenant, renovar vuelve al tenant asignado en BD, no necesariamente al elegido por un switch anterior.
- Desactivar la flag backend bloquea nuevas emisiones/renovaciones, pero no revoca JWT existentes ni borra tokens persistidos. Reactivar puede permitir refresh tokens todavía vigentes; no equivale a revocación masiva.
