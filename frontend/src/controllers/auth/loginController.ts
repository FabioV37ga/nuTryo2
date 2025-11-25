import type { AnyObject } from "mongoose";
import { backend } from "../../utils/connection";
import AuthController from "./authController";
import NutryoFetch from "../../utils/nutryoFetch.ts";

class LoginController {
    static async login(email: string, senha: string) {
        // Inicia requisição de login
        const resposta = await fetch(`${backend}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
            },
            body: JSON.stringify({ email, senha })
        })

        const dados = await resposta.json()

        if (resposta.ok) {
            await NutryoFetch.iniciar(email, dados.nome);
            console.log("Login bem sucedido");
            AuthController.definirSessao(email, senha, dados.nome);
            
            return { ok: true }
        } else {
            return { ok: false }
        }

    }
}

export default LoginController