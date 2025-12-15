FROM node:18-alpine

WORKDIR /app

# Install dependencies (including devDeps needed for build)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Expose the preview port and run Vite preview binding to 0.0.0.0
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
