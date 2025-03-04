# Etapa 1: Compilación de la aplicación Angular
FROM node:20-alpine as builder

ARG PROJECT_NAME

WORKDIR /app

COPY ../package.json ./

RUN npm install --force

COPY ../ .

# Construye la aplicación Angular
RUN npm run build

# Etapa 2: Configuración del servidor de producción
FROM node:18-alpine

ARG PROJECT_NAME

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist/$PROJECT_NAME/ ./

# Expone el puerto en el que el servidor escuchará
EXPOSE 8080

# Comando para iniciar la aplicación con SSR
CMD ["node", "server/entry-server.mjs"]
