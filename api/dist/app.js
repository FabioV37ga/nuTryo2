import express from "express";
import routes from "./routes/index.js";
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'views', 'index.html'));
});
export default app;
