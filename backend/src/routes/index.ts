import express from "express";
import refeicoes from "./RefeicoesRouter.js";
import contas from "./authRoutes.js";
import alimentos from "./alimentosRoutes.js"
import metas from "./metasRoutes.js"

const routes = (app:any) => {
    app.use(express.json(), refeicoes, contas, alimentos, metas)
}

export default routes;