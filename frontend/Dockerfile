# Frontend Dockerfile - build with Vite then serve with nginx
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy sources
COPY . .

# Allow building with a VITE_API_URL build-arg
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build
RUN npm run build

FROM nginx:stable-alpine

# Copy built files to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
