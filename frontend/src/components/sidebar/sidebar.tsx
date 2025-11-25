import { useState } from "react";

// CSS
import "../../styles/sidebar/sidebar.css"
import "../../styles/sidebar/sidebar-mobile.css"

// Componentes
import Usuario from "./usuario";

// Interface pra não haver erro de tipagem no props
interface SidebarProps {
  onLogout: () => void;
  onOpenEstatisticas?: () => void;
}

// Sidebar componente
const Sidebar: React.FC<SidebarProps> = ({ onLogout, onOpenEstatisticas }: SidebarProps) => {

  // Estado para mostrar janela de usuário
  const [mostrarUsuario, setMostrarUsuario] = useState<boolean>(false);

  // Retorno JSX
  return (
    <section className="sideBar">
      <div className="logo" tabIndex={0}>
        <img src="logo/nutryo-logo.png" className="logo-img" />
        <img src="logo/nutryo-text.png" className="logo-text" />
      </div>

      {/* Ícone do usuário */}
      <section className="user">
        <a className="user-click" onClick={() => { setMostrarUsuario(true) }}>
          <i className="fa fa-user-circle" aria-hidden="true"></i>
        </a>
        <div className="user-label">PERFIL</div>
      </section>

      {/* Janela de usuário */}
      {mostrarUsuario && (
        <Usuario fecharJanela={() => setMostrarUsuario(false)}
          onLogout={onLogout} />
      )}

      {/* Estatísticas */}
      <section className="estatisticas-ico" role="button" tabIndex={0} onClick={() => onOpenEstatisticas && onOpenEstatisticas()} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' ') onOpenEstatisticas && onOpenEstatisticas();}}>
        <i className="fa fa-bar-chart" aria-hidden="true"></i>
        <div className="estatisticas-ico-label">Estatísticas</div>
      </section>

      {/* GitHub */}
      <section className="git">
        <a href="https://github.com/FabioV37ga/NuTryo2" className="git-click" target="__blank">
          <i className="fa fa-github" aria-hidden="true"></i>
        </a>
      </section>
    </section>
  );
};

export default Sidebar;
