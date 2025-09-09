import express, {Request, Response } from "express";
import RefeicoesController from "../controllers/refeicoesController.js";

const router = express.Router();

router.get("/refeicoes", RefeicoesController.listarRefeicoes)
router.get("/refeicoes/:_usuario", RefeicoesController.listarRefeicoesPorUsuario)
router.post("/refeicoes", RefeicoesController.enviarRefeicao)
router.put("/refeicoes/:_usuario/:_id", RefeicoesController.editarRefeicao)

export default router;