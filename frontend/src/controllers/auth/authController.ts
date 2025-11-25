import type { AnyObject } from "mongoose"

// Controladores
import LoginController from "./loginController"

// Utils
import NutryoFetch from "../../utils/nutryoFetch.ts"

class AuthController {
    static email: string = ''
    static nome: string = ''

    static async verificarSessao() {
        // Lógica para verificar a sessão do usuário no cache
        var sessao: AnyObject = JSON.parse(localStorage.getItem("sessaoNutryo") as string) as AnyObject

        if (sessao) {
            if (sessao.email && sessao.senha) {
                const email = sessao.email
                const senha = sessao.senha

                const resposta = await LoginController.login(email, senha)

                if (resposta.ok) {
                    await NutryoFetch.iniciar(email, AuthController.nome);
                    console.log("usuario conectado via cache")
                    return true
                }
            }
            return false
        } else {
            return false
        }
    }

    static async definirSessao(email: string, senha: string, nome: string) {
        localStorage.setItem("sessaoNutryo", JSON.stringify({ email, senha }))
        AuthController.email = email
        AuthController.nome = nome
    }

    static removerSessao() {
        localStorage.removeItem("sessaoNutryo")
        AuthController.email = ''
        AuthController.nome = ''
    }



}

export default AuthController;