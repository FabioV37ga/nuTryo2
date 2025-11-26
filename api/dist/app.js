import express from "express";
import connect from './config/dbConnect.js';
import routes from "./routes/index.js";
import cors from 'cors';
const connection = await connect();
connection.on("error", (error) => {
    console.log("Erro de conexão " + error);
});
connection.once("open", () => {
    console.log("Conexão com o banco feita com sucesso");
});
const app = express();
const allowedOrigins = [
    'http://localhost:3000',
    'https://nutryo2-w5pq.onrender.com',
    'https://nutryo2.onrender.com'
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn(`Bloqueado por CORS: ${origin}`);
            callback(new Error('CORS não permitido pelo servidor'));
        }
    },
    credentials: true
}));
routes(app);
export default app;
