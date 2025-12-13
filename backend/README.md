# 🎫 Eventix API - Gestión de Eventos y Reservas

**Propuesta de Tarea Semestral - Desarrollo con NestJS**  
> Una solución robusta para la gestión de aforos, venta de entradas y administración de eventos.

---

## 👥 Equipo de Desarrollo

- Tomás Yévenes
- Johnson Valenzuela
- Fernando Vergara
- Fabián Ferrada

---

## 🚀 Descripción del Proyecto

**Eventix** es una API RESTful diseñada para centralizar la gestión de eventos. Permite a los organizadores publicar eventos y controlar el aforo, mientras que los usuarios pueden explorar y reservar entradas de manera segura.

### 🛡️ Roles y Permisos

- 👑 **ADMIN**: Control total del sistema.
- 📅 **ORGANIZER**: Creación, publicación y gestión de sus propios eventos y estadísticas.
- 👤 **USER**: Exploración de eventos, gestión de perfil y reserva de entradas.

### 🛠️ Stack Tecnológico

- **Framework**: NestJS
- **Base de Datos**: SQLite (Embebida para portabilidad instantánea)
- **ORM**: TypeORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Contenedores**: Docker & Docker Compose

---

## 💻 Instalación y Puesta en Marcha

Elige la opción que mejor se adapte a tu entorno.

### 🐳 Opción A: Docker (Recomendada)

Ideal para probar el sistema sin instalar dependencias locales.

**Requisito:** Tener Docker Desktop corriendo.

1. **Clonar y entrar:**
```bash
git clone https://github.com/GrupoGPSFFTJ/TareaSemestralNest.git
cd TareaSemestralNest
```

2. **Desplegar:**
```bash
docker-compose up --build
```

3. **Listo:** Accede a la API en `http://localhost:3000`

### 📦 Opción B: Ejecución Local

Para desarrollo y depuración.

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar entorno (Opcional):**  
Crea un archivo `.env` en la raíz:
```env
JWT_SECRET=tu_secreto_seguro
PORT=3000
```

3. **Iniciar servidor:**
```bash
npm run start:dev
```

---

## 💾 Datos de Prueba (Seed Automático)

Para facilitar la corrección, el sistema se pobla automáticamente al iniciar si la base de datos está vacía.

### 🔑 Credenciales de Acceso

| Perfil | Email | Contraseña |
|--------|-------|------------|
| Administrador | `admin@eventix.com` | `admin123` |
| Organizador | `organizer1@eventix.com` | `org123` |
| Usuario | `user1@example.com` | `user123` |

**Nota:** También se crean automáticamente 5 eventos de prueba y reservas asociadas.

---

## 🧪 Guía de Pruebas (Postman)

Sigue este flujo para validar las funcionalidades clave.

### 1️⃣ Autenticación

Obtén tu llave de acceso (Token JWT).

- **Método:** `POST`
- **URL:** `http://localhost:3000/auth/login`
- **Body (JSON):**
```json
{
  "email": "organizer1@eventix.com",
  "password": "org123"
}
```

✅ **Acción:** Copia el `access_token` de la respuesta. Úsalo en la pestaña `Authorization` → `Bearer Token` para las siguientes peticiones.

---

### 2️⃣ Gestión de Eventos (Rol Organizador)

Intenta crear un evento protegido.

- **Método:** `POST`
- **URL:** `http://localhost:3000/events`
- **Auth:** Bearer Token (Usa el token del organizador)
- **Body (JSON):**
```json
{
  "title": "Hackathon 2025",
  "description": "Evento de programación intensiva",
  "date": "2025-11-20T09:00:00",
  "location": "Campus Central",
  "capacity": 100,
  "price": 5000,
  "organizerId": 2
}
```

---

### 3️⃣ Nuevas Funcionalidades 

Hemos implementado endpoints especiales solicitados para el contexto del negocio.

#### 📊 Estadísticas del Evento

Permite al organizador ver ganancias y ocupación en tiempo real.

- **Método:** `GET`
- **URL:** `http://localhost:3000/events/1/stats`
- **Auth:** Requiere Token de Organizador o Admin.

#### 🎫 Mis Reservas

Permite al usuario ver su historial de compras.

- **Método:** `GET`
- **URL:** `http://localhost:3000/bookings/my-bookings`
- **Auth:** Requiere Token de Usuario Normal.

---

### 4️⃣ Realizar Reserva

- **Método:** `POST`
- **URL:** `http://localhost:3000/bookings`
- **Auth:** Requiere Token de Usuario.
- **Body (JSON):**
```json
{
  "eventId": 1,
  "userId": 4,
  "quantity": 2
}
```
