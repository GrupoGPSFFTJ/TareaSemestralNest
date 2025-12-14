# Dockerfile
FROM node:18-alpine

# Instalar dependencias necesarias para compilar better-sqlite3
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app
# Copiar el código fuente (incluye package.json)
# Copiamos todo antes de instalar para que funcione tanto si el build context
# es la raíz del repo como si es la carpeta backend.
COPY . .

# Instalar dependencias
RUN npm install --production --no-audit --prefer-offline || npm install

# Crear directorio para la base de datos con permisos
RUN mkdir -p /app/data && chmod 777 /app/data

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start:prod"]