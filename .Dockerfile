# Use Node 24.3-alpine
FROM node:24.3-alpine

WORKDIR /app

# Copiar package.json e package-lock.json e instalar dependências
COPY package*.json ./
RUN npm install

# Definir qual serviço buildar: frontend ou backend (padrão: backend)
ARG SERVICE=backend
COPY . .

# Build do serviço selecionado
RUN if [ "$SERVICE" = "frontend" ]; then npm run prod:front; \
    elif [ "$SERVICE" = "backend" ]; then npm run prod:back; \
    else echo "SERVICE não definido. Use --build-arg SERVICE=frontend ou backend" && exit 1; \
    fi

# Definir a porta do container
ENV PORT=3000
RUN if [ "$SERVICE" = "backend" ]; then export PORT=3001; fi
EXPOSE $PORT

# Comando de execução dentro do Dockerfile
CMD ["sh", "-c", "if [ \"$SERVICE\" = \"frontend\" ]; then npm run prod:front; else npm run prod:back; fi"]
