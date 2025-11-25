import { useState } from "react";

// CSS
import "../../styles/auth/auth.css";

// componentes
import { Registro } from "./registro";
import { Login } from "./login";

// Controladores
// import AuthController from "../../controllers/auth/authController";

interface AuthProps {
  onAuthenticated: () => void; // Vem do componente pai
}

export const Auth: React.FC<AuthProps> = ({ onAuthenticated }) => {

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
