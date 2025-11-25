import { useState, useEffect } from "react"
import "../../../styles/janela/refeicoes/refeicao.css"
import "../../../styles/janela/alimentos/alimentos.css"
import "../../../styles/janela/alimentos/alimentos-mobile.css"

import NutryoFetch from "../../../utils/nutryoFetch.ts"
import CalendarioController from "../../../controllers/calendario/calendarioController"
import Alimento from "../alimentos/alimento.tsx"
import diaObjeto from "../../../utils/diaObjeto.ts"

interface RefeicaoProps {
    refeicao?: any;
    onTipoChange?: (refeicaoId: number, novoTipo: string) => void;
    onRefreshNeeded?: () => void;
}

function Refeicao({ refeicao, onTipoChange, onRefreshNeeded }: RefeicaoProps) {
    const tipo = refeicao?.tipo ?? 'Selecione o tipo';
    const [listaAberta, setListaAberta] = useState(false);
    const [alimentos, setAlimentos] = useState<any[]>([]);

    // Buscar alimentos da refeição ao montar ou quando mudar a refeição selecionada
    useEffect(() => {
        if (refeicao?._id) {
            // Busca primeiro do diaObjeto local (mais atualizado), depois do NutryoFetch (cache)
            const refeicaoIndex = Number(refeicao._id) - 1;
            const refeicaoNoDiaObjeto = diaObjeto.dia?.refeicoes?.[refeicaoIndex];
            const alimentosBuscados = refeicaoNoDiaObjeto?.alimentos ?? 
                                      NutryoFetch.retornaAlimentosDaRefeicao(CalendarioController.dataSelecionada, refeicao._id);
            
            // Normalizar alimentos com id sequencial (1..N) e uid estável
            const normalized = (alimentosBuscados || []).map((a: any, idx: number) => {
                // truncar/ignorar decimais vindos do backend
                const peso = a.peso != null ? Math.trunc(Number(a.peso)) : 0;
                const calorias = a.calorias != null ? Math.trunc(Number(a.calorias)) : 0;
                const proteinas = a.proteinas != null ? Math.trunc(Number(a.proteinas)) : 0;
                const carboVal = (a.carboidratos ?? a.carbos) != null ? Math.trunc(Number(a.carboidratos ?? a.carbos)) : 0;
                const gorduras = a.gorduras != null ? Math.trunc(Number(a.gorduras)) : 0;

                return {
                    ...a,
                    id: idx + 1,
                    uid: a._id ?? `local-alimento-${Date.now()}-${idx}`,
                    peso,
                    calorias,
                    proteinas,
                    carboidratos: carboVal,
                    carbos: carboVal,
                    gorduras
                };
            });
            setAlimentos(normalized);
        } else {
            setAlimentos([]);
        }
    }, [refeicao?._id]);

    // Função para adicionar alimento
    function handleAddAlimento() {
        setAlimentos(prev => {
            const newId = prev.length + 1;
            const uid = `local-alimento-${Date.now()}`;
            const novoAlimento = { _id: null, alimento: 'Novo alimento', peso: 0, calorias: 0, proteinas: 0, carbos: 0, gorduras: 0, id: newId, uid } as any;
            console.log(`ADD Alimento:`, novoAlimento);
            return [...prev, novoAlimento];
        });
    }

    // Função para remover alimento
    function handleRemoveAlimento(alimentoId: number, refeicaoId?: number) {
        const target = Number(alimentoId);
        const refId = refeicaoId ?? refeicao?._id;
        console.log(`REMOVE Alimento id=${target} da Refeição id=${refId}`);
        if (refId) {
            diaObjeto.apagarAlimento(refId.toString(), target.toString());
        }
        setAlimentos(prev => {
            const filtered = prev.filter(a => Number(a.id) !== target);
            const reindexed = filtered.map((a, i) => ({ ...a, id: i + 1 }));
            console.log(`[Refeição ${refeicao?.id}] Alimentos após remoção e reindexação:`, reindexed);

            return reindexed;
        });
    }

    // Função para atualizar um alimento (nome / peso / macros)
    function handleUpdateAlimento(id: number, changes: { alimento?: string; peso?: number; calorias?: number; proteinas?: number; carbos?: number; gorduras?: number }) {
        setAlimentos(prev => {
            const updated = prev.map(a => {
                if (Number(a.id) !== Number(id)) return a;
                const next = { ...a } as any;
                if (changes.alimento !== undefined) next.alimento = changes.alimento;
                if (changes.peso !== undefined) next.peso = Math.trunc(Number(changes.peso)) || 0;
                if (changes.calorias !== undefined) next.calorias = Math.trunc(Number(changes.calorias)) || 0;
                if (changes.proteinas !== undefined) next.proteinas = Math.trunc(Number(changes.proteinas)) || 0;
                if (changes.carbos !== undefined) {
                    next.carbos = Math.trunc(Number(changes.carbos)) || 0;
                    next.carboidratos = next.carbos;
                }
                if (changes.gorduras !== undefined) next.gorduras = Math.trunc(Number(changes.gorduras)) || 0;
                return next;
            });

            // Sincroniza alteração com o objeto de dia (persistência otimista)
            try {
                const refeicaoIdentificador = refeicao?._id != null ? refeicao._id : refeicao?.id;
                if (refeicaoIdentificador != null) {
                    const localIndex = String(Number(refeicaoIdentificador) - 1); // índice da refeição no array
                    const itemAlterado = updated.find(a => Number(a.id) === Number(id));
                    if (itemAlterado) {
                        // Verifica se a refeição já existe em diaObjeto.dia
                        const refeicaoExiste = diaObjeto.dia?.refeicoes?.[Number(localIndex)];
                        const alimentosExistem = refeicaoExiste?.alimentos?.length > 0;

                        // Se não existem alimentos ainda, usa gerarAlimento (primeiro alimento da refeição)
                        if (!alimentosExistem) {
                            diaObjeto.gerarAlimento(
                                String(refeicaoIdentificador),
                                String(itemAlterado.id),
                                itemAlterado.alimento ?? 'Novo alimento',
                                itemAlterado.peso ?? 0,
                                itemAlterado.calorias ?? 0,
                                itemAlterado.proteinas ?? 0,
                                itemAlterado.carboidratos ?? itemAlterado.carbos ?? 0,
                                itemAlterado.gorduras ?? 0
                            );
                            console.log(diaObjeto.dia)
                        } else {
                            // Se já existem alimentos, usa atualizarDia normalmente
                            if (!itemAlterado._id) itemAlterado._id = String(itemAlterado.id);
                            const objetoAlimento = {
                                _id: itemAlterado._id,
                                alimento: itemAlterado.alimento,
                                peso: itemAlterado.peso ?? 0,
                                calorias: itemAlterado.calorias ?? 0,
                                proteinas: itemAlterado.proteinas ?? 0,
                                carboidratos: itemAlterado.carboidratos ?? itemAlterado.carbos ?? 0,
                                gorduras: itemAlterado.gorduras ?? 0
                            };
                            diaObjeto.atualizarDia("alimento", localIndex, objetoAlimento);
                            console.log(diaObjeto.dia)
                        }
                    }
                }
            } catch (e) {
                console.log(diaObjeto.dia)
                console.warn("Falha ao sincronizar alimento em diaObjeto", e);
            }
            return updated;
        });
    }
    return (
        //  Conteúdo de uma refeição
        <section className="refeicao-conteudo">
            {/* Seletor de tipo da refeição  */}
            <div className="refeicao-tipo">
                <div className="refeicao-tipo-label">
                    tipo:
                </div>
                <div className={`refeicao-tipo-tipoSelecionado`} role="button" tabIndex={0}
                    onClick={() => setListaAberta(v => !v)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setListaAberta(v => !v); }}>
                    <span className="refeicao-tipo-tipoSelecionado-label">{tipo}</span>
                    <span className="refeicao-tipo-list-expandIcon">
                        <i className="fa fa-caret-down" aria-hidden="true"></i>
                    </span>
                </div>
                {/* Itens da lista de tipos de uma refeição  */}
                <ul className={`refeicao-tipo-list ${listaAberta ? 'listaTipoAberta' : 'listaTipoFechada'}`}>
                    {['Café da Manhã', 'Almoço', 'Lanche da Tarde', 'Janta', 'Ceia', 'Outro'].map((item) => (
                        <li key={item} role="button" tabIndex={0} onClick={() => {
                            // atualiza label localmente e fecha lista
                            setListaAberta(false);
                            // notifica o parent para atualizar o título da aba e o tipo na refeição
                            if (refeicao && onTipoChange) onTipoChange(refeicao.id, item);
                        }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setListaAberta(false); if (refeicao && onTipoChange) onTipoChange(refeicao.id, item); } }}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sessão de alimentos  */}
            <section className="alimentos">

                {/* Título do alimento  */}
                <div className="alimentos-titulo">Alimentos</div>

                {/* Divisor  */}
                <div className="alimentos-divisor"></div>

                {/* Sessão de alimentos adicionados  */}
                <div className="alimentos-adicionados">

                    {/* Botão de adicionar alimentos a uma refeição  */}
                    <div className="alimento-item model-alimento" onClick={handleAddAlimento} role="button" tabIndex={0}>
                        <a className="botao-adicionar-alimento">+</a>
                        <span className="alimento-label">Adicionar alimento</span>
                    </div>

                    {/* Renderizar alimentos da refeição */}
                    {alimentos.map((alimento: any) => (
                        <Alimento
                            key={alimento.uid}
                            id={alimento.id}
                            refeicaoId={refeicao?._id}
                            nome={alimento.alimento}
                            peso={alimento.peso}
                            calorias={alimento.calorias}
                            proteinas={alimento.proteinas}
                            carbos={alimento.carboidratos}
                            gorduras={alimento.gorduras}
                            onDelete={handleRemoveAlimento}
                            onUpdate={handleUpdateAlimento}
                        />
                    ))}
                </div>
            </section>
        </section>
    )
}

export default Refeicao;