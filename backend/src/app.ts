import express from "express";
import connect from './config/dbConnect.js';
import routes from "./routes/index.js"
import cors from 'cors';

// Cria a conexão
const connection = await connect();


// Eventos de conexão 
connection.on("error", (error) => {
    console.log("Erro de conexão " + error)
});

connection.once("open", ()=>{
    console.log("Conexão com o banco feita com sucesso")
})

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}))
routes(app)

export default app;