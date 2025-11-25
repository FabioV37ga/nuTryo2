import { useEffect, useState } from 'react'

// Componentes
import Auth from "./components/auth/auth"
import Sidebar from './components/sidebar/sidebar';
import Calendario from './components/calendario/calendario';
import Janela from './components/janela/janela';
import JanelaEstatisticas from './components/estatisticas/janelaEstatisticas';
import CalendarioController from './controllers/calendario/calendarioController';

// CSS
import "./styles/reset.css"
import "./styles/document.css"
import "./styles/document-mobile.css"

// Controladores
import authController from './controllers/auth/authController';

// Verifica se o usuário tem autenticação no cache

function App() {

  // ------------------------------------------------
  // Sessão de autenticação
  // ------------------------------------------------

  // Estados
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Effect para verificar autenticação ao carregar o componente
  useEffect(() => {
    async function verificarAuth() {
      const temSessao = await authController.verificarSessao();
      setAuthenticated(temSessao);
      setLoading(false);
    }
    verificarAuth();
  }, [])

  // -------------------------------------------------
  // Sessão de calendário e janela
  // -------------------------------------------------

  // Estado para exibir a data selecionada na Janela 
  const [dataDisplay, setDataDisplay] = useState<string>(
    (CalendarioController.dataSelecionada || '').replaceAll('-', '/')
  );
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState<boolean>(false);


  // Retorno JSX
  return (
    <>
      {/* Renderização condicional de auth - se usuário logar, ou já tiver sessão, não renderiza janela de auth */}
      {!authenticated && (
        <Auth onAuthenticated={() => setAuthenticated(true)} />
      )}

      {/* Renderiza sistema quando usuário estiver autenticado */}
      {authenticated && (
        // Conteúdo principal da aplicação
        <main>
          {/* Sidebar */}
          <Sidebar onLogout={() => { setAuthenticated(false); setMostrarEstatisticas(false); }} onOpenEstatisticas={() => setMostrarEstatisticas(true)} />

          {/* Calendario */}
          <Calendario setDataDisplay={setDataDisplay} />
          {mostrarEstatisticas ? (
            <JanelaEstatisticas onClose={() => setMostrarEstatisticas(false)} />
          ) : (
            <Janela dataDisplay={dataDisplay} />
          )}
          

        </main>
      )}
    </>
  )
}

export default App
