/**
 * Componente Sidebar
 * 
 * Barra lateral de navegação principal da aplicação.
 * 
 * Funcionalidades:
 * - Exibe logo do aplicativo
 * - Botão de perfil do usuário (abre janela de usuário)
 * - Botão de estatísticas
 * - Link para repositório GitHub
 * - Gerencia exibição da janela de perfil de usuário
 * 
 * @component
 * @param {object} props
 * @param {function} props.onLogout - Callback executado quando usuário faz logout
 * @param {function} [props.onOpenEstatisticas] - Callback para abrir janela de estatísticas
 */

import { useState } from "react";

// CSS
import "../../styles/sidebar/sidebar.css"
import "../../styles/sidebar/sidebar-mobile.css"

// Componentes
import Usuario from "./usuario";

// Interface para tipagem das props
interface SidebarProps {
  onLogout: () => void;
  onOpenEstatisticas?: () => void;
}

// Componente Sidebar
const Sidebar: React.FC<SidebarProps> = ({ onLogout, onOpenEstatisticas }: SidebarProps) => {

  /** Estado para controlar exibição da janela de perfil do usuário */
  const [mostrarUsuario, setMostrarUsuario] = useState<boolean>(false);

  // Renderização JSX
  return (
    <section className="sideBar">
      {/* Logo do aplicativo */}
      <div className="logo" tabIndex={0}>
        <img src="logo/nutryo-logo.png" className="logo-img" />
        <img src="logo/nutryo-text.png" className="logo-text" />
      </div>

      {/* Seção de perfil do usuário */}
      <section className="user">
        <a className="user-click" onClick={() => { setMostrarUsuario(true) }}>
          <i className="fa fa-user-circle" aria-hidden="true"></i>
        </a>
        <div className="user-label">PERFIL</div>
      </section>

      {/* Janela modal de perfil do usuário (renderizada condicionalmente) */}
      {mostrarUsuario && (
        <Usuario fecharJanela={() => setMostrarUsuario(false)}
          onLogout={onLogout} />
      )}

      {/* Botão de estatísticas */}
      <section className="estatisticas-ico" role="button" tabIndex={0} onClick={() => onOpenEstatisticas && onOpenEstatisticas()} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' ') onOpenEstatisticas && onOpenEstatisticas();}}>
        <i className="fa fa-bar-chart" aria-hidden="true"></i>
        <div className="estatisticas-ico-label">Estatísticas</div>
      </section>

      {/* Link para repositório GitHub */}
      <section className="git">
        <a href="https://github.com/FabioV37ga/NuTryo2" className="git-click" target="__blank">
          <i className="fa fa-github" aria-hidden="true"></i>
        </a>
      </section>
    </section>
  );
};

export default Sidebar;
