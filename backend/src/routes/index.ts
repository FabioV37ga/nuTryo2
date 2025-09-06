import express from "express";
import refeicoes from "./RefeicoesRouter.js";
import contas from "./authRoutes.js";
import alimentos from "./alimentosRoutes.js"

const routes = (app:any) => {
    app.use(express.json(), refeicoes, contas, alimentos)
}

export default routes;