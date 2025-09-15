import express, { Request, Response } from "express";

const router = express.Router();

router.put("/metas/:email", () => { console.log("Atualizar metas") })
// router.post("/auth/registro", Autenticar.registrar)

export default router;