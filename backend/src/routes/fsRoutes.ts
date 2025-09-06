import express, {Request, Response } from "express";
import FatSecretController from "../controllers/fsController.js";

const router = express.Router();

const fatsecret = new FatSecretController()

router.get("/api/foods", fatsecret.buscarAlimentos);
router.get("/api/food/:id", fatsecret.detalheAlimento);
router.get("/api/recipes", fatsecret.buscarReceitas);
router.get("/api/exercise/:id", fatsecret.detalheExercicio);

export default router;