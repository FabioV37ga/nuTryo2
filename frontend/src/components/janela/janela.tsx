/**
 * Componente Janela - Gerenciador de Refeições do Dia
 * 
 * Responsabilidades:
 * - Exibe lista de refeições do dia selecionado
 * - Gerencia sistema de abas (lista + edição de refeições)
 * - CRUD de refeições (criar, editar, deletar)
 * - Sincronização com backend via diaObjeto
 */

import { useState, useEffect } from "react"

// Estilos
import "../../styles/janela/janela.css"
import "../../styles/janela/janela-mobile.css"
import "../../styles/janela/refeicoes/refeicoes.css"
import "../../styles/janela/refeicoes/refeicoes-mobile.css"

import CalendarioController from "../../controllers/calendario/calendarioController"
import NutryoFetch from "../../utils/nutryoFetch.ts"

import Refeicoes from "./refeicoes/refeicoes.tsx"
import Refeicao from "./refeicoes/refeicao.tsx"
import Aba from "./aba"
import diaObjeto from "../../utils/diaObjeto.ts"

interface Aba {
    id: number;
    titulo: string;
}

function Janela({ dataDisplay }: { dataDisplay?: string }) {

    // ================================================
    // GERENCIAMENTO DE REFEIÇÕES
    // ================================================

    // Lista de refeições do dia selecionado
    const [refeicoes, setRefeicoes] = useState<any[]>([]);

    /**
     * Busca refeições do backend para a data selecionada
     * Normaliza os dados adicionando IDs sequenciais e UIDs únicos
     */
    async function fetchRefeicoes() {
        const res = await NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) as any[] | null;
        const list = res ?? [];
        const normalized = list.map((r: any, idx: number) => ({ ...r, id: idx + 1, uid: r._id ?? `local-${Date.now()}-${idx}` }));
        setRefeicoes(normalized);
    }

    // Recarrega refeições sempre que a data selecionada mudar
    useEffect(() => {
        fetchRefeicoes();
    }, [CalendarioController.dataSelecionada])

    // Fecha todas as abas ao mudar de data (exceto aba fixa "Refeições")
    useEffect(() => {
        setAbas([{ id: 0, titulo: 'Refeições', uid: 'tab-refeicoes', ativa: true }]);
    }, [CalendarioController.dataSelecionada]);

    // ================================================
    // CRUD DE REFEIÇÕES
    // ================================================

    /**
     * Adiciona nova refeição ao dia
     * Cria objeto local e sincroniza com backend via diaObjeto
     */
    function handleAddRefeicao() {
        setRefeicoes(prev => {
            const newId = prev.length + 1;
            const uid = `local-${Date.now()}`;
            const novaRefeicao = { _id: null, tipo: 'Nova Refeição', alimentos: [], id: newId, uid } as any;
            
            // Sincroniza com backend
            diaObjeto.gerarRefeicao(newId, 'Nova Refeição', []);
            console.log(diaObjeto.dia)
            
            return [...prev, novaRefeicao];
        });
    }

    /**
     * Remove refeição do dia
     * @param id - ID da refeição a ser removida
     */
    function handleRemoveRefeicao(id: number) {
        const target = Number(id);
        
        // Remove do backend
        diaObjeto.apagarRefeicao(id.toString())
        
        // Fecha a aba de edição se estiver aberta
        setAbas(prev => {
            const abaParaRemover = prev.find(a => Number(a.id) === target);
            if (abaParaRemover) {
                const filtered = prev.filter(a => a.uid !== abaParaRemover.uid);
                // Retorna para aba "Refeições" (id=0)
                return filtered.map(a => ({ ...a, ativa: Number(a.id) === 0 }));
            }
            return prev;
        });
        
        // Remove da lista local e reindexa IDs
        setRefeicoes(prev => {
            const filtered = prev.filter(r => Number(r.id) !== target);
            return filtered.map((r, i) => ({ ...r, id: i + 1 }));
        });
    }

    // ================================================
    // SISTEMA DE ABAS
    // ================================================

    // Lista de abas abertas (aba fixa "Refeições" + abas de edição)
    const [abas, setAbas] = useState<any[]>([{ id: 0, titulo: 'Refeições', uid: 'tab-refeicoes', ativa: true }]);
    
    // Chave para forçar remontagem do componente Refeicao quando necessário
    const [refreshKey, setRefreshKey] = useState(0);

    /**
     * Abre aba de edição para uma refeição
     * Reutiliza aba existente se já estiver aberta
     * @param id - ID da refeição
     * @param titulo - Título opcional da aba
     */
    function abrirAbaEdicao(id: number, titulo?: string) {
        // Verifica se já existe aba para esta refeição
        const existe = abas.find(a => Number(a.id) === Number(id));
        const refeicao = refeicoes.find(r => Number(r.id) === Number(id));
        const abaTitulo = refeicao ? (refeicao.tipo ?? titulo ?? 'Editar') : (titulo ?? 'Editar');

        if (existe) {
            // Seleciona aba existente
            setAbas(prev => prev.map(a => ({ ...a, ativa: a.uid === existe.uid, titulo: a.uid === existe.uid ? abaTitulo : a.titulo })));
            selecionarAba(existe.uid);
            return;
        }

        // Cria nova aba e seleciona
        const uid = `aba-${Date.now()}-${id}`;
        setAbas(prev => prev.map(a => ({ ...a, ativa: false })).concat({ id, titulo: abaTitulo, uid, ativa: true }));
        selecionarAba(uid);
    }

    /**
     * Fecha aba de edição
     * @param uid - UID único da aba
     */
    function fecharAba(uid: string) {
        setAbas(prev => {
            const filtered = prev.filter(a => a.uid !== uid);
            // Retorna para aba "Refeições" (id=0)
            return filtered.map(a => ({ ...a, ativa: Number(a.id) === 0 }));
        });
    }

    /**
     * Seleciona aba ativa
     * Recarrega dados do backend antes da troca
     * @param uid - UID único da aba
     */
    function selecionarAba(uid: string) {
        console.log("Aba selecionada:", uid);
        console.log("Estado de diaObjeto.dia ao selecionar aba:", diaObjeto.dia);
        
        // Recarrega dados do backend para garantir sincronização
        fetchRefeicoes();
        
        setAbas(prev => prev.map(a => ({ ...a, ativa: a.uid === uid })));
        
        // Força remontagem do componente para exibir dados atualizados
        setRefreshKey(prev => prev + 1);
    }


    // manter títulos das abas sincronizados com o tipo da refeição
    useEffect(() => {
        setAbas(prev => prev.map(a => {
            const r = refeicoes.find((x: any) => Number(x.id) === Number(a.id));
            if (r && r.tipo && r.tipo !== a.titulo) {
                return { ...a, titulo: r.tipo };
            }
            return a;
        }));
    }, [refeicoes]);

    // Handler para quando o tipo de uma refeição muda
    function handleTipoChange(refeicaoId: number, novoTipo: string) {
        // Atualiza o tipo da refeição no estado local
        setRefeicoes(prev => prev.map(r => Number(r.id) === Number(refeicaoId) ? { ...r, tipo: novoTipo } : r));
        
        // Sincroniza com backend via diaObjeto
        diaObjeto.editarTipoRefeicao(refeicaoId.toString(), novoTipo);
        
        // Títulos das abas serão sincronizados automaticamente pelo useEffect acima
    }


    // Estado para conteúdo da aba selecionada

    // Função para mostrar o conteúdo da aba selecionada



    return (
        // Janela a direita (desktop) / Janela aberta ao clicar em um dia (Mobile) 
        <section className="janela">

            {/* Abas de nevegação  */}
            <nav className="janela-abas">

                {/* Aba 0 = display do dia selecionado  */}
                <a className="aba" id="data-display">
                    {dataDisplay ?? (CalendarioController.dataSelecionada || '').replaceAll("-", "/")}
                </a>

                {/* Abas criadas dinamicamente  */}
                {abas.map((a: any) => (
                    <Aba
                        key={a.uid}
                        id={a.id}
                        titulo={a.titulo}
                        ativa={a.ativa}
                        closable={a.id !== 0}
                        onClose={() => fecharAba(a.uid)}
                        onSelect={() => selecionarAba(a.uid)} />
                ))}
            </nav>

            {/* Conteúdo da janela de refeições (refeições do dia selecionado)  */}
            <section className="refeicoes-conteudo">
                {/* Lista de refeições do dia selecionado  */}
                <div className="lista-de-refeicoes">
                    {(() => {
                        const ativa = abas.find((a: any) => a.ativa)?.id ?? 0;
                        // se a aba ativa for a aba fixa (id 0), mostra a lista de refeições
                        if (Number(ativa) === 0) {
                            return (
                                <>
                                    {/* Botão de adicionar refeição  */}
                                    <div
                                        className="refeicao model-refeicao"
                                        data-value="0"
                                        role="button"
                                        tabIndex={0}
                                        onClick={handleAddRefeicao}
                                    >
                                        <a className="botao-adicionar-refeicao">+</a>
                                        <span className="refeicao-list-label-add">Adicionar refeição</span>
                                    </div>

                                    {/* Item de refeição criado dinamicamente */}
                                    {refeicoes.map((refeicao: any) => (
                                        <Refeicoes key={refeicao.uid}
                                            id={refeicao.id}
                                            tipo={refeicao.tipo ? refeicao.tipo : "Nova Refeição"}
                                            titulo={(refeicao.alimentos || []).map((a: any) => a.alimento).join(" • ")}
                                            onDelete={handleRemoveRefeicao}
                                            adicionarAba={abrirAbaEdicao}
                                        />
                                    ))}
                                </>
                            )
                        }

                        // se não for a aba fixa, não renderiza nada aqui (lista fica vazia)
                        return null;
                    })()}
                </div>
            </section>

            {/* Conteúdo de uma refeição (renderizado como sibling de refeicoes-conteudo) */}
            {(() => {
                const abaAtiva = abas.find((a: any) => a.ativa);
                const ativa = abaAtiva?.id ?? 0;
                // só renderiza Refeicao se uma aba de edição estiver ativa (id !== 0)
                if (Number(ativa) !== 0) {
                    const refeicaoSelecionada = refeicoes.find((r: any) => Number(r.id) === Number(ativa));
                    // key com refreshKey força remontagem quando aba é selecionada, carregando dados atualizados
                    return <Refeicao key={`${abaAtiva?.uid}-${refreshKey}`} refeicao={refeicaoSelecionada} onTipoChange={handleTipoChange} onRefreshNeeded={fetchRefeicoes} />;
                }
                return null;
            })()}

        </section>
    )
}

export default Janela