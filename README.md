<div align="center">

# 🥗 NuTryo

**Aplicação web para controle nutricional e acompanhamento de refeições diárias**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

[Recursos](#-recursos) •
[Arquitetura](#-arquitetura) •
[Tecnologias](#-tecnologias) •
[Instalação](#-instalação) •
[Deploy](#-deploy) •
[Desenvolvimento](#-desenvolvimento) •
[Documentação](#-documentação) •
[Roadmap](#-roadmap)

</div>

---

## 📋 Sobre

NuTryo é uma aplicação full-stack para gerenciamento nutricional que permite aos usuários registrar e acompanhar suas refeições diárias, calcular automaticamente macronutrientes e visualizar estatísticas de consumo. Com uma interface intuitiva e responsiva, oferece suporte completo tanto para desktop quanto mobile.

O sistema utiliza uma **arquitetura de microserviços** com três serviços independentes containerizados via Docker e hospedados no Render.com, garantindo escalabilidade, manutenibilidade e deploy contínuo.

## 🏗️ Arquitetura

O NuTryo é estruturado em **três microserviços independentes**:

### 🎨 Frontend
- **React 19 + Vite**
- Interface de usuário responsiva
- Comunicação com Backend e API via HTTP
- **URL**: `https://nutryo2-w5pq.onrender.com`

### ⚙️ Backend
- **Node.js + Express + MongoDB**
- Gerencia autenticação, refeições e metas
- Banco de dados MongoDB Atlas
- **URL**: `https://nutryo2.onrender.com`
- **Porta**: 3001

### 📊 API
- **Node.js + Express + Excel**
- Fornece dados nutricionais de +600 alimentos
- Leitura de arquivo XLSX (sem banco de dados)
- **URL**: `https://nutryo2-1.onrender.com`
- **Porta**: 3002

### Containerização

Cada serviço possui seu próprio **Dockerfile**:
- `Dockerfile.frontend` - Build Vite + Preview Server
- `Dockerfile.backend` - Build TypeScript + Node Server + MongoDB
- `Dockerfile.api` - Build TypeScript + Node Server + Excel Data

### Fluxo de Dados

```
Usuário → Frontend (React)
            ↓
    ┌───────┴───────┐
    ↓               ↓
Backend (MongoDB)  API (Excel)
    ↓               ↓
Refeições/Metas  Alimentos
```

## ✨ Recursos

### Implementados

- **📅 Calendário Dinâmico**: Navegação intuitiva entre dias, meses e anos
- **🍽️ Gestão de Refeições**: Criação, edição e remoção de refeições personalizadas
- **🥑 Gestão de Alimentos**: Sistema completo para adicionar alimentos às refeições
- **🔐 Autenticação**: Sistema de registro, login e logout com sessão persistente
- **🔍 Busca de Alimentos**: Pesquisa em tabela nutricional com +600 alimentos
- **🧮 Cálculo Automático**: Macronutrientes e valores nutricionais calculados em tempo real
- **💾 Sincronização**: Envio e recebimento automático de dados do servidor
- **📱 Responsivo**: Interface totalmente adaptada para dispositivos móveis
- **📊 Estatísticas**: Visualização de métricas nutricionais (em desenvolvimento)

## 🛠 Tecnologias

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **CSS Modules** - Estilização componentizada

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB

### API
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **XLSX** - Processamento de planilhas Excel
- **Sem banco de dados** - Dados carregados em memória

### DevOps & Deploy
- **Docker** - Containerização de serviços
- **Render.com** - Hospedagem e deploy contínuo
- **Git** - Controle de versão e CI/CD

### Ferramentas de Desenvolvimento
- **Hot Reload** - Atualização automática durante desenvolvimento
- **ESLint** - Linting e formatação de código
- **Git** - Controle de versão

## 📦 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- Conta no [MongoDB Atlas](https://cloud.mongodb.com) com collections:
  - `refeicoes`
  - `usuarios`
  - `metas`

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/FabioV37ga/nuTryo2
   cd nuTryo2
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   DB_CONNECTION_STRING=mongodb+srv://seu-usuario:senha@cluster.mongodb.net/nutryo
   PORT=3000
   ```

4. **Inicie o backend**
   ```bash
   npm run start:back
   ```

5. **Inicie o frontend** (em outro terminal)
   ```bash
   npm run start:front
   ```

6. **Acesse a aplicação**
   
   Abra seu navegador em `http://localhost:5173`

## 🐳 Deploy

### Deploy com Docker no Render.com

O NuTryo utiliza três serviços independentes no Render.com, cada um com seu próprio Dockerfile:

#### 1. Frontend
```bash
# Build command
docker build -f Dockerfile.frontend -t nutryo-frontend .

# O Render executa automaticamente
docker run -p 3000:3000 nutryo-frontend
```

**Configurações no Render:**
- **Build Command**: `docker build -f Dockerfile.frontend -t nutryo-frontend .`
- **Start Command**: Definido no Dockerfile
- **Port**: 3000

#### 2. Backend
```bash
# Build command
docker build -f Dockerfile.backend -t nutryo-backend .

# O Render executa automaticamente
docker run -p 3001:3001 nutryo-backend
```

**Configurações no Render:**
- **Build Command**: `docker build -f Dockerfile.backend -t nutryo-backend .`
- **Environment Variables**: `DB_CONNECTION_STRING`
- **Port**: 3001

#### 3. API
```bash
# Build command
docker build -f Dockerfile.api -t nutryo-api .

# O Render executa automaticamente
docker run -p 3002:3002 nutryo-api
```

**Configurações no Render:**
- **Build Command**: `docker build -f Dockerfile.api -t nutryo-api .`
- **Port**: 3002

### Variáveis de Ambiente (Render)

Configure no painel do Render para cada serviço:

**Backend:**
```env
DB_CONNECTION_STRING=mongodb+srv://usuario:senha@cluster.mongodb.net/nutryo
```

**Frontend e API:**
- Nenhuma variável de ambiente necessária

### Acesso ao Sistema

Após deploy, acesse a página inicial que inicializa todos os serviços:
- **Frontend**: `https://nutryo2-w5pq.onrender.com`
- **Backend**: `https://nutryo2.onrender.com`
- **API**: `https://nutryo2-1.onrender.com`

## 🚀 Desenvolvimento

### Scripts Disponíveis

```bash
# Frontend
npm run start:front       # Desenvolvimento com Vite
npm run build:front       # Build de produção

# Backend
npm run start:back        # Desenvolvimento com nodemon
npm run prod:back         # Produção
npm run prod:back:unix    # Produção (Linux/Docker)

# API
npm run start:api         # Desenvolvimento com nodemon
npm run prod:api          # Produção
npm run prod:api:unix     # Produção (Linux/Docker)

# Limpeza
npm run clearback         # Limpar dist do backend (Windows)
npm run clearapi          # Limpar dist da API (Windows)
npm run clearback:unix    # Limpar dist do backend (Unix)
npm run clearapi:unix     # Limpar dist da API (Unix)
```

### Estrutura do Projeto

```
nuTryo2/
├── backend/
│   ├── src/
│   │   ├── config/        # Configurações (DB, etc)
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── models/        # Modelos Mongoose
│   │   ├── routes/        # Rotas da API
│   │   ├── utils/         # Utilitários
│   │   └── views/         # Templates HTML
│   ├── tsconfig.json
│   └── Dockerfile.backend
│
├── api/
│   ├── src/
│   │   ├── config/        # Configuração DB (não utilizada)
│   │   ├── controllers/   # Lógica de alimentos
│   │   ├── data/          # Arquivo alimentos.xlsx
│   │   ├── routes/        # Rotas de alimentos
│   │   └── views/         # Templates HTML
│   ├── tsconfig.json
│   └── Dockerfile.api
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── styles/        # CSS
│   │   └── utils/         # Utilitários
│   ├── public/            # Recursos estáticos
│   ├── vite.config.ts
│   └── Dockerfile.frontend
│
├── docs/                  # Documentação em PDF
├── index.html            # Página de inicialização
└── package.json          # Scripts compartilhados
```

## 📚 Documentação

### Arquitetura do Frontend

Para uma compreensão detalhada da arquitetura do frontend, estrutura de componentes, fluxo de dados e correlações entre arquivos, consulte a documentação completa:

**[📄 Frontend Architecture Guide (PDF)](./docs/FRONTEND_ARCHITECTURE.pdf)**  

Este documento inclui:
- 🏗️ Estrutura completa de diretórios
- 🧩 Hierarquia e especificação de componentes
- 🔄 Fluxo de dados e estado
- 🔗 Mapa de dependências entre arquivos
- ⚙️ Controladores e utilitários
- 📊 Diagramas de arquitetura

### Apresentação do Projeto

Pitch de vendas e apresentação executiva do NuTryo para demonstrações acadêmicas e profissionais:

**[📊 Pitch de Apresentação (PDF)](./docs/PITCH_NUTRYO.pdf)**

Este documento inclui:
- 🎯 Apresentação do produto e proposta de valor
- 👥 Público-alvo e personas
- 🚀 Vantagens competitivas (usabilidade, responsividade)
- 🏗️ Arquitetura técnica e roadmap
- 📈 Métricas de sucesso e KPIs
- 💡 Diferenciais e próximos passos

## 🗺️ Roadmap

### Concluído ✅

- [x] Finalizar telas e interface
- [x] Implementar banco de dados (MongoDB)
- [x] Sistema de login e registro
- [x] Adicionar tabela de alimentos
- [x] Lógica de pesquisa de alimentos
- [x] Sistema de criação dinâmica de elementos
- [x] Fluxo de envio/recebimento de dados
- [x] Responsividade mobile
- [x] Arquitetura de microserviços
- [x] Containerização com Docker
- [x] Deploy no Render.com

### Em Desenvolvimento 🚧

- [ ] Janela e lógica de estatísticas
- [ ] Dashboard com gráficos de progresso
- [ ] Sistema de metas personalizadas
- [ ] Exportação de relatórios (PDF)

### Planejado 📝

- [ ] Notificações e lembretes
- [ ] Modo offline com sincronização
- [ ] Integração com wearables
- [ ] API pública para desenvolvedores
- [ ] Aplicativo mobile nativo

---

<div align="center">

**Desenvolvido com ❤️ usando TypeScript e React**

[⬆ Voltar ao topo](#-nutryo)

</div> 
