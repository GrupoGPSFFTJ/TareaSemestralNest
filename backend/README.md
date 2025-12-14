# 🎫 Eventix API - Backend

API RESTful desarrollada con NestJS para la gestión de eventos, reservas y usuarios con autenticación JWT.

---

## 🛠️ Stack Tecnológico

- **Framework**: NestJS 9.4.3
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **ORM**: TypeORM 0.3.17
- **Autenticación**: JWT con Passport
- **Validación**: class-validator, class-transformer
- **Seguridad**: bcrypt para hash de contraseñas
- **Contenedores**: Docker & Docker Compose

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── auth/                    # Módulo de autenticación
│   │   ├── strategies/          # JWT Strategy
│   │   ├── guards/              # Guards de protección
│   │   ├── decorators/          # Decoradores personalizados
│   │   └── dto/                 # DTOs de login/register
│   │
│   ├── users/                   # Módulo de usuarios
│   │   ├── entities/            # User entity
│   │   ├── dto/                 # DTOs de usuario
│   │   └── users.service.ts     # Lógica de negocio
│   │
│   ├── events/                  # Módulo de eventos
│   │   ├── entities/            # Event entity
│   │   ├── dto/                 # DTOs de eventos
│   │   └── events.service.ts    # CRUD y estadísticas
│   │
│   ├── bookings/                # Módulo de reservas
│   │   ├── entities/            # Booking entity
│   │   ├── dto/                 # DTOs de reservas
│   │   └── bookings.service.ts  # Gestión de reservas
│   │
│   ├── seed/                    # Datos de prueba
│   │   └── seed.service.ts      # Población automática
│   │
│   ├── common/                  # Utilidades compartidas
│   │   └── dto/                 # DTOs comunes
│   │
│   ├── app.module.ts            # Módulo raíz
│   └── main.ts                  # Entry point
│
├── Dockerfile                   # Imagen Docker
├── docker-compose.yml           # Orquestación
├── tsconfig.json                # Config TypeScript
├── nest-cli.json                # Config NestJS
└── package.json                 # Dependencias
```

---

## 🚀 Instalación y Ejecución

### Opción 1: Docker (Recomendada)

**Requisito**: Docker Desktop instalado y corriendo.

```bash
# Construir y levantar contenedor
docker-compose up --build

# Para ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La API estará disponible en `http://localhost:3000`

### Opción 2: Ejecución Local

```bash
# Instalar dependencias
npm install

# Desarrollo con hot-reload
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz de backend:

```env
# JWT Configuration
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion

# Server Configuration
PORT=3000
NODE_ENV=development

# Database (solo para producción con PostgreSQL)
DATABASE_URL=postgresql://usuario:contraseña@host:5432/eventix_db
```

**Nota**: Para desarrollo con SQLite no necesitas configurar DATABASE_URL.

---

## 💾 Base de Datos

### Desarrollo (SQLite)
- La base de datos se crea automáticamente en `./data/database.sqlite`
- No requiere instalación ni configuración adicional
- Incluye seed automático con datos de prueba

### Producción (PostgreSQL)
Para desplegar en producción, cambia en `app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true, // ⚠️ Cambiar a false en producción
})
```

---

## 🔑 Credenciales de Prueba (Seed)

El sistema se auto-puebla al iniciar con los siguientes usuarios:

| Rol | Email | Contraseña | Descripción |
|-----|-------|------------|-------------|
| ADMIN | `admin@eventix.com` | `admin123` | Control total del sistema |
| ORGANIZER | `organizer1@eventix.com` | `org123` | Puede crear eventos |
| USER | `user1@example.com` | `user123` | Usuario normal |

**Datos adicionales creados**:
- 5 eventos de diferentes categorías
- 10+ reservas de ejemplo
- Usuarios adicionales de prueba

---

## 📡 Endpoints de la API

### 🔐 Autenticación (`/auth`)

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Registrar nuevo usuario |
| POST | `/auth/login` | No | Iniciar sesión y obtener JWT |
| GET | `/auth/profile` | Sí | Obtener perfil del usuario actual |

### 👥 Usuarios (`/users`)

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| GET | `/users` | Sí | ADMIN | Listar todos los usuarios |
| GET | `/users/:id` | Sí | ADMIN | Ver usuario específico |
| PATCH | `/users/:id` | Sí | ADMIN | Actualizar usuario |
| DELETE | `/users/:id` | Sí | ADMIN | Eliminar usuario |

### 🎉 Eventos (`/events`)

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| GET | `/events` | No | - | Listar todos los eventos |
| GET | `/events/:id` | No | - | Ver evento específico |
| POST | `/events` | Sí | ORGANIZER/ADMIN | Crear evento |
| PATCH | `/events/:id` | Sí | ORGANIZER/ADMIN | Actualizar evento propio |
| DELETE | `/events/:id` | Sí | ORGANIZER/ADMIN | Eliminar evento propio |
| GET | `/events/:id/stats` | Sí | ORGANIZER/ADMIN | Estadísticas del evento |

### 🎫 Reservas (`/bookings`)

| Método | Endpoint | Auth | Rol | Descripción |
|--------|----------|------|-----|-------------|
| GET | `/bookings` | Sí | ADMIN | Listar todas las reservas |
| GET | `/bookings/my-bookings` | Sí | USER | Mis reservas |
| GET | `/bookings/:id` | Sí | - | Ver reserva específica |
| POST | `/bookings` | Sí | USER | Crear reserva |
| PATCH | `/bookings/:id` | Sí | - | Actualizar estado de reserva |
| DELETE | `/bookings/:id` | Sí | - | Cancelar reserva |

---

## 🧪 Guía de Pruebas con Postman

### 1️⃣ Obtener Token JWT

**Endpoint**: `POST http://localhost:3000/auth/login`

**Body (JSON)**:
```json
{
  "email": "organizer1@eventix.com",
  "password": "org123"
}
```

**Respuesta**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "organizer1@eventix.com",
    "firstName": "Carlos",
    "lastName": "Organizador",
    "role": "ORGANIZER"
  }
}
```

**Acción**: Copia el `access_token` y ve a la pestaña **Authorization** → Selecciona **Bearer Token** → Pega el token.

---

### 2️⃣ Crear un Evento

**Endpoint**: `POST http://localhost:3000/events`  
**Auth**: Bearer Token (Organizador o Admin)

**Body (JSON)**:
```json
{
  "title": "Conferencia de Tecnología 2025",
  "description": "Evento anual de innovación y desarrollo",
  "date": "2025-12-20T10:00:00",
  "location": "Centro de Convenciones",
  "category": "CONFERENCE",
  "capacity": 200,
  "price": 15000
}
```

---

### 3️⃣ Obtener Estadísticas de Evento

**Endpoint**: `GET http://localhost:3000/events/1/stats`  
**Auth**: Bearer Token (Organizador/Admin)

**Respuesta**:
```json
{
  "eventId": 1,
  "eventTitle": "Tech Conference 2024",
  "totalCapacity": 500,
  "totalBookings": 45,
  "confirmedBookings": 40,
  "pendingBookings": 3,
  "cancelledBookings": 2,
  "occupancyRate": 9.0,
  "availableSeats": 455,
  "totalRevenue": 600000,
  "potentialRevenue": 750000
}
```

---

### 4️⃣ Crear Reserva

**Endpoint**: `POST http://localhost:3000/bookings`  
**Auth**: Bearer Token (Usuario)

**Body (JSON)**:
```json
{
  "eventId": 1,
  "numberOfPeople": 2
}
```

**Validaciones automáticas**:
- Verifica disponibilidad de cupos
- Calcula el costo total
- Asigna el usuario autenticado automáticamente
- Establece estado inicial como CONFIRMED

---

### 5️⃣ Ver Mis Reservas

**Endpoint**: `GET http://localhost:3000/bookings/my-bookings`  
**Auth**: Bearer Token (Usuario)

**Respuesta**:
```json
[
  {
    "id": 1,
    "numberOfPeople": 2,
    "status": "CONFIRMED",
    "event": {
      "id": 1,
      "title": "Tech Conference 2024",
      "date": "2024-11-15T10:00:00.000Z",
      "location": "Centro de Convenciones",
      "price": 15000
    }
  }
]
```

---

## 🔒 Sistema de Autenticación

### Guards Implementados

1. **JwtAuthGuard**: Valida token JWT en el header
2. **RolesGuard**: Verifica permisos de rol
3. **BasicAuthGuard**: Autenticación básica (opcional)

### Decoradores Personalizados

- `@GetUser()`: Obtiene el usuario autenticado del request
- `@Roles('ADMIN', 'ORGANIZER')`: Define roles permitidos

### Ejemplo de Uso

```typescript
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ORGANIZER', 'ADMIN')
async create(@Body() dto: CreateEventDto, @GetUser() user: User) {
  return this.eventsService.create(dto, user);
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
**Solución**: Verifica que la carpeta `./data` tenga permisos de escritura.

```bash
mkdir -p data
chmod 777 data
```

### Error: "Port 3000 already in use"
**Solución**: Cambia el puerto en `.env` o detén el proceso en 3000.

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "JWT must be provided"
**Solución**: Asegúrate de incluir el header `Authorization: Bearer <token>` en peticiones protegidas.

---

## 🚀 Despliegue en Producción

### Railway (Recomendado)

1. Crear cuenta en [Railway.app](https://railway.app)
2. Crear nuevo proyecto desde GitHub
3. Agregar servicio PostgreSQL
4. Configurar variables de entorno:
   - `JWT_SECRET`: Tu secreto seguro
   - `DATABASE_URL`: URL de PostgreSQL (automática)
   - `PORT`: 3000
5. Cambiar `synchronize: false` en producción
6. Deploy automático en cada push

### Render

Similar a Railway, soporta Docker y PostgreSQL.

---
