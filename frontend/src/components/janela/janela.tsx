import { useState, useEffect } from "react"

// CSS
import "../../styles/janela/janela.css"
import "../../styles/janela/janela-mobile.css"
import "../../styles/janela/refeicoes/refeicoes.css"
import "../../styles/janela/refeicoes/refeicoes-mobile.css"

import CalendarioController from "../../controllers/calendario/calendarioController"
// import RefeicoesController from "../../controllers/refeicoes/refeicoesController"
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

    const [refeicoes, setRefeicoes] = useState<any[]>([]);

    // Função para carregar refeições (extraída para poder ser chamada manualmente)
    async function fetchRefeicoes() {
        const res = await NutryoFetch.retornaRefeicoesDoDia(CalendarioController.dataSelecionada) as any[] | null;
        const list = res ?? [];
        const normalized = list.map((r: any, idx: number) => ({ ...r, id: idx + 1, uid: r._id ?? `local-${Date.now()}-${idx}` }));
        setRefeicoes(normalized);
    }

    // Carregar refeições ao mudar a data selecionada
    useEffect(() => {
        fetchRefeicoes();
    }, [CalendarioController.dataSelecionada])

    // Ao mudar a data selecionada, fecha todas as abas (mantém apenas a fixa id=0)
    useEffect(() => {
        setAbas([{ id: 0, titulo: 'Refeições', uid: 'tab-refeicoes', ativa: true }]);
    }, [CalendarioController.dataSelecionada]);

    // Função para adicionar refeição
    function handleAddRefeicao() {
        setRefeicoes(prev => {
            const newId = prev.length + 1;
            const uid = `local-${Date.now()}`;
            const novaRefeicao = { _id: null, tipo: 'Nova Refeição', alimentos: [], id: newId, uid } as any;
            
            // Gera refeição no diaObjeto para sincronização com backend
            diaObjeto.gerarRefeicao(newId, 'Nova Refeição', []);
            console.log(diaObjeto.dia)
            
            return [...prev, novaRefeicao];
        });
    }

    // Função para remover refeição
    function handleRemoveRefeicao(id: number) {
        const target = Number(id);
        diaObjeto.apagarRefeicao(id.toString())
        
        // Fecha a aba da refeição removida (se estiver aberta)
        setAbas(prev => {
            const abaParaRemover = prev.find(a => Number(a.id) === target);
            if (abaParaRemover) {
                const filtered = prev.filter(a => a.uid !== abaParaRemover.uid);
                // Seleciona a aba "Refeições" após fechar
                return filtered.map(a => ({ ...a, ativa: Number(a.id) === 0 }));
            }
            return prev;
        });
        
        setRefeicoes(prev => {
            const filtered = prev.filter(r => Number(r.id) !== target);
            return filtered.map((r, i) => ({ ...r, id: i + 1 }));
        });
    }

    // Estado para abas
    const [abas, setAbas] = useState<any[]>([{ id: 0, titulo: 'Refeições', uid: 'tab-refeicoes', ativa: true }]);
    
    // Estado para forçar refresh do componente Refeicao quando dados mudam
    const [refreshKey, setRefreshKey] = useState(0);

    function abrirAbaEdicao(id: number, titulo?: string) {
        // verifica se já existe uma aba para essa refeição
        const existe = abas.find(a => Number(a.id) === Number(id));
        const refeicao = refeicoes.find(r => Number(r.id) === Number(id));
        const abaTitulo = refeicao ? (refeicao.tipo ?? titulo ?? 'Editar') : (titulo ?? 'Editar');

        if (existe) {
            // atualiza e seleciona a aba existente
            setAbas(prev => prev.map(a => ({ ...a, ativa: a.uid === existe.uid, titulo: a.uid === existe.uid ? abaTitulo : a.titulo })));
            selecionarAba(existe.uid);
            return;
        }

        // cria uma nova aba e seleciona
        const uid = `aba-${Date.now()}-${id}`;
        setAbas(prev => prev.map(a => ({ ...a, ativa: false })).concat({ id, titulo: abaTitulo, uid, ativa: true }));
        selecionarAba(uid);
    }

    // Função para fechar aba
    function fecharAba(uid: string) {
        setAbas(prev => {
            // remove a aba solicitada
            const filtered = prev.filter(a => a.uid !== uid);
            // garante que a aba fixa (id === 0) fique selecionada após o fechamento
            return filtered.map(a => ({ ...a, ativa: Number(a.id) === 0 }));
        });
    }

    // Função para selecionar aba
    function selecionarAba(uid: string) {
        console.log("Aba selecionada:", uid);
        console.log("Estado de diaObjeto.dia ao selecionar aba:", diaObjeto.dia);
        
        // Recarrega refeições do backend antes de trocar de aba
        fetchRefeicoes();
        
        setAbas(prev => prev.map(a => ({ ...a, ativa: a.uid === uid })));
        // Incrementa refreshKey para forçar remontagem do componente Refeicao
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
        // atualiza o tipo da refeição no estado
        setRefeicoes(prev => prev.map(r => Number(r.id) === Number(refeicaoId) ? { ...r, tipo: novoTipo } : r));
        // títulos das abas serão sincronizados automaticamente pelo useEffect acima
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