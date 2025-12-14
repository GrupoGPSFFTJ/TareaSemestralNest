# 🎨 Eventix - Frontend

Aplicación web moderna desarrollada con React para la gestión de eventos, reservas y administración de usuarios.

---

## 🛠️ Stack Tecnológico

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router DOM 6.20.1
- **HTTP Client**: Axios 1.6.2
- **Estilos**: Tailwind CSS 3.3.6
- **State Management**: Context API
- **Dev Server**: Hot Module Replacement (HMR)

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   └── Navbar.jsx          # Barra de navegación
│   │
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── Login.jsx           # Inicio de sesión
│   │   ├── Register.jsx        # Registro de usuarios
│   │   ├── Dashboard.jsx       # Dashboard principal
│   │   ├── Events.jsx          # Listado de eventos
│   │   ├── EventDetail.jsx     # Detalle de evento
│   │   ├── CreateEvent.jsx     # Crear evento (Organizador)
│   │   ├── MyBookings.jsx      # Mis reservas (Usuario)
│   │   └── Users.jsx           # Gestión usuarios (Admin)
│   │
│   ├── context/                 # Context API
│   │   └── AuthContext.jsx     # Contexto de autenticación
│   │
│   ├── services/                # Servicios y APIs
│   │   └── api.js              # Cliente Axios configurado
│   │
│   ├── App.jsx                  # Componente raíz con rutas
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globales (Tailwind)
│
├── public/                      # Archivos estáticos
├── index.html                   # HTML principal
├── vite.config.js               # Configuración Vite
├── tailwind.config.js           # Configuración Tailwind
├── postcss.config.js            # PostCSS config
└── package.json                 # Dependencias
```

---

## 🚀 Instalación y Ejecución

### Prerequisitos

- Node.js 18 o superior
- npm o yarn
- Backend corriendo en `http://localhost:3000`

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🔐 Configuración de la API

El frontend se conecta al backend mediante Axios. La URL base se configura en:

**`src/services/api.js`**:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000', // ⬅️ Cambiar para producción
  headers: {
    'Content-Type': 'application/json',
  },
})
```

**Para producción**, actualiza la baseURL a tu API desplegada:
```javascript
baseURL: process.env.VITE_API_URL || 'https://tu-api.railway.app',
```

Y crea un archivo `.env`:
```env
VITE_API_URL=https://tu-api-backend.railway.app
```

---

## 🎯 Funcionalidades por Página

### 🔑 Login (`/login`)
- Formulario de inicio de sesión con email y contraseña
- Validación de campos requeridos
- Muestra credenciales de prueba
- Redirección automática al dashboard tras login exitoso
- Manejo de errores de autenticación

### 📝 Register (`/register`)
- Formulario de registro completo
- Validación de:
  - Email válido
  - Contraseña mínimo 6 caracteres
  - Campos obligatorios (firstName, lastName)
- Creación automática de usuario con rol USER
- Login automático tras registro exitoso

### 🏠 Dashboard (`/dashboard`)
- Vista personalizada según el rol del usuario:
  - **USER**: Acceso a eventos y mis reservas
  - **ORGANIZER**: Eventos + Crear evento
  - **ADMIN**: Eventos + Crear evento + Gestión de usuarios
- Cards clicables con navegación directa
- Resumen de funcionalidades disponibles

### 🎉 Events (`/events`)
- Listado completo de todos los eventos
- Información visible:
  - Título y descripción
  - Fecha formateada
  - Ubicación
  - Capacidad
  - Precio en CLP
  - Categoría
- Click en cualquier evento para ver detalles

### 🎫 Event Detail (`/events/:id`)
- Vista detallada del evento seleccionado
- Información completa:
  - Descripción extendida
  - Fecha y hora completas
  - Mapa de ubicación
  - Capacidad disponible
  - Precio destacado
- **Botón "Reservar Ahora"** (solo para USER)
- Validación de disponibilidad en tiempo real
- Confirmación de reserva exitosa

### ➕ Create Event (`/create-event`)
- **Restringido a ORGANIZER y ADMIN**
- Formulario completo con:
  - Título del evento
  - Descripción detallada
  - Fecha y hora (datetime-local)
  - Ubicación
  - Categoría (dropdown)
  - Capacidad (número)
  - Precio (número)
- Validaciones:
  - Todos los campos obligatorios
  - Capacidad mínima: 1
  - Precio mínimo: 0
- Creación inmediata y redirección a listado

### 🎟️ My Bookings (`/my-bookings`)
- **Solo para usuarios con rol USER**
- Historial completo de reservas del usuario
- Información por reserva:
  - Evento asociado
  - Fecha del evento
  - Número de personas
  - Estado (Confirmada, Pendiente, Cancelada)
  - Total pagado
- **Botón "Cancelar Reserva"** para reservas confirmadas
- Actualización automática del listado

### 👥 Users (`/users`)
- **Solo para ADMIN**
- Tabla completa de usuarios del sistema
- Columnas:
  - ID
  - Nombre completo
  - Email
  - Rol (con badge de color)
- **Botón "Eliminar"** para cada usuario
- Confirmación antes de eliminar
- Contador total de usuarios

### 🧭 Navbar
- Visible solo para usuarios autenticados
- Logo clicable que redirige al dashboard
- Links condicionales según rol:
  - **Eventos**: Visible para todos
  - **Crear Evento**: Solo ORGANIZER/ADMIN
  - **Mis Reservas**: Solo USER
  - **Usuarios**: Solo ADMIN
- Información del usuario:
  - Nombre completo
  - Badge con rol
- **Botón "Salir"**: Cierra sesión y limpia localStorage

---

## 🔐 Sistema de Autenticación

### AuthContext

El contexto de autenticación maneja:

- **Estado del usuario**: Información completa del usuario logueado
- **Estado de carga**: Indica si se está verificando la sesión
- **Persistencia**: Guarda token y usuario en `localStorage`
- **Restauración automática**: Al recargar la página, recupera la sesión

**Funciones disponibles**:

```javascript
const { user, loading, login, register, logout } = useAuth()

// Login
await login('email@example.com', 'password')

// Register
await register({ 
  email, 
  password, 
  firstName, 
  lastName 
})

// Logout
logout()
```

### Private Routes

Las rutas están protegidas con un componente `PrivateRoute`:

```javascript
<Route path="/dashboard" element={
  <PrivateRoute><Dashboard /></PrivateRoute>
} />
```

Si el usuario no está autenticado, se redirige automáticamente a `/login`.

---

## 🎨 Diseño y Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS para estilos responsivos y modernos.

**Colores principales**:
- Primary: `indigo-600` (botones, links)
- Success: `green-100` (confirmaciones)
- Error: `red-100` (errores)
- Warning: `yellow-100` (pendientes)

### Responsive Design

Todas las páginas son completamente responsivas:
- **Mobile**: 1 columna
- **Tablet**: 2 columnas (grid)
- **Desktop**: 3 columnas (grid)

---

## 🔄 Flujo de Usuario Típico

### Usuario Normal (USER)

1. **Registro/Login** → Ingresar al sistema
2. **Dashboard** → Ver opciones disponibles
3. **Ver Eventos** → Explorar eventos disponibles
4. **Ver Detalle** → Click en un evento específico
5. **Reservar** → Click en "Reservar Ahora"
6. **Mis Reservas** → Ver confirmación y historial
7. **Cancelar** (opcional) → Cancelar una reserva

### Organizador (ORGANIZER)

1. **Login** → Ingresar con cuenta organizador
2. **Dashboard** → Ver opciones de organizador
3. **Crear Evento** → Formulario de nuevo evento
4. **Ver Eventos** → Ver evento recién creado
5. **Ver Estadísticas** → (Endpoint backend, no UI implementado aún)

### Administrador (ADMIN)

1. **Login** → Ingresar como admin
2. **Dashboard** → Acceso completo
3. **Gestionar Usuarios** → Ver tabla de usuarios
4. **Eliminar Usuario** → Gestión de cuentas
5. **Crear Eventos** → Publicar eventos
6. **Ver Todas las Reservas** → (Endpoint disponible, no UI)

---

## 🧪 Testing Local

### Con el Backend Local

```bash
# Terminal 1: Backend
cd backend
docker-compose up

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Credenciales de Prueba

| Email | Password | Rol |
|-------|----------|-----|
| `admin@eventix.com` | `admin123` | ADMIN |
| `organizer1@eventix.com` | `org123` | ORGANIZER |
| `user1@example.com` | `user123` | USER |

---

## 🚀 Despliegue en Producción

### Vercel (Recomendado)

1. **Instalar Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login y Deploy**:
```bash
vercel login
vercel --prod
```

3. **Variables de entorno en Vercel**:
   - Ve a: Project Settings → Environment Variables
   - Agrega: `VITE_API_URL` con la URL de tu backend

### Netlify

Similar a Vercel, soporta React y Vite out-of-the-box.

### Build Manual

```bash
npm run build
# Los archivos estarán en dist/
# Sube la carpeta dist/ a cualquier hosting estático
```

---

## 📝 Variables de Entorno

Crea un archivo `.env` en la raíz del frontend:

```env
# URL del backend (producción)
VITE_API_URL=https://tu-backend.railway.app

# Otras configuraciones opcionales
VITE_APP_NAME=Eventix
```

**Nota**: Las variables en Vite **deben** empezar con `VITE_` para ser expuestas al cliente.

---

## 🐛 Troubleshooting

### Error: "Network Error" o "CORS"
**Causa**: El backend no está corriendo o tiene problemas de CORS.

**Solución**: 
- Verifica que el backend esté en `http://localhost:3000`
- Revisa la configuración de CORS en NestJS

### Error: "Token expired"
**Causa**: El token JWT expiró.

**Solución**: 
- El interceptor de Axios debería redirigir automáticamente a `/login`
- Si no funciona, limpia el localStorage manualmente

### Página en blanco después del build
**Causa**: Rutas incorrectas en producción.

**Solución**: 
- Verifica que `vite.config.js` tenga `base: '/'`
- Asegúrate de que el servidor soporte SPA routing

---

## 🔧 Scripts Disponibles

```json
{
  "dev": "vite",                    // Desarrollo con HMR
  "build": "vite build",            // Build para producción
  "preview": "vite preview",        // Preview del build
  "lint": "eslint src"              // Linter (si está configurado)
}
```

---

## 📦 Dependencias Principales

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.2",
  "tailwindcss": "^3.3.6"
}
```
