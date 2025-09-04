import { Request, Response} from "express";

import { refeicoes } from "../models/refeicoes.js"
class RefeicoesController {
    static async listarRefeicoes(req:Request, res:Response) {
        try {
            const listaRefeicoes = await refeicoes.find({});
            res.status(200).json(listaRefeicoes)
        } catch (error) {
            res.status(500)
        }
    }
}

export default RefeicoesController