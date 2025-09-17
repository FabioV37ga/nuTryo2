import express, { Request, Response } from "express";
import MetasController from "../controllers/metasController.js";

const router = express.Router();

router.get("/metas/:email", MetasController.retornaMetas)
// router.post("/auth/registro", Autenticar.registrar)
router.put("/metas/:email", MetasController.alteraMetas)

export default router;