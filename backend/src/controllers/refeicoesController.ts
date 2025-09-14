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
            const email = req.params._usuario;
            const listaRefeicoesDoUsuario = await refeicoes.find({ _usuario: email });
            res.status(200).json(listaRefeicoesDoUsuario);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    static async enviarRefeicao(req: Request, res: Response) {
        try {
            // var refeicoes:any[] = []
            // var alimentos:any[] = []

            // refeicoes = req.body.refeicoes
            // alimentos = refeicoes[0].alimentos

            // for (let i = 0; i<=alimentos.length-1;i++){

            // }
            var novaRef = new refeicoes(req.body)
            const salvo = await novaRef.save()

            // var novaRefeicao = await refeicoes.create(req.body)
            res.status(201).json(novaRef)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static async editarRefeicao(req: Request, res: Response) {
        try {
            const user = req.params._usuario;
            const diaId = req.params.id;
            const diaAtualizado = req.body; // todo o objeto do dia, incluindo _id, _usuario e refeicoes

            if (!diaAtualizado || diaAtualizado.id !== diaId) {
                return res.status(400).json({ message: "Objeto do dia inválido" });
            }

            // Substitui o documento do dia inteiro
            const resultado = await refeicoes.findOneAndReplace(
                { _usuario: user, id: diaId },
                diaAtualizado,
                { new: true } // retorna o documento atualizado
            );

            if (!resultado) {
                return res.status(404).json({ message: "Dia não encontrado" });
            }

            res.json(resultado);

        } catch (erro) {
            console.error("Erro ao atualizar o dia:", erro);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

}

export default RefeicoesController