import express from "express";
import AlimentoController from "../controllers/alimentoController.js";
const router = express.Router();
router.get("/alimentos", AlimentoController.listar);
router.get("/alimentos/buscar", AlimentoController.buscarNome);
router.get("/alimentos/:id", AlimentoController.buscarId);
export default router;
