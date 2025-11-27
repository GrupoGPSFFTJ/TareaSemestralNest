# Eventix API - Gestión de Eventos y Reservas

## Autores

- Tomás Yévenes
- Johnson Valenzuela
- Fernando Vergara
- Fabián Ferrada

## Descripción

API RESTful para la gestión de eventos, control de aforo y venta de entradas. Permite a los usuarios registrarse, iniciar sesión, ver eventos disponibles y realizar reservas. Los organizadores pueden crear y gestionar eventos, mientras que los administradores tienen acceso completo al sistema.

### Roles Implementados

- **ADMIN**: Acceso completo al sistema.
- **ORGANIZER**: Puede crear, publicar y gestionar sus propios eventos.
- **USER**: Puede ver eventos y realizar reservas (comprar entradas).

### Tecnologías

- NestJS (Node.js framework)
- TypeORM
- SQLite (Base de datos embebida para facilitar portabilidad)
- JWT Authentication (Seguridad)
- Docker & Docker Compose
- Class Validator

---

## Instalación y Ejecución

### Opción A: Docker (Recomendada)

Esta opción levanta todo el entorno encapsulado sin necesidad de instalar Node.js localmente.

1. Asegurarse de tener Docker Desktop instalado y corriendo.
2. Clonar el repositorio y entrar en la carpeta.
3. Ejecutar:
   ```bash
   docker-compose up --build