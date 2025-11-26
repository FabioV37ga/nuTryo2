# Base Node Alpine
FROM node:24.3-alpine

WORKDIR /app

# Copiar package.json do frontend e instalar dependências
COPY frontend/package*.json ./
RUN npm install

# Copiar código fonte do frontend
COPY frontend/ ./

# Build do projeto React com Vite
RUN npm run build

# Definir porta
EXPOSE 3000

# Servir build de produção
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]