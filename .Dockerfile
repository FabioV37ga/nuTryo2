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
ARG SERVICE_PORT=3000
ENV PORT=$SERVICE_PORT
RUN if [ "$SERVICE" = "backend" ]; then export PORT=3001; fi
EXPOSE $PORT

# Comando de execução definido dentro do Dockerfile
CMD ["sh", "-c", "if [ \"$SERVICE\" = \"frontend\" ]; then npm run prod:front; else npm run prod:back; fi"]
