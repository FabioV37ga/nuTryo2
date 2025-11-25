<div align="center">

# 🥗 NuTryo

**Aplicação web para controle nutricional e acompanhamento de refeições diárias**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[Recursos](#-recursos) •
[Tecnologias](#-tecnologias) •
[Instalação](#-instalação) •
[Desenvolvimento](#-desenvolvimento) •
[Documentação](#-documentação) •
[Roadmap](#-roadmap)

</div>

---

## 📋 Sobre

NuTryo é uma aplicação full-stack para gerenciamento nutricional que permite aos usuários registrar e acompanhar suas refeições diárias, calcular automaticamente macronutrientes e visualizar estatísticas de consumo. Com uma interface intuitiva e responsiva, oferece suporte completo tanto para desktop quanto mobile.

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
- **XLSX** - Processamento de planilhas

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

## 🚀 Desenvolvimento

### Scripts Disponíveis

```bash
# Iniciar backend em modo desenvolvimento
npm run start:back

# Iniciar frontend em modo desenvolvimento
npm run start:front

# Build de produção
npm run build

# Executar testes
npm test
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
│   │   └── utils/         # Utilitários
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── styles/        # CSS
│   │   └── utils/         # Utilitários
│   ├── public/            # Recursos estáticos
│   └── vite.config.ts
│
└── package.json
```

## 📚 Documentação

### Arquitetura do Frontend

Para uma compreensão detalhada da arquitetura do frontend, estrutura de componentes, fluxo de dados e correlações entre arquivos, consulte a documentação completa:

**[📄 Frontend Architecture Guide (PDF)](./docs/FRONTEND_ARCHITECTURE.pdf)**  
Se o PDF não abrir diretamente no GitHub, acesse a versão Markdown: [`FRONTEND_ARCHITECTURE.md`](./FRONTEND_ARCHITECTURE.md)

Este documento inclui:
- 🏗️ Estrutura completa de diretórios
- 🧩 Hierarquia e especificação de componentes
- 🔄 Fluxo de dados e estado
- 🔗 Mapa de dependências entre arquivos
- ⚙️ Controladores e utilitários
- 📊 Diagramas de arquitetura

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
