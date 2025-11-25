/**
 * Componente Auth
 * 
 * Container principal para autenticação de usuários.
 * 
 * Funcionalidades:
 * - Alterna entre telas de Login e Registro
 * - Exibe overlay de autenticação sobre a aplicação
 * - Gerencia estado de modo de autenticação (login vs registro)
 * - Notifica componente pai quando autenticação é bem-sucedida
 * 
 * @component
 * @param {object} props
 * @param {function} props.onAuthenticated - Callback executado após autenticação bem-sucedida
 */

import { useState } from "react";

// CSS
import "../../styles/auth/auth.css";

// Componentes
import { Registro } from "./registro";
import { Login } from "./login";

interface AuthProps {
  onAuthenticated: () => void; // Vem do componente pai
}

export const Auth: React.FC<AuthProps> = ({ onAuthenticated }) => {

  /** Estado para controlar modo de autenticação: "login" ou "register" */
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <section className="overlay-auth">

      <div className="auth-janela">
        {authMode === "login" ? (
          <Login
            irParaRegistro={() => setAuthMode("register")}
            onLoginSuccess={onAuthenticated}
          />
        ) : (
          <Registro
            irParaLogin={() => setAuthMode("login")}
            onRegisterSuccess={onAuthenticated}
          />
        )}
      </div>

    </section>
  );
};

export default Auth;
