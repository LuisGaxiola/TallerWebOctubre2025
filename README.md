# Red Social - CRUD Completo

Una aplicación de red social moderna con autenticación, RBAC, y funcionalidad completa de CRUD para posts y likes.

## 🚀 Stack Tecnológico

### Backend

- **Hono.js** - Framework web rápido y ligero
- **tRPC** - Type-safe API
- **Drizzle ORM** - ORM TypeScript-first
- **PostgreSQL** - Base de datos
- **Redis** - Cache y sesiones
- **Minio** - Almacenamiento de objetos
- **Bcrypt** - Hash de contraseñas
- **JWT** - Autenticación

### Frontend

- **Nuxt 4** - Framework Vue.js
- **Nuxt UI** - Componentes UI
- **Tailwind CSS 4** - Estilos
- **TypeScript** - Type safety

### Infraestructura

- **Docker** - Contenedorización
- **Docker Compose** - Orquestación
- **NGINX** - Reverse proxy

## 📋 Características

- ✅ Autenticación basada en usuario/contraseña
- ✅ RBAC (Role-Based Access Control) con roles: admin, moderator, user
- ✅ CRUD completo de posts
- ✅ Sistema de likes
- ✅ Perfiles de usuario
- ✅ Panel de administración
- ✅ UI responsiva y moderna

## 🏗️ Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts      # Esquemas Drizzle
│   │   │   ├── index.ts       # Configuración DB
│   │   │   └── seed.ts        # Seed de admin
│   │   ├── trpc/
│   │   │   ├── index.ts       # Configuración tRPC
│   │   │   ├── context.ts     # Context tRPC
│   │   │   └── routers/
│   │   │       ├── auth.ts    # Router de autenticación
│   │   │       ├── posts.ts   # Router de posts
│   │   │       ├── users.ts   # Router de usuarios
│   │   │       └── index.ts   # App router
│   │   └── index.ts           # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   └── Dockerfile
├── frontend/
│   ├── pages/
│   │   ├── index.vue          # Feed
│   │   ├── login.vue          # Login
│   │   ├── register.vue       # Registro
│   │   ├── profile.vue        # Perfil
│   │   ├── admin.vue          # Panel admin
│   │   └── posts/
│   │       ├── new.vue        # Crear post
│   │       ├── my.vue         # Mis posts
│   │       ├── [id].vue       # Ver post
│   │       └── [id]/
│   │           └── edit.vue   # Editar post
│   ├── layouts/
│   │   └── default.vue        # Layout principal
│   ├── middleware/
│   │   ├── auth.ts            # Middleware auth
│   │   ├── admin.ts           # Middleware admin
│   │   └── guest.ts           # Middleware guest
│   ├── composables/
│   │   ├── useAuth.ts         # Composable auth
│   │   └── useTrpc.ts         # Cliente tRPC
│   ├── package.json
│   ├── nuxt.config.ts
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## 🚀 Inicio Rápido

### Prerequisitos

- Docker y Docker Compose instalados
- Node.js 20+ (para desarrollo local)

### Instalación y Ejecución

1. **Clonar el repositorio**

```bash
git clone <repo-url>
cd social-network
```

2. **Iniciar servicios con Docker Compose**

```bash
docker-compose up -d
```

Esto iniciará todos los servicios:

- PostgreSQL (puerto 5432)
- Redis (puerto 6379)
- Minio (puertos 9000, 9001)
- Backend (puerto 3001)
- Frontend (puerto 3000)
- NGINX (puerto 80)

3. **Esperar a que los servicios estén listos**

```bash
docker-compose logs -f backend
```

4. **Ejecutar migraciones y seed**

```bash
# Entrar al contenedor del backend
docker-compose exec backend sh

# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:push

# Ejecutar seed (crear usuario admin)
npm run db:seed
```

5. **Acceder a la aplicación**

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Minio Console: http://localhost:9001

### Usuario Admin por Defecto

```
Username: admin
Password: admin123
Email: admin@socialnetwork.com
```

## 🛠️ Desarrollo Local

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📊 Esquema de Base de Datos

### Tabla: users

- id (UUID)
- username (string, unique)
- email (string, unique)
- password (string, hashed)
- role (enum: admin, moderator, user)
- firstName (string, optional)
- lastName (string, optional)
- bio (text, optional)
- avatarUrl (string, optional)
- isActive (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

### Tabla: posts

- id (UUID)
- userId (UUID, FK)
- title (string)
- content (text)
- imageUrl (string, optional)
- isPublished (boolean)
- likesCount (integer)
- createdAt (timestamp)
- updatedAt (timestamp)

### Tabla: likes

- id (UUID)
- userId (UUID, FK)
- postId (UUID, FK)
- createdAt (timestamp)
- UNIQUE constraint en (userId, postId)

## 🔐 Roles y Permisos

### User (Usuario)

- Crear posts
- Editar sus propios posts
- Eliminar sus propios posts
- Dar/quitar likes
- Ver su perfil
- Actualizar su perfil

### Moderator (Moderador)

- Todos los permisos de User
- Editar posts de otros usuarios
- Eliminar posts de otros usuarios

### Admin (Administrador)

- Todos los permisos de Moderator
- Ver lista de usuarios
- Cambiar roles de usuarios
- Activar/desactivar usuarios
- Acceso al panel de administración

## 🔧 Variables de Entorno

### Backend

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/social_network
REDIS_URL=redis://redis:6379
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
PORT=3001
```

### Frontend

```env
NUXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 API Endpoints (tRPC)

### Auth

- `auth.register` - Registrar nuevo usuario
- `auth.login` - Iniciar sesión
- `auth.me` - Obtener usuario actual

### Posts

- `posts.list` - Listar posts (público)
- `posts.getById` - Obtener post por ID (público)
- `posts.create` - Crear post (requiere auth)
- `posts.update` - Actualizar post (requiere auth)
- `posts.delete` - Eliminar post (requiere auth)
- `posts.toggleLike` - Dar/quitar like (requiere auth)
- `posts.myPosts` - Mis posts (requiere auth)

### Users

- `users.list` - Listar usuarios (requiere admin)
- `users.getById` - Obtener usuario por ID (público)
- `users.updateProfile` - Actualizar perfil (requiere auth)
- `users.updateRole` - Cambiar rol (requiere admin)
- `users.toggleActive` - Activar/desactivar (requiere admin)

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Despliegue

### Producción

1. Actualizar variables de entorno en `docker-compose.yml`
2. Cambiar `JWT_SECRET` por una clave segura
3. Configurar SSL en NGINX
4. Ejecutar:

```bash
docker-compose -f docker-compose.yml up -d --build
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## 📄 Licencia

MIT License

## 👥 Autores

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter)

## 🙏 Agradecimientos

- Hono.js team
- tRPC team
- Nuxt team
- Drizzle ORM team
