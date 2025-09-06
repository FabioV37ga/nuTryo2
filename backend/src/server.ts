import express from "express";
import "dotenv/config.js";
import app from './app.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const PORT = 3001;

// app.use(express.static(join(__dirname, 'public')));

app.listen(PORT, () =>{
    console.log('Servidor rodando na porta 3001');
})