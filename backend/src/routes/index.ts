import express from "express";
import refeicoes from "./RefeicoesRouter.js";
import contas from "./authRoutes.js";

const routes = (app:any) => {
    app.use(express.json(), refeicoes, contas)
}

export default routes;