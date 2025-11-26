import express from "express";
import routes from "./routes/index.js";
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuração de CORS
const allowedOrigins = [
    'http://localhost:3000',               // desenvolvimento local
    'https://nutryo2-w5pq.onrender.com',   // frontend deploy
    'https://nutryo2.onrender.com'         // backend deploy
];

app.use(cors({
    origin: (origin, callback) => {
        // permite requests sem origin (Postman, CURL, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`Bloqueado por CORS: ${origin}`);
            callback(new Error('CORS não permitido pelo servidor'));
        }
    },
    credentials: true // caso use cookies/autenticação
}));

// Rotas
routes(app);

// Rota raiz - Página de status da API
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'index.html'));
});

export default app;