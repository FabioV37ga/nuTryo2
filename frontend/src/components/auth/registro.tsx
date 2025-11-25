import { useState } from "react";

import RegisterController from "../../controllers/auth/registerController";

interface Props {
    irParaLogin: () => void;
    onRegisterSuccess: () => void;
}

export const Registro: React.FC<Props> = ({ irParaLogin, onRegisterSuccess}: Props) => {

    async function handleRegister() {
        // Chama a função de registro passada via props
        const resposta = await RegisterController.register(email, senha, usuario)

        if (resposta.ok){
            onRegisterSuccess()
        }
    }

    const [email, setEmail] = useState<string>("");
    const [usuario, setUsuario] = useState<string>("");
    const [senha, setSenha] = useState<string>("");

    return (
        <div className="auth-registro">
            <div className="auth-janela-head">
                <img src="logo/nutryo-logo.png" alt="" />
                <img src="logo/nutryo-text.png" alt="" />
            </div>

            <div className="auth-janela-titulo">Registre sua conta</div>

            <div className="auth-inputs-register">
                <form>
                    <input
                        type="email"
                        className="register-email"
                        placeholder="Email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        className="register-usuario"
                        placeholder="Novo usuário"
                        autoComplete="name"
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <input
                        type="password"
                        className="register-senha"
                        placeholder="Nova senha"
                        autoComplete="new-password"
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </form>
            </div>

            <span className="registro-erro auth-erro" style={{ display: "none" }}></span>

            <div className="auth-enviar-container">
                <a className="auth-enviar submitRegistro" onClick={handleRegister}>Registrar</a>
            </div>

            <div className="auth-switch switchToLogin">
                Já tem uma conta? <br /> <u onClick={irParaLogin}>Fazer login</u>
            </div>
        </div>
    )
}