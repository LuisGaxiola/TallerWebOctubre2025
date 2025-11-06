# Guía de Configuración e Instalación

Esta guía te llevará paso a paso para configurar y ejecutar la aplicación de red social.

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)
- **Node.js** (versión 20 o superior) - solo para desarrollo local
- **npm** o **yarn**

## Opción 1: Instalación con Docker (Recomendado)

Esta es la forma más rápida de ejecutar la aplicación.

### Paso 1: Clonar el repositorio

```bash
git clone <tu-repositorio>
cd social-network
```

### Paso 2: Copiar variables de entorno

```bash
cp .env.example .env
```

**Importante:** En producción, cambia el `JWT_SECRET` por una clave segura.

### Paso 3: Iniciar los servicios

```bash
docker-compose up -d
```

Este comando iniciará:

- PostgreSQL (puerto 5432)
- Redis (puerto 6379)
- Minio (puertos 9000, 9001)
- Backend (puerto 3001)
- Frontend (puerto 3000)
- NGINX (puerto 80)

### Paso 4: Verificar que los servicios estén corriendo

```bash
docker-compose ps
```

Deberías ver todos los servicios con estado "Up".

### Paso 5: Esperar a que el backend esté listo

```bash
docker-compose logs -f backend
```

Espera hasta ver el mensaje: `🚀 Server running on http://localhost:3001`

Presiona `Ctrl+C` para salir de los logs.

### Paso 6: Ejecutar migraciones de base de datos

```bash
# Generar migraciones
docker-compose exec backend npm run db:generate

# Aplicar migraciones a la base de datos
docker-compose exec backend npm run db:push
```

### Paso 7: Crear usuario administrador

```bash
docker-compose exec backend npm run db:seed
```

Este comando creará un usuario administrador con las siguientes credenciales:

```
Username: admin
Password: admin123
Email: admin@socialnetwork.com
Role: admin
```

### Paso 8: Acceder a la aplicación

Abre tu navegador y ve a:

- **Aplicación principal:** http://localhost (o http://localhost:3000)
- **API Backend:** http://localhost:3001
- **Minio Console:** http://localhost:9001 (usuario: minioadmin, password: minioadmin)

### Paso 9: Iniciar sesión

1. Ve a http://localhost
2. Haz clic en "Login"
3. Ingresa:
   - Username: `admin`
   - Password: `admin123`
4. Haz clic en "Sign In"

¡Listo! Ya puedes comenzar a usar la aplicación.

## Opción 2: Instalación Local (Para Desarrollo)

Si prefieres ejecutar los servicios localmente sin Docker (útil para desarrollo).

### Paso 1: Instalar dependencias de PostgreSQL, Redis y Minio

Necesitarás tener PostgreSQL, Redis y Minio instalados localmente o ejecutándolos con Docker:

```bash
# Solo los servicios de infraestructura
docker compose up -d postgres redis minio
```

### Paso 2: Configurar backend

```bash
cd web-hono

# Instalar dependencias
npm install

# Copiar variables de entorno
cp ../.env.example .env

# Ajustar las URLs para localhost
# Edita .env y cambia:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/social_network
# REDIS_URL=redis://localhost:6379
# MINIO_ENDPOINT=localhost

# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:push

# Ejecutar seed
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará corriendo en http://localhost:3001

### Paso 3: Configurar frontend

En otra terminal:

```bash
cd web-nuxt

# Instalar dependencias
npm install

# El frontend ya está configurado para usar localhost:3001

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará corriendo en http://localhost:3000

## Usando el Makefile (Comandos útiles)

Si estás en Linux/Mac, puedes usar los comandos del Makefile:

```bash
# Ver todos los comandos disponibles
make help

# Iniciar todos los servicios
make up

# Detener todos los servicios
make down

# Ver logs
make logs

# Ver logs del backend solamente
make logs-backend

# Ejecutar migraciones
make migrate

# Ejecutar seed
make seed

# Abrir shell en el contenedor backend
make shell-backend

# Conectar a PostgreSQL
make psql

# Conectar a Redis
make redis-cli
```

## Comandos Docker Compose Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar un servicio
docker-compose restart backend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡cuidado! borra la base de datos)
docker-compose down -v

# Reconstruir las imágenes
docker-compose build

# Reconstruir y reiniciar
docker-compose up -d --build

# Ver estado de los servicios
docker-compose ps

# Ejecutar un comando en un contenedor
docker-compose exec backend npm run db:seed
docker-compose exec frontend npm install
```

## Accediendo a los Servicios

### PostgreSQL

```bash
# Desde la línea de comandos
docker-compose exec postgres psql -U postgres -d social_network

# Con un cliente GUI
Host: localhost
Port: 5432
Database: social_network
Username: postgres
Password: postgres
```

### Redis

```bash
# Redis CLI
docker-compose exec redis redis-cli

# Comandos útiles de Redis
> KEYS *           # Ver todas las claves
> GET key          # Obtener valor de una clave
> FLUSHALL         # Limpiar toda la base de datos
```

### Minio

Accede a http://localhost:9001

```
Username: minioadmin
Password: minioadmin
```

## Solución de Problemas

### El backend no se conecta a la base de datos

1. Verifica que PostgreSQL esté corriendo:

   ```bash
   docker-compose ps postgres
   ```

2. Verifica los logs de PostgreSQL:

   ```bash
   docker-compose logs postgres
   ```

3. Intenta reiniciar el servicio:
   ```bash
   docker-compose restart postgres backend
   ```

### Error "Port already in use"

Si un puerto ya está en uso, puedes:

1. Cambiar el puerto en `docker-compose.yml`
2. O detener el servicio que está usando ese puerto

```bash
# Ver qué está usando el puerto 3000
lsof -i :3000

# Ver qué está usando el puerto 3001
lsof -i :3001
```

### El frontend no puede conectarse al backend

1. Verifica que el backend esté corriendo:

   ```bash
   curl http://localhost:3001/health
   ```

2. Verifica la variable de entorno en el frontend:
   ```bash
   docker-compose exec frontend env | grep NUXT_PUBLIC_API_URL
   ```

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar todo
docker-compose down -v

# Eliminar imágenes también
docker-compose down -v --rmi all

# Volver a iniciar
docker-compose up -d
make migrate
make seed
```

## Creando más usuarios

### Desde la interfaz web

1. Ve a http://localhost
2. Haz clic en "Register"
3. Llena el formulario
4. Los nuevos usuarios tendrán rol "user" por defecto

### Desde el panel de administración

1. Inicia sesión como admin
2. Ve a "Admin" en el menú
3. Aquí puedes cambiar roles de usuarios existentes

## Próximos Pasos

Una vez que tengas la aplicación corriendo:

1. **Explora la aplicación:** Crea posts, da likes, explora perfiles
2. **Prueba el panel de admin:** Cambia roles, activa/desactiva usuarios
3. **Personaliza:** Modifica los estilos en Tailwind, agrega nuevas características
4. **Aprende:** Revisa el código fuente para entender cómo funciona

## Recursos Adicionales

- [Documentación de Hono](https://hono.dev/)
- [Documentación de tRPC](https://trpc.io/)
- [Documentación de Drizzle ORM](https://orm.drizzle.team/)
- [Documentación de Nuxt](https://nuxt.com/)
- [Documentación de Nuxt UI](https://ui.nuxt.com/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)

## Soporte

Si encuentras algún problema, por favor:

1. Revisa esta guía de solución de problemas
2. Verifica los logs con `docker-compose logs`
3. Abre un issue en el repositorio con:
   - Descripción del problema
   - Logs relevantes
   - Pasos para reproducir
