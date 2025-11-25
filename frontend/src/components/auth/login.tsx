/**
 * Componente Login
 * 
 * Formulário de autenticação para usuários existentes.
 * 
 * Funcionalidades:
 * - Inputs para email e senha
 * - Validação de credenciais via LoginController
 * - Navegação para tela de registro
 * - Notificação de sucesso/erro de autenticação
 * 
 * @component
 * @param {object} props
 * @param {function} props.irParaRegistro - Callback para alternar para tela de registro
 * @param {function} props.onLoginSuccess - Callback executado após login bem-sucedido
 */

import { useState } from "react";

import LoginController from "../../controllers/auth/loginController";

interface LoginProps {
    irParaRegistro: () => void;
    onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ irParaRegistro, onLoginSuccess }: LoginProps) => {

    /** Estado para armazenar email digitado */
    const [email, setEmail] = useState<string>("");
    
    /** Estado para armazenar senha digitada */
    const [senha, setSenha] = useState<string>("");
    
    /**
     * Processa tentativa de login
     * 
     * Processo:
     * 1. Chama LoginController.login() com credenciais
     * 2. Se resposta OK, notifica sucesso via onLoginSuccess
     * 3. Caso contrário, exibe erro (tratado pelo controller)
     */
    async function handleLogin() {
        // Tenta fazer login com credenciais fornecidas
        var resposta = await LoginController.login(email, senha)

        // Se login bem-sucedido, notifica componente pai
        if (resposta.ok) {
            onLoginSuccess();
        }
    }


    return (
        <div className="auth-login">
            <div className="auth-janela-head">
                <img src="logo/nutryo-logo.png" alt="" />
                <img src="logo/nutryo-text.png" alt="" />
            </div>

            <div className="auth-janela-titulo">Entre na sua conta</div>

            <div className="auth-inputs-login">
                <form>
                    <input
                        type="email"
                        className="login-usuario"
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="login-senha"
                        placeholder="Senha"
                        autoComplete="current-password"
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </form>
            </div>

            <span className="login-erro auth-erro" style={{ display: "none" }}></span>

            <div className="auth-enviar-container">
                <a className="auth-enviar submitLogin" onClick={handleLogin}>Login</a>
            </div>

            <div className="auth-switch switchToRegister">
                Não tem uma conta? <br /> <u onClick={irParaRegistro}>Registre-se</u>
            </div>
        </div>
    )
}