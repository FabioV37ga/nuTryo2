import type React from "react";
import AuthController from "../../controllers/auth/authController";

function Usuario({
  fecharJanela,
  onLogout
}: {
  fecharJanela: () => void;
  onLogout?: () => void;
}) {

  function handleLogout() {
    // Remove sessão do localStorage
    AuthController.removerSessao()
    onLogout && onLogout()
  }

  return (
    // Janela de usuário
    <div className="user-janela" >
      <a className="user-janela-close" onClick={fecharJanela}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </a>

      <div className="user-janela-email">
        <div className="user-janela-email-label">Email: </div>
        <span>
          {AuthController.email}
        </span>
      </div>

      <div className="user-janela-nome">
        <div className="user-janela-nome-label">Usuário: </div>
        <span>
          {AuthController.nome}
        </span>
      </div>

      <a className="user-janela-logout">
        <i className="fa fa-sign-out" aria-hidden="true" onClick={handleLogout}></i>
      </a>
    </div >
  )
}

export default Usuario;