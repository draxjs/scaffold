# Drax — Instalación de servidor Ubuntu

**Objetivo:** preparar un Ubuntu 22.04/24.04 LTS para ejecutar aplicaciones Drax (Node + PM2) y MongoDB en Docker.

> Ejecutar como usuario normal con permisos `sudo` (no como `root`). Las claves de MongoDB son ejemplos: reemplazarlas antes de iniciar el contenedor. MongoDB se publica solamente en localhost.

## 1. Paquetes básicos

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git ca-certificates gnupg unzip build-essential openssl
```

## 2. NVM y Node.js 24

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 24
nvm alias default 24
node -v && npm -v && nvm --version
```

> NVM se instala **por usuario**: usar para despliegues el mismo usuario que administra PM2.

## 3. PM2 y rotación de logs

```bash
npm install -g pm2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 14
pm2 set pm2-logrotate:compress true
pm2 startup
```

`pm2 startup` muestra otro comando que hay que ejecutar con `sudo`; **copiar y ejecutar exactamente ese comando**. Luego:

```bash
pm2 save
pm2 ls
pm2 conf pm2-logrotate
```

> Después de cambiar la versión de Node por NVM, puede ser necesario regenerar el servicio de arranque de PM2.

## 4. Docker Engine y Docker Compose V2

```bash
sudo apt update
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF_DOCKER
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF_DOCKER

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

**Cerrar sesión SSH y volver a entrar** para aplicar el grupo `docker`; luego:

```bash
docker --version
docker compose version
docker run --rm hello-world
```

> Agregar un usuario al grupo `docker` le otorga privilegios equivalentes a root sobre el host. Hacerlo solo con usuarios de confianza.

## 5. MongoDB 8 en Docker

Crear directorio:

```bash
sudo mkdir -p /opt/drax/mongodb/init
sudo chown -R "$USER":"$USER" /opt/drax
cd /opt/drax/mongodb
```

Crear el archivo `.env` (**cambiar la contraseña antes de iniciar**):

```bash
cat > .env <<'EOF_ENV'
MONGO_ROOT_USER=root
MONGO_ROOT_PASSWORD=CAMBIAR_POR_PASSWORD_SEGURA
MONGO_DATABASE=drax_db
EOF_ENV
chmod 600 .env
```

Crear `compose.yaml`:

```yaml
services:
  mongodb:
    image: mongo:8
    container_name: drax-mongodb
    restart: unless-stopped
    ports:
      - "127.0.0.1:27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DATABASE}
    volumes:
      - mongo_data:/data/db
      - ./init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "mongosh --quiet --username \"$$MONGO_INITDB_ROOT_USERNAME\" --password \"$$MONGO_INITDB_ROOT_PASSWORD\" --authenticationDatabase admin --eval 'db.adminCommand({ ping: 1 }).ok' | grep -q 1"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  mongo_data:
```

Crear `init/01-create-db.js` para que exista una DB desde el primer arranque:

```javascript
const database = process.env.MONGO_INITDB_DATABASE || 'drax_db';
const appDb = db.getSiblingDB(database);
appDb.createCollection('_init');
```

**Opción de creación de archivos directamente en la terminal:** guardar `compose.yaml` y `init/01-create-db.js` con `nano`, pegar el contenido anterior y guardar con `Ctrl+O`, `Enter`, `Ctrl+X`.

Iniciar y comprobar:

```bash
cd /opt/drax/mongodb
docker compose config
docker compose up -d
docker compose ps
docker compose logs --tail=50 mongodb
```

Ingresar a MongoDB (la clave se solicita en la consola):

```bash
docker exec -it drax-mongodb mongosh -u root -p --authenticationDatabase admin
```

Dentro de `mongosh`:

```javascript
show dbs
use drax_db
show collections
```

**URI para Node ejecutándose en el host:**

```text
mongodb://root:TU_PASSWORD@127.0.0.1:27017/drax_db?authSource=admin
```

> Si la contraseña contiene caracteres reservados en una URI (`@`, `:`, `/`, `#`, etc.), codificarla con percent-encoding al formar el connection string.
>
> `MONGO_INITDB_DATABASE` no crea por sí solo la base: el script de inicialización crea la colección `_init`. Los scripts `init` corren solo cuando el volumen de datos es nuevo. Cambiar el `.env` después no cambia la clave del usuario MongoDB ya creado.

## 6. Repositorios Drax

```bash
mkdir -p ~/projects && cd ~/projects
git clone --recurse-submodules https://github.com/draxjs/scaffold.git
git clone --recurse-submodules https://github.com/draxjs/modules.git
```

> Para producción, normalmente se despliega el **repositorio del proyecto concreto** basado en scaffold, no necesariamente el scaffold genérico ni el monorepo de módulos. Verificar scripts y variables del proyecto antes de iniciar.

## 7. PM2 — uso habitual

```bash
# En el directorio del proyecto, si tiene ecosystem.config.cjs:
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 ls
pm2 logs --lines 100
pm2 restart all
pm2 monit
```

El scaffold incluye `ecosystem.config.example.cjs` y scripts `pm2-start.sh`, `pm2-stop.sh`, `deploy.sh`. Adaptar el ecosystem de cada proyecto y revisar dichos scripts antes de ejecutar.

## 8. Verificaciones rápidas

```bash
node -v
npm -v
pm2 -v
pm2 ls
pm2 conf pm2-logrotate
docker --version
docker compose version
docker ps
sudo systemctl is-enabled docker
ss -lnt | grep 27017
```

## 9. Pendientes antes de considerar producción

- Configurar `.env` propios de frontend/backend, puertos, dominios y CORS.
- Reverse proxy Apache/Nginx/HAProxy y HTTPS con Let's Encrypt si la app se expone públicamente.
- Backups programados de MongoDB **y prueba de restauración**; el volumen persistente no es un backup.
- Firewall, acceso SSH con clave, actualizaciones de seguridad y monitorización.
- Preferir credenciales de aplicación con permisos limitados, distintas del usuario administrador `root`.
- No versionar `.env` ni contraseñas, fijar versiones de imágenes para despliegues reproducibles y planificar actualizaciones.

## Referencias

- https://github.com/draxjs/scaffold
- https://github.com/draxjs/modules
- https://github.com/nvm-sh/nvm
- https://docs.docker.com/engine/install/ubuntu/
- https://hub.docker.com/_/mongo
- https://www.npmjs.com/package/pm2-logrotate
