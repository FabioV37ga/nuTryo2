import { backend } from "../../utils/connection";
import AuthController from "./authController";
import NutryoFetch from "../../utils/nutryoFetch.ts";

class RegisterController {
    static async register(email: string, senha: string, nome: string) {

        // Faz requisição
        const resposta = await fetch(`${backend}/auth/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
            },
            body: JSON.stringify({ email, senha, nome })
        })

        if (resposta.status == 400) {
            console.log("Erro no registro: Email já cadastrado");
            return { ok: false }
        }

        if (resposta.ok) {
            await NutryoFetch.iniciar(email, nome);
            console.log("Registro bem sucedido");

            AuthController.definirSessao(email, senha, nome);
            return { ok: true };
        } else {
            return { ok: false };
        }
    }
}

export default RegisterController;