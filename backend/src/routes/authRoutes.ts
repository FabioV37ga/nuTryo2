import express, {Request, Response } from "express";
import Autenticar from "../utils/autenticar.js";

const router = express.Router();

router.post("/auth/login", Autenticar.login)

export default router;