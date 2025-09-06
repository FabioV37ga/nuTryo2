import express from "express";
import AlimentoController from "../controllers/alimentoController.js";

const router = express.Router();

router.get("/alimentos", AlimentoController.listar);
router.get("/alimentos/busca", AlimentoController.buscar);
router.get("/alimentos/fuzzy", AlimentoController.buscarFuzzy);

export default router;