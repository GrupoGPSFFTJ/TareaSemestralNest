# Levantar frontend y backend con Docker Compose

Estos pasos construyen y levantan ambos servicios en tu máquina local usando Docker Compose.

Requisitos:
- Docker y Docker Compose instalados.

Comandos:

1) Construir y levantar (en modo foreground):

```bash
docker compose up --build
```

2) Levantar en background (detached):

```bash
docker compose up --build -d
```

3) Ver logs:

```bash
docker compose logs -f
```

4) Parar y eliminar contenedores:

```bash
docker compose down
```

Notas importantes:
- El backend escuchará en `http://localhost:3000`.
- El frontend se servirá desde `http://localhost:5173` (nginx en el contenedor mapeado a ese puerto).
- El archivo SQLite del backend se persiste en `./backend/data` en la máquina host.
- Si cambias la URL/puertos, actualiza `FRONTEND_URL` en la sección `environment` del servicio `backend` en `docker-compose.yml`.
- Si planeas usar esto en producción, considera cambiar SQLite por una base de datos gestionada (Postgres) y almacenar secretos en variables de entorno.
