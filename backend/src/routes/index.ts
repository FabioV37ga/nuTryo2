import express from "express";
import refeicoes from "./RefeicoesRouter.js";

const routes = (app:any) => {
    app.use(express.json(), refeicoes)
}

export default routes;