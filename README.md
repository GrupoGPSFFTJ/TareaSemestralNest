# 🎫 Eventix - Sistema de Gestión de Eventos

**Tarea Semestral - Desarrollo con NestJS**  
> Plataforma completa para la gestión de eventos, control de aforo y venta de entradas con frontend y backend integrados.

---

## 👥 Equipo de Desarrollo

- Tomás Yévenes
- Johnson Valenzuela
- Fernando Vergara
- Fabián Ferrada

---

## 🚀 Descripción del Proyecto

**Eventix** es una plataforma full-stack que permite a organizadores publicar y gestionar eventos mientras los usuarios pueden explorar, reservar y administrar sus entradas de manera segura. El sistema implementa autenticación JWT y control de acceso basado en roles.

### 🎯 Funcionalidades Principales

- ✅ **Autenticación y Autorización**: Sistema completo de registro/login con JWT
- ✅ **Gestión de Eventos**: CRUD completo con control de aforo y capacidad
- ✅ **Sistema de Reservas**: Los usuarios pueden reservar entradas con validación de disponibilidad
- ✅ **Roles Diferenciados**: ADMIN, ORGANIZER y USER con permisos específicos
- ✅ **Estadísticas en Tiempo Real**: Dashboard con métricas de ocupación y ganancias
- ✅ **Panel de Administración**: Gestión completa de usuarios y eventos
- ✅ **Interfaz Responsive**: Frontend moderno con React y Tailwind CSS

### 🛡️ Roles y Permisos

- 👑 **ADMIN**: Control total del sistema, gestión de usuarios y eventos
- 📅 **ORGANIZER**: Creación y gestión de sus propios eventos, acceso a estadísticas
- 👤 **USER**: Exploración de eventos, reserva de entradas y gestión de perfil

---

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: NestJS v9
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **ORM**: TypeORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: class-validator, class-transformer
- **Contenedores**: Docker & Docker Compose

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Estilos**: Tailwind CSS 3
- **State Management**: Context API

---

## 📁 Estructura del Proyecto

```
TareaSemestralNest/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/        # Autenticación JWT
│   │   ├── users/       # Gestión de usuarios
│   │   ├── events/      # Gestión de eventos
│   │   ├── bookings/    # Sistema de reservas
│   │   └── seed/        # Datos de prueba
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md        # Documentación del backend
│
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Navbar, etc.
│   │   ├── pages/       # Login, Dashboard, Events, etc.
│   │   ├── context/     # AuthContext
│   │   └── services/    # API client
│   └── README.md        # Documentación del frontend
│
└── README.md           # Este archivo
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- Docker Desktop (para opción Docker)
- npm o yarn

### Opción 1: Ejecución con Docker (Recomendada)

```bash
# Clonar el repositorio
git clone https://github.com/GrupoGPSFFTJ/TareaSemestralNest.git
cd TareaSemestralNest

# Iniciar el backend
cd backend
docker-compose up --build

# En otra terminal, iniciar el frontend
cd frontend
npm install
npm run dev
```

**Accesos:**
- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:5173`

### Opción 2: Ejecución Local

#### Backend
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Credenciales de Prueba

El sistema incluye datos de prueba (seed) que se cargan automáticamente:

| Rol | Email | Contraseña |
|-----|-------|------------|
| 👑 Administrador | `admin@eventix.com` | `admin123` |
| 📅 Organizador | `organizer1@eventix.com` | `org123` |
| 👤 Usuario | `user1@example.com` | `user123` |

**Nota**: También se crean 5 eventos de prueba y varias reservas de ejemplo.

---

## 📚 Documentación Detallada

Para instrucciones detalladas sobre instalación, configuración y uso:

- **[Backend README](./backend/README.md)**: Documentación completa de la API, endpoints, Docker, variables de entorno
- **[Frontend README](./frontend/README.md)**: Guía de instalación, estructura de componentes, configuración

---

## 🌐 Enlaces de Producción

**🔗 Aplicación Desplegada**: [URL del frontend en producción]  
**🔗 API Backend**: [URL del backend en producción]  
**🔗 Repositorio GitHub**: https://github.com/GrupoGPSFFTJ/TareaSemestralNest

---

## 📋 Funcionalidades Implementadas

### Autenticación y Usuarios
- [x] Registro de usuarios con validación
- [x] Login con JWT
- [x] Perfil de usuario protegido
- [x] Gestión de usuarios (ADMIN)
- [x] Sistema de roles y permisos

### Gestión de Eventos
- [x] Listado de eventos públicos
- [x] Detalle de evento individual
- [x] Crear evento (ORGANIZER/ADMIN)
- [x] Editar y eliminar eventos propios
- [x] Filtrado por categoría y fecha
- [x] Control de capacidad y aforo

### Sistema de Reservas
- [x] Reservar entradas con validación de disponibilidad
- [x] Ver mis reservas (historial)
- [x] Cancelar reservas
- [x] Estados de reserva (PENDING, CONFIRMED, CANCELLED)
- [x] Validación de cupos disponibles

### Estadísticas y Reportes
- [x] Dashboard personalizado por rol
- [x] Estadísticas por evento (ocupación, ganancias)
- [x] Métricas en tiempo real

---

## 🤝 Contribución

Este proyecto fue desarrollado como tarea semestral por el equipo mencionado arriba.

---

## 📄 Licencia

Proyecto académico - Universidad [Nombre de tu universidad]
