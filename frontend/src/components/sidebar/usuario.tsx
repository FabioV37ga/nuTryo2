/**
 * Componente Usuario
 * 
 * Janela modal com informações do perfil do usuário.
 * 
 * Funcionalidades:
 * - Exibe email e nome do usuário autenticado
 * - Botão de fechar janela
 * - Botão de logout
 * - Remove sessão ao fazer logout
 * 
 * @component
 * @param {object} props
 * @param {function} props.fecharJanela - Callback para fechar a janela modal
 * @param {function} [props.onLogout] - Callback executado após logout
 */

import type React from "react";
import AuthController from "../../controllers/auth/authController";

function Usuario({
  fecharJanela,
  onLogout
}: {
  fecharJanela: () => void;
  onLogout?: () => void;
}) {

  /**
   * Processa logout do usuário
   * 
   * Processo:
   * 1. Remove sessão do localStorage via AuthController
   * 2. Notifica componente pai via callback
   */
  function handleLogout() {
    // Remove sessão do localStorage
    AuthController.removerSessao()
    // Notifica componente pai para atualizar estado de autenticação
    onLogout && onLogout()
  }

  return (
    // Janela modal de perfil do usuário
    <div className="user-janela" >
      {/* Botão de fechar janela */}
      <a className="user-janela-close" onClick={fecharJanela}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </a>

      {/* Exibição do email */}
      <div className="user-janela-email">
        <div className="user-janela-email-label">Email: </div>
        <span>
          {AuthController.email}
        </span>
      </div>

      {/* Exibição do nome de usuário */}
      <div className="user-janela-nome">
        <div className="user-janela-nome-label">Usuário: </div>
        <span>
          {AuthController.nome}
        </span>
      </div>

      {/* Botão de logout */}
      <a className="user-janela-logout">
        <i className="fa fa-sign-out" aria-hidden="true" onClick={handleLogout}></i>
      </a>
    </div >
  )
}

export default Usuario;