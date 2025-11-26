import express from "express";
import connect from './config/dbConnect.js';
import routes from "./routes/index.js";
import cors from 'cors';

// Cria a conexão
const connection = await connect();

// Eventos de conexão 
connection.on("error", (error) => {
    console.log("Erro de conexão " + error);
});

connection.once("open", () => {
    console.log("Conexão com o banco feita com sucesso");
});

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

export default app;