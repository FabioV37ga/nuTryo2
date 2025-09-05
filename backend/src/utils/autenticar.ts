import express, { Request, Response } from "express"
import Usuario from "../models/usuario.js"

class Autenticar {
    static usuarioAtual:string

    static async login(req: Request, res: Response) {
        const { email, senha } = req.body;

        const usuario = await Usuario.findOne({ email, senha });
        
        if (usuario){
            res.status(200).json(usuario)
            Autenticar.usuarioAtual = String(usuario.email)
        }
        else 
            res.status(500)
    }

    static async registrar(req:Request, res:Response){
        try{
            const novoUsuario = await Usuario.create(req.body)
            res.status(200).json(novoUsuario)
        }catch(error){
            res.status(500).json(error)
        }
    }
}

export default Autenticar