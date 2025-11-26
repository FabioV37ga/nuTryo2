/**
 * Componente Refeição
 * 
 * Gerencia a exibição e edição de uma refeição individual, incluindo:
 * - Seleção do tipo de refeição (Café da Manhã, Almoço, etc.)
 * - Listagem e gerenciamento de alimentos associados
 * - Adição, remoção e atualização de alimentos
 * - Sincronização com o objeto de dia local (diaObjeto)
 * - Cálculo e normalização de valores nutricionais
 * 
 * @component
 */

import { useState, useEffect } from "react"
import "../../../styles/janela/refeicoes/refeicao.css"
import "../../../styles/janela/alimentos/alimentos.css"
import "../../../styles/janela/alimentos/alimentos-mobile.css"

import NutryoFetch from "../../../utils/nutryoFetch.ts"
import CalendarioController from "../../../controllers/calendario/calendarioController"
import Alimento from "../alimentos/alimento.tsx"
import diaObjeto from "../../../utils/diaObjeto.ts"

/**
 * Props do componente Refeicao
 * 
 * @interface RefeicaoProps
 * @property {any} [refeicao] - Objeto da refeição com _id, tipo e alimentos
 * @property {function} [onTipoChange] - Callback quando o tipo da refeição muda
 * @property {function} [onRefreshNeeded] - Callback para solicitar atualização do componente pai
 */
interface RefeicaoProps {
    refeicao?: any;
    onTipoChange?: (refeicaoId: number, novoTipo: string) => void;
    onRefreshNeeded?: () => void;
}

function Refeicao({ refeicao, onTipoChange, onRefreshNeeded }: RefeicaoProps) {
    // Tipo da refeição (Café da Manhã, Almoço, etc.) ou mensagem padrão
    const tipo = refeicao?.tipo ?? 'Selecione o tipo';
    
    // Estado para controlar abertura/fechamento do dropdown de tipos de refeição
    const [listaAberta, setListaAberta] = useState(false);
    
    // Estado para armazenar a lista de alimentos da refeição com IDs normalizados
    const [alimentos, setAlimentos] = useState<any[]>([]);

    /**
     * Efeito para buscar e normalizar alimentos da refeição
     * 
     * Executa quando:
     * - Componente é montado
     * - ID da refeição muda
     * 
     * Processo:
     * 1. Busca alimentos do diaObjeto local (mais atualizado)
     * 2. Caso não encontre, busca do NutryoFetch (cache)
     * 3. Normaliza valores (trunca decimais, adiciona IDs sequenciais)
     * 4. Atualiza estado local de alimentos
     */
    useEffect(() => {
        if (refeicao?._id) {
            // Busca primeiro do diaObjeto local (mais atualizado), depois do NutryoFetch (cache)
            const refeicaoIndex = Number(refeicao._id) - 1;
            const refeicaoNoDiaObjeto = diaObjeto.dia?.refeicoes?.[refeicaoIndex];
            const alimentosBuscados = refeicaoNoDiaObjeto?.alimentos ?? 
                                      NutryoFetch.retornaAlimentosDaRefeicao(CalendarioController.dataSelecionada, refeicao._id);
            
            // Normalizar alimentos com id sequencial (1..N) e uid estável para renderização React
            const normalized = (alimentosBuscados || []).map((a: any, idx: number) => {
                // Truncar/ignorar decimais vindos do backend para manter valores inteiros
                const peso = a.peso != null ? Math.trunc(Number(a.peso)) : 0;
                const calorias = a.calorias != null ? Math.trunc(Number(a.calorias)) : 0;
                const proteinas = a.proteinas != null ? Math.trunc(Number(a.proteinas)) : 0;
                const carboVal = (a.carboidratos ?? a.carbos) != null ? Math.trunc(Number(a.carboidratos ?? a.carbos)) : 0;
                const gorduras = a.gorduras != null ? Math.trunc(Number(a.gorduras)) : 0;

                return {
                    ...a,
                    id: idx + 1, // ID sequencial para UI (1, 2, 3...)
                    uid: a._id ?? `local-alimento-${Date.now()}-${idx}`, // UID estável para key do React
                    peso,
                    calorias,
                    proteinas,
                    carboidratos: carboVal,
                    carbos: carboVal, // Mantém ambos os nomes para compatibilidade
                    gorduras
                };
            });
            setAlimentos(normalized);
        } else {
            setAlimentos([]);
        }
    }, [refeicao?._id]);

    /**
     * Adiciona um novo alimento vazio à refeição
     * 
     * Cria um alimento com:
     * - ID sequencial (próximo na lista)
     * - UID único baseado em timestamp
     * - Valores nutricionais zerados
     * - Nome placeholder
     */
    function handleAddAlimento() {
        setAlimentos(prev => {
            const newId = prev.length + 1;
            const uid = `local-alimento-${Date.now()}`;
            // Assign a numeric provisional _id so newly added items have a stable ID
            const novoAlimento = { _id: Number(newId), alimento: 'Novo alimento', peso: 0, calorias: 0, proteinas: 0, carbos: 0, gorduras: 0, id: newId, uid } as any;
            return [...prev, novoAlimento];
        });
    }

    /**
     * Remove um alimento da refeição
     * 
     * @param {number} alimentoId - ID do alimento a ser removido
     * @param {number} [refeicaoId] - ID da refeição (opcional)
     * 
     * Processo:
     * 1. Remove do diaObjeto (persistência)
     * 2. Remove do estado local
     * 3. Reindexa os IDs sequenciais (1, 2, 3...)
     */
    function handleRemoveAlimento(alimentoId: number, refeicaoId?: number) {
        const target = Number(alimentoId);
        const refId = refeicaoId ?? refeicao?._id;
        console.log(`REMOVE Alimento id=${target} da Refeição id=${refId}`);
        
        // Remove do objeto de dia (persistência otimista)
        if (refId) {
            diaObjeto.apagarAlimento(refId.toString(), target.toString());
        }
        
        // Remove do estado local e reindexa IDs
        setAlimentos(prev => {
            const filtered = prev.filter(a => Number(a.id) !== target);
            const reindexed = filtered.map((a, i) => ({ ...a, id: i + 1 })); // Mantém IDs sequenciais
            console.log(`[Refeição ${refeicao?.id}] Alimentos após remoção e reindexação:`, reindexed);

            return reindexed;
        });
    }

    /**
     * Atualiza propriedades de um alimento existente
     * 
     * @param {number} id - ID do alimento a ser atualizado
     * @param {object} changes - Objeto com as propriedades a serem alteradas
     * 
     * Processo:
     * 1. Atualiza estado local com novas propriedades
     * 2. Trunca valores numéricos para inteiros
     * 3. Sincroniza com diaObjeto para persistência
     * 4. Usa gerarAlimento() para primeiro alimento, atualizarDia() para demais
     */
    function handleUpdateAlimento(id: number, changes: { alimento?: string; peso?: number; calorias?: number; proteinas?: number; carbos?: number; gorduras?: number }) {
        setAlimentos(prev => {
            // Mapeia alimentos, atualizando apenas o que corresponde ao ID fornecido
            const updated = prev.map(a => {
                if (Number(a.id) !== Number(id)) return a;
                const next = { ...a } as any;
                if (changes.alimento !== undefined) next.alimento = changes.alimento;
                if (changes.peso !== undefined) next.peso = Math.trunc(Number(changes.peso)) || 0;
                if (changes.calorias !== undefined) next.calorias = Math.trunc(Number(changes.calorias)) || 0;
                if (changes.proteinas !== undefined) next.proteinas = Math.trunc(Number(changes.proteinas)) || 0;
                if (changes.carbos !== undefined) {
                    next.carbos = Math.trunc(Number(changes.carbos)) || 0;
                    next.carboidratos = next.carbos; // Mantém sincronizados
                }
                if (changes.gorduras !== undefined) next.gorduras = Math.trunc(Number(changes.gorduras)) || 0;
                return next;
            });

            // Sincroniza alteração com o objeto de dia (persistência otimista)
            try {
                let refeicaoIdentificador = refeicao?._id ?? refeicao?.id;
                
                // Se a prop refeicao está undefined, busca a última refeição em diaObjeto
                if (refeicaoIdentificador == null && diaObjeto.dia?.refeicoes?.length > 0) {
                    // Usa a última refeição adicionada (mais recente)
                    const ultimaRefeicao = diaObjeto.dia.refeicoes[diaObjeto.dia.refeicoes.length - 1];
                    refeicaoIdentificador = ultimaRefeicao._id;
                }
                
                if (refeicaoIdentificador != null) {
                    const localIndex = String(Number(refeicaoIdentificador) - 1); // Índice da refeição no array
                    const itemAlterado = updated.find(a => Number(a.id) === Number(id));
                    console.log('handleUpdateAlimento - itemAlterado:', itemAlterado);
                    
                    if (itemAlterado) {
                        // Verifica se a refeição já existe em diaObjeto.dia
                        const refeicaoExiste = diaObjeto.dia?.refeicoes?.[Number(localIndex)];
                        const alimentosExistem = refeicaoExiste?.alimentos?.length > 0;
                        
                        console.log('handleUpdateAlimento - refeicaoExiste:', refeicaoExiste);
                        console.log('handleUpdateAlimento - alimentosExistem:', alimentosExistem);

                        // Se não existem alimentos ainda, usa gerarAlimento (primeiro alimento da refeição)
                            if (!alimentosExistem) {
                            // Pass numbers to gerarAlimento so diaObjeto stores numeric _id
                            diaObjeto.gerarAlimento(
                                Number(refeicaoIdentificador),
                                Number(itemAlterado.id),
                                itemAlterado.alimento ?? 'Novo alimento',
                                itemAlterado.peso ?? 0,
                                itemAlterado.calorias ?? 0,
                                itemAlterado.proteinas ?? 0,
                                itemAlterado.carboidratos ?? itemAlterado.carbos ?? 0,
                                itemAlterado.gorduras ?? 0
                            );
                            console.log(diaObjeto.dia)
                        } else {
                            // Se já existem alimentos, usa atualizarDia() para adicionar/atualizar normalmente
                            if (!itemAlterado._id) itemAlterado._id = Number(itemAlterado.id);
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
        // Conteúdo de uma refeição
        <section className="refeicao-conteudo">
            {/* Seletor de tipo da refeição */}
            <div className="refeicao-tipo">
                <div className="refeicao-tipo-label">
                    tipo:
                </div>
                {/* Botão que abre/fecha o dropdown de tipos */}
                <div className={`refeicao-tipo-tipoSelecionado`} role="button" tabIndex={0}
                    onClick={() => setListaAberta(v => !v)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setListaAberta(v => !v); }}>
                    <span className="refeicao-tipo-tipoSelecionado-label">{tipo}</span>
                    <span className="refeicao-tipo-list-expandIcon">
                        <i className="fa fa-caret-down" aria-hidden="true"></i>
                    </span>
                </div>
                {/* Lista dropdown com os tipos disponíveis de refeição */}
                <ul className={`refeicao-tipo-list ${listaAberta ? 'listaTipoAberta' : 'listaTipoFechada'}`}>
                    {['Café da Manhã', 'Almoço', 'Lanche da Tarde', 'Janta', 'Ceia', 'Outro'].map((item) => (
                        <li key={item} role="button" tabIndex={0} onClick={() => {
                            // Atualiza label localmente e fecha lista
                            setListaAberta(false);
                            // Notifica o componente pai para atualizar o título da aba e o tipo na refeição
                            if (refeicao && onTipoChange) onTipoChange(refeicao.id, item);
                        }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setListaAberta(false); if (refeicao && onTipoChange) onTipoChange(refeicao.id, item); } }}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Seção de alimentos */}
            <section className="alimentos">

                {/* Título da seção de alimentos */}
                <div className="alimentos-titulo">Alimentos</div>

                {/* Divisor visual */}
                <div className="alimentos-divisor"></div>

                {/* Seção com lista de alimentos adicionados */}
                <div className="alimentos-adicionados">

                    {/* Botão para adicionar novo alimento à refeição */}
                    <div className="alimento-item model-alimento" onClick={handleAddAlimento} role="button" tabIndex={0}>
                        <a className="botao-adicionar-alimento">+</a>
                        <span className="alimento-label">Adicionar alimento</span>
                    </div>

                    {/* Renderiza cada alimento da refeição como um componente Alimento */}
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