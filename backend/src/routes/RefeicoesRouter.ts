import express, {Request, Response } from "express";
import RefeicoesController from "../controllers/refeicoesController.js";

const router = express.Router();

router.get("/refeicoes", RefeicoesController.listarRefeicoes)
router.get("/refeicoes/:_usuario", RefeicoesController.listarRefeicoesPorUsuario)

export default router;