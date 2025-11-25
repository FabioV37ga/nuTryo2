/**
 * Componente JanelaEstatisticas
 * 
 * Janela principal de estatísticas nutricionais que exibe:
 * - Seletor de período (Hoje, Semana, Mês)
 * - Fichas de macronutrientes (calorias, proteínas, carboidratos, gorduras)
 * - Progresso em relação às metas definidas
 */

import { useState, useEffect } from "react";
import "../../styles/estatisticas/estatisticas.css"
import "../../styles/estatisticas/estatisticas-mobile.css"

// Componentes de fichas
import FichaCalorias from "./fichas/FichaCalorias";
import FichaProteinas from "./fichas/FichaProteinas";
import FichaCarboidratos from "./fichas/FichaCarboidratos";
import FichaGorduras from "./fichas/FichaGorduras";

// Controllers
import EstatisticasController from "../../controllers/estatisticas/estatisticasController";
import authController from "../../controllers/auth/authController";

interface JanelaEstatisticasProps {
    onClose?: () => void;
    visivelMobile?: boolean;
}

function JanelaEstatisticas({ onClose, visivelMobile }: JanelaEstatisticasProps){
    // ================================================
    // ESTADOS DE PERÍODO
    // ================================================
    
    // Período selecionado: 'hoje', 'semana' ou 'mes'
    const [periodoSelecionado, setPeriodoSelecionado] = useState<'hoje' | 'semana' | 'mes'>('hoje');

    // ================================================
    // ESTADOS DE METAS BASE (diárias, do backend)
    // ================================================
    
    // Metas nutricionais editáveis pelo usuário (valores padrão até carregar do backend)
    const [metaKcalBase, setMetaKcalBase] = useState<string>('2000');
    const [metaProtsBase, setMetaProtsBase] = useState<string>('150');
    const [metaCarbsBase, setMetaCarbsBase] = useState<string>('250');
    const [metaGordsBase, setMetaGordsBase] = useState<string>('70');

    // ================================================
    // ESTADOS DE METAS EXIBIDAS (ajustadas por período)
    // ================================================
    
    const [metaKcal, setMetaKcal] = useState<string>('2000');
    const [metaProts, setMetaProts] = useState<string>('150');
    const [metaCarbs, setMetaCarbs] = useState<string>('250');
    const [metaGords, setMetaGords] = useState<string>('70');

    // Estado de carregamento
    const [carregando, setCarregando] = useState<boolean>(true);

    // ================================================
    // ESTADOS DE CONSUMO (calculados do diaObjeto)
    // ================================================
    
    const [consumoKcal, setConsumoKcal] = useState<number>(0);
    const [consumoProts, setConsumoProts] = useState<number>(0);
    const [consumoCarbs, setConsumoCarbs] = useState<number>(0);
    const [consumoGords, setConsumoGords] = useState<number>(0);

    // ================================================
    // FUNÇÕES DE PERÍODO
    // ================================================

    /**
     * Retorna o número de dias no mês atual
     */
    function obterDiasNoMes(): number {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();
        // Dia 0 do próximo mês = último dia do mês atual
        return new Date(ano, mes + 1, 0).getDate();
    }

    /**
     * Atualiza consumo e metas baseado no período selecionado
     */
    function atualizarPeriodo(periodo: 'hoje' | 'semana' | 'mes') {
        setPeriodoSelecionado(periodo);

        // Calcula consumo baseado no período
        let totais;
        let multiplicador = 1;

        switch (periodo) {
            case 'hoje':
                totais = EstatisticasController.calcularMacrosHoje();
                multiplicador = 1;
                break;
            case 'semana':
                totais = EstatisticasController.calcularMacrosSemana();
                multiplicador = 7;
                break;
            case 'mes':
                totais = EstatisticasController.calcularMacrosMes();
                multiplicador = obterDiasNoMes();
                break;
        }

        // Atualiza consumo
        setConsumoKcal(totais.calorias);
        setConsumoProts(totais.proteinas);
        setConsumoCarbs(totais.carboidratos);
        setConsumoGords(totais.gorduras);

        // Atualiza metas (multiplica metas diárias pelo período)
        setMetaKcal(String(Math.round(Number(metaKcalBase) * multiplicador)));
        setMetaProts(String(Math.round(Number(metaProtsBase) * multiplicador)));
        setMetaCarbs(String(Math.round(Number(metaCarbsBase) * multiplicador)));
        setMetaGords(String(Math.round(Number(metaGordsBase) * multiplicador)));
    }

    // ================================================
    // CARREGAMENTO DE METAS DO BACKEND
    // ================================================

    /**
     * Busca as metas do usuário ao abrir a janela
     */
    useEffect(() => {
        async function carregarMetas() {
            setCarregando(true);
            
            const email = authController.email;
            
            if (!email) {
                console.error('Email do usuário não encontrado');
                setCarregando(false);
                return;
            }

            const metas = await EstatisticasController.retornaMetas(email);
            
            if (metas) {
                // Atualiza estados BASE com valores do backend
                setMetaKcalBase(String(metas.metaCalorias || 2000));
                setMetaProtsBase(String(metas.metaProteinas || 150));
                setMetaCarbsBase(String(metas.metaCarboidratos || 250));
                setMetaGordsBase(String(metas.metaGorduras || 70));
                
                // Atualiza metas exibidas (inicialmente iguais às base)
                setMetaKcal(String(metas.metaCalorias || 2000));
                setMetaProts(String(metas.metaProteinas || 150));
                setMetaCarbs(String(metas.metaCarboidratos || 250));
                setMetaGords(String(metas.metaGorduras || 70));
                
                console.log('Metas carregadas:', metas);
            } else {
                console.warn('Nenhuma meta encontrada, usando valores padrão');
            }
            
            setCarregando(false);
        }

        carregarMetas();
    }, []); // Executa apenas ao montar o componente

    /**
     * Calcula consumo diário a partir do diaObjeto
     * Executa após carregar as metas
     */
    useEffect(() => {
        if (!carregando) {
            atualizarPeriodo('hoje');
        }
    }, [carregando]); // Recalcula quando termina de carregar

    return (
        <section className={`janela-estatisticas ${visivelMobile ? 'janela-estatisticas-visivel-mobile' : ''}`}>

            {/* Título da janela de estatísticas */}
            <div className="janela-estatisticas-titulo">
                Estatísticas {carregando && '...'}
            </div>

            <div className="janela-estatisticas-close" role="button" tabIndex={0} onClick={onClose} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' ') onClose && onClose();}}>
                <i className="fa fa-times" aria-hidden="true"></i>
            </div>

            {/* Seletor de período */}
            <nav className="janela-estatisticas-nav">

                {/* Período: Diário */}
                <div 
                    className={`estatisticas-hoje ${periodoSelecionado === 'hoje' ? 'periodo-selecionado' : ''}`}
                    onClick={() => atualizarPeriodo('hoje')}
                    role="button"
                    tabIndex={0}
                >
                    <span>
                        Hoje
                    </span>
                </div>

                {/* Período: Semanal */}
                <div 
                    className={`estatisticas-semana ${periodoSelecionado === 'semana' ? 'periodo-selecionado' : ''}`}
                    onClick={() => atualizarPeriodo('semana')}
                    role="button"
                    tabIndex={0}
                >
                    <span>
                        Essa semana
                    </span>
                </div>

                {/* Período: Total */}
                <div 
                    className={`estatisticas-totais ${periodoSelecionado === 'mes' ? 'periodo-selecionado' : ''}`}
                    onClick={() => atualizarPeriodo('mes')}
                    role="button"
                    tabIndex={0}
                >
                    <span>
                        Último mês
                    </span>
                </div>
            </nav>

            {/* Informações estatísticas */}
            {carregando ? (
                <div className="sessao-estatisticas-informacoes">
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        Carregando suas metas...
                    </div>
                </div>
            ) : (
                <div className="sessao-estatisticas-informacoes">

                    {/* Ficha de Calorias */}
                    <FichaCalorias 
                        consumo={consumoKcal}
                        meta={metaKcal}
                        onMetaChange={setMetaKcal}
                        editavel={periodoSelecionado === 'hoje'}
                    />

                    {/* Ficha de Proteínas */}
                    <FichaProteinas 
                        consumo={consumoProts}
                        meta={metaProts}
                        onMetaChange={setMetaProts}
                        editavel={periodoSelecionado === 'hoje'}
                    />

                    {/* Ficha de Carboidratos */}
                    <FichaCarboidratos 
                        consumo={consumoCarbs}
                        meta={metaCarbs}
                        onMetaChange={setMetaCarbs}
                        editavel={periodoSelecionado === 'hoje'}
                    />

                    {/* Ficha de Gorduras */}
                    <FichaGorduras 
                        consumo={consumoGords}
                        meta={metaGords}
                        onMetaChange={setMetaGords}
                        editavel={periodoSelecionado === 'hoje'}
                    />

                </div>
            )}

        </section>
        )
    }

    export default JanelaEstatisticas;