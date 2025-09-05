import { Request, Response } from "express";

import { refeicoes } from "../models/refeicoes.js"
class RefeicoesController {
    static async listarRefeicoes(req: Request, res: Response) {
        try {
            const listaRefeicoes = await refeicoes.find({});
            res.status(200).json(listaRefeicoes)
        } catch (error) {
            res.status(500)
        }
    }

    static async listarRefeicoesPorUsuario(req: Request, res: Response) {
        try {
            const usuario = req.params._usuario;
            const listaRefeicoesDoUsuario = await refeicoes.find({ _usuario: usuario });
            res.status(200).json(listaRefeicoesDoUsuario);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
}

export default RefeicoesController