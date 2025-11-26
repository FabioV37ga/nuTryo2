/**
 * Controlador de Autenticação
 * 
 * Gerencia:
 * - Verificação de sessão no localStorage
 * - Definição e remoção de sessão do usuário
 * - Armazenamento de dados do usuário (email, nome)
 */

// Controladores
import LoginController from "./loginController"

// Utils
import NutryoFetch from "../../utils/nutryoFetch.ts"

class AuthController {
    // Dados do usuário autenticado
    static email: string = ''
    static nome: string = ''

    /**
     * Verifica se existe sessão ativa no localStorage
     * Tenta fazer login automático com credenciais salvas
     * @returns true se sessão válida, false caso contrário
     */
    static async verificarSessao() {
        // Busca sessão salva no localStorage
        var sessao: Record<string, any> = JSON.parse(localStorage.getItem("sessaoNutryo") as string) as Record<string, any>

        if (sessao) {
            if (sessao.email && sessao.senha) {
                const email = sessao.email
                const senha = sessao.senha

                // Tenta fazer login com credenciais salvas
                const resposta = await LoginController.login(email, senha)

                if (resposta.ok) {
                    // Inicializa NutryoFetch com dados do usuário
                    await NutryoFetch.iniciar(email, AuthController.nome);
                    console.log("usuário conectado via cache")
                    return true
                }
            }
            return false
        } else {
            return false
        }
    }

    /**
     * Define sessão do usuário no localStorage
     * @param email - Email do usuário
     * @param senha - Senha do usuário
     * @param nome - Nome do usuário
     */
    static async definirSessao(email: string, senha: string, nome: string) {
        localStorage.setItem("sessaoNutryo", JSON.stringify({ email, senha }))
        AuthController.email = email
        AuthController.nome = nome
    }

    /**
     * Remove sessão do usuário (logout)
     */
    static removerSessao() {
        localStorage.removeItem("sessaoNutryo")
        AuthController.email = ''
        AuthController.nome = ''
    }
}

export default AuthController;