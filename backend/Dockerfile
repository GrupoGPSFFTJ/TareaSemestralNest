# Dockerfile
FROM node:18-alpine

# Instalar dependencias necesarias para compilar better-sqlite3
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Crear directorio para la base de datos con permisos
RUN mkdir -p /app/data && chmod 777 /app/data

# Construir la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "run", "start:prod"]