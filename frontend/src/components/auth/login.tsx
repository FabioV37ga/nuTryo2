import { useState } from "react";

import LoginController from "../../controllers/auth/loginController";

interface LoginProps {
    irParaRegistro: () => void;
    onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ irParaRegistro, onLoginSuccess }: LoginProps) => {

    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    async function handleLogin() {
        // Chama a função de login passada via props
        var resposta = await LoginController.login(email, senha)

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