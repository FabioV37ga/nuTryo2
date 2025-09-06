# Dockerfile único atualizado para Node 24.3.1
FROM node:24.3.1-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./
RUN npm install

# Recebe qual serviço buildar: frontend ou backend
ARG SERVICE
COPY . .

# Build do serviço selecionado
RUN if [ "$SERVICE" = "frontend" ]; then npm run prod:front; \
    elif [ "$SERVICE" = "backend" ]; then npm run prod:back; \
    else echo "SERVICE não definido. Use --build-arg SERVICE=frontend ou backend" && exit 1; \
    fi

# Expor porta correspondente
ENV PORT=3000
RUN if [ "$SERVICE" = "backend" ]; then export PORT=3001; fi
EXPOSE $PORT

# Comando padrão
CMD if [ "$SERVICE" = "frontend" ]; then npm run prod:front; \
    else npm run prod:back; \
    fi