# Eventix API - Gestión de Eventos y Reservas

## Autores

- Tomás Yévenes
- Johnson Valenzuela
- Fernando Vergara
- Fabián Ferrada

## Descripción

API RESTful para la gestión de eventos, control de aforo y venta de entradas. Permite a los usuarios registrarse, iniciar sesión, ver eventos disponibles y realizar reservas. Los organizadores pueden crear y gestionar eventos, mientras que los administradores tienen acceso completo al sistema.

### Roles Implementados

- **ADMIN**: Acceso completo al sistema
- **ORGANIZER**: Puede crear y gestionar sus propios eventos
- **USER**: Puede ver eventos y realizar reservas

### Tecnologías

- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Docker & Docker Compose
- Class Validator

## Instalación y Ejecución

### Opción A: Docker (Recomendada)

1. Asegurarse de tener Docker y Docker Compose instalados
2. Clonar el repositorio:
```bash
git clone https://github.com/GrupoGPSFFTJ/TareaSemestralNest.git
cd TareaSemestralNest
```

3. Ejecutar con Docker:
```bash
docker-compose up --build
```

4. La API estará disponible en `http://localhost:3000`

### Opción B: Instalación Local

1. Clonar el repositorio:
```bash
git clone https://github.com/GrupoGPSFFTJ/TareaSemestralNest.git
cd TareaSemestralNest
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (crear archivo `.env`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=eventix
JWT_SECRET=tu_clave_secreta_aqui
PORT=3000
```

4. Asegurarse de tener PostgreSQL ejecutándose

5. Ejecutar el proyecto:
```bash
npm run start:dev
```

## Guía de Pruebas en Postman

### 1. Configuración Inicial

1. Crear una variable de entorno `{{baseUrl}}` con valor `http://localhost:3000`
2. Crear una variable `{{token}}` para almacenar el token JWT

### 2. Registro de Usuario (POST)

**Endpoint:** `{{baseUrl}}/auth/register`

**Body (JSON):**
```json
{
  "email": "usuario@test.com",
  "password": "123456",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Nota:** El body debe usar `firstName` y `lastName` (no `fullName`).

### 3. Login (POST)

**Endpoint:** `{{baseUrl}}/auth/login`

**Body (JSON):**
```json
{
  "email": "usuario@test.com",
  "password": "123456"
}
```

**IMPORTANTE:** Copiar el `access_token` y guardarlo en la variable `{{token}}` de Postman.

### 4. Verificar Perfil / Check Status (GET)

**Endpoint:** `{{baseUrl}}/auth/profile`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Nota:** Este endpoint equivale al "Check Status". Verifica que el token sea válido.

### 5. Pruebas de Roles

#### Crear Evento (Solo ORGANIZER/ADMIN)

**Endpoint:** `{{baseUrl}}/events` (POST)

**Headers:**
```
Authorization: Bearer {{token}}
```

**Body (JSON):**
```json
{
  "title": "Festival de Verano",
  "description": "Gran festival al aire libre",
  "location": "Parque O'Higgins",
  "date": "2025-12-20T18:00:00Z",
  "capacity": 5000,
  "price": 30000
}
```