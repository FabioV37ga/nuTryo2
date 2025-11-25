/**
 * Componente raiz da aplicação NuTryo
 * 
 * Gerencia:
 * - Autenticação do usuário
 * - Renderização condicional (Auth vs Sistema principal)
 * - Estado global de exibição (Calendário/Janela vs Estatísticas)
 */

import { useEffect, useState } from 'react'

// Componentes
import Auth from "./components/auth/auth"
import Sidebar from './components/sidebar/sidebar';
import Calendario from './components/calendario/calendario';
import Janela from './components/janela/janela';
import JanelaEstatisticas from './components/estatisticas/janelaEstatisticas';
import CalendarioController from './controllers/calendario/calendarioController';

// Estilos globais
import "./styles/reset.css"
import "./styles/document.css"
import "./styles/document-mobile.css"

// Controladores
import authController from './controllers/auth/authController';

// Verifica se o usuário tem autenticação no cache

function App() {

  // ================================================
  // AUTENTICAÇÃO
  // ================================================

  // Estado que controla se o usuário está autenticado
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  
  // Estado de carregamento durante verificação inicial
  const [loading, setLoading] = useState<boolean>(true);

  // Verifica se existe sessão ativa ao montar o componente
  useEffect(() => {
    async function verificarAuth() {
      const temSessao = await authController.verificarSessao();
      setAuthenticated(temSessao);
      setLoading(false);
    }
    verificarAuth();
  }, [])

  // ================================================
  // INTERFACE DO SISTEMA
  // ================================================

  // Data formatada para exibição na janela de refeições
  const [dataDisplay, setDataDisplay] = useState<string>(
    (CalendarioController.dataSelecionada || '').replaceAll('-', '/')
  );
  
  // Controla exibição da janela de estatísticas (alternada com janela de refeições)
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState<boolean>(false);

  // Controla visibilidade da janela no mobile (exibida ao clicar em um dia)
  const [janelaVisivelMobile, setJanelaVisivelMobile] = useState<boolean>(false);

  // Controla se é a primeira seleção automática de dia (para evitar abrir janela no mobile ao iniciar)
  const [primeiraSelecao, setPrimeiraSelecao] = useState<boolean>(true);


  // ================================================
  // RENDERIZAÇÃO
  // ================================================

  return (
    <>
      {/* Tela de autenticação - exibida apenas para usuários não autenticados */}
      {!authenticated && (
        <Auth onAuthenticated={() => setAuthenticated(true)} />
      )}

      {/* Sistema principal - exibido apenas para usuários autenticados */}
      {authenticated && (
        <main>
          {/* Barra lateral com navegação e opções do usuário */}
          <Sidebar 
            onLogout={() => { setAuthenticated(false); setMostrarEstatisticas(false); }} 
            onOpenEstatisticas={() => setMostrarEstatisticas(true)} 
          />

          {/* Calendário para seleção de datas */}
          <Calendario 
            setDataDisplay={setDataDisplay} 
            onDiaClick={() => {
              if (!primeiraSelecao) {
                setJanelaVisivelMobile(true);
              }
              setPrimeiraSelecao(false);
            }}
          />
          
          {/* Alternância entre janela de estatísticas e janela de refeições */}
          {mostrarEstatisticas ? (
            <JanelaEstatisticas 
              onClose={() => setMostrarEstatisticas(false)} 
              visivelMobile={true}
            />
          ) : (
            <Janela 
              dataDisplay={dataDisplay} 
              visivelMobile={janelaVisivelMobile}
              onCloseMobile={() => setJanelaVisivelMobile(false)}
            />
          )}
        </main>
      )}
    </>
  )
}

export default App
