
import { Request, Response } from "express";
import metas from "../models/metas.js";

class MetasController {
    static async retornaMetas(req: Request, res: Response) {

        try {
            const email = req.params.email;
            const metasUsuario = await metas.find({ email: email })

            res.status(200).json(metasUsuario)
        } catch (err) {

            res.status(500).json({ erro: err.message })
        }
    }
}

export default MetasController