/**
 * Componente Alimento
 * 
 * Gerencia a exibição e edição de um alimento individual dentro de uma refeição.
 * 
 * Funcionalidades principais:
 * - Busca de alimentos na base de dados via autocomplete
 * - Cálculo automático de macronutrientes baseado no peso informado
 * - Edição inline de nome, peso e valores nutricionais
 * - Normalização de campos (lipidios → gorduras, carboidrato → carbos)
 * - Sincronização com componente pai via callbacks
 * - Cálculo proporcional (valores base para 100g, ajustados pelo peso)
 * 
 * @component
 */

import { useState, useEffect } from "react";
import ListaAlimentos from "./listaAlimentos";
import BuscarAlimentos from "../../../utils/buscarAlimento";

import "../../../styles/janela/alimentos/alimentos.css"
import "../../../styles/janela/alimentos/alimentos-mobile.css"

/**
 * Props do componente Alimento
 * 
 * @interface AlimentoProps
 * @property {number} id - ID sequencial do alimento na lista da refeição
 * @property {number} [refeicaoId] - ID da refeição à qual o alimento pertence
 * @property {string} [nome] - Nome do alimento
 * @property {number} [peso] - Peso consumido em gramas
 * @property {number} [calorias] - Calorias calculadas para o peso informado
 * @property {number} [proteinas] - Proteínas em gramas
 * @property {number} [carbos] - Carboidratos em gramas
 * @property {number} [gorduras] - Gorduras em gramas
 * @property {function} [onDelete] - Callback para remoção do alimento
 * @property {function} [onUpdate] - Callback para atualização de propriedades do alimento
 */
interface AlimentoProps {
    id: number;
    refeicaoId?: number;
    nome?: string;
    peso?: number;
    calorias?: number;
    proteinas?: number;
    carbos?: number;
    gorduras?: number;
    onDelete?: (id: number, refeicaoId?: number) => void;
    onUpdate?: (id: number, changes: { alimento?: string; peso?: number; calorias?: number; proteinas?: number; carbos?: number; gorduras?: number }) => void;
}

function Alimento({ id, refeicaoId, nome, peso, calorias, proteinas, carbos, gorduras, onDelete, onUpdate }: AlimentoProps) {
    // Estado para controlar modo de edição (exibe painel com inputs detalhados)
    const [editando, setEditando] = useState(false);
    
    // Nome local controlado - permite digitação sem salvar imediatamente
    const [nomeLocal, setNomeLocal] = useState(nome ?? "");
    
    // Peso local controlado - atualiza cálculos de macros em tempo real
    const [pesoLocal, setPesoLocal] = useState<number | string>(peso ?? "");
    
    // Resultados da busca de alimentos (autocomplete)
    const [resultadoBusca, setResultadoBusca] = useState<any[]>([]);
    
    // Alimento selecionado da busca - armazena valores nutricionais base (para 100g)
    const [alimentoSelecionado, setAlimentoSelecionado] = useState<any>(null);

    // Macros calculados dinamicamente baseados no peso informado
    // Valores truncados para inteiros (sem decimais)
    const [macrosCalculados, setMacrosCalculados] = useState({
        calorias: Math.round(Number(calorias ?? 0)),
        proteinas: Math.round(Number(proteinas ?? 0)),
        carbos: Math.round(Number(carbos ?? 0)),
        gorduras: Math.round(Number(gorduras ?? 0))
    });

    /**
     * Alterna o modo de edição do alimento
     */
    function toggleEdit() {
        setEditando(v => !v);
    }

    /**
     * Handler do input de busca de alimento
     * 
     * @param {string} valor - Texto digitado pelo usuário
     * 
     * Comportamento:
     * - Atualiza nome local conforme digitação
     * - Busca alimentos na base de dados se valor não vazio
     * - Limpa resultados se campo vazio
     */
    async function handleAlimentoInputChange(valor: string) {
        // Atualiza apenas localmente (não notifica parent ainda)
        setNomeLocal(valor);
        
        // Busca alimentos na base de dados se houver texto
        if (valor.trim().length > 0) {
            const resultados = await BuscarAlimentos.buscar(valor);
            setResultadoBusca(resultados);
            console.log('Resultados da busca:', resultados);
        } else {
            setResultadoBusca([]);
        }
    }

    /**
     * Handler quando um alimento é selecionado da lista de autocomplete
     * 
     * @param {any} alimento - Objeto do alimento selecionado da base de dados
     * 
     * Processo:
     * 1. Armazena alimento selecionado para uso nos cálculos
     * 2. Atualiza nome local
     * 3. Normaliza campos (lipidios → gorduras, carboidrato → carbos)
     * 4. Define peso padrão de 100g
     * 5. Calcula macros para 100g
     * 6. Notifica componente pai com todas as alterações
     * 7. Fecha lista de resultados
     */
    function handleSelectAlimento(alimento: any) {
        // armazena o alimento selecionado para uso nos cálculos
        setAlimentoSelecionado(alimento);
        
        // Atualiza nome local
        setNomeLocal(alimento.nome);
        
        // Mapeia os campos da API para os campos esperados (lipidios → gorduras, carboidrato → carbos)
        const gorduras = alimento.lipidios ?? alimento.gorduras ?? 0;
        const carbos = alimento.carboidrato ?? alimento.carbos ?? 0;
        
        // Usa 100g como peso de referência (valores da base são para 100g)
        const pesoParaCalculo = 100;
        
        // Converte strings para números com parseFloat para garantir valores corretos
        const baseCal = parseFloat(String(alimento.calorias ?? 0));
        const baseProt = parseFloat(String(alimento.proteinas ?? 0));
        const baseCarb = parseFloat(String(carbos));
        const baseGord = parseFloat(String(gorduras));

        console.log('Valores base da API:', { baseCal, baseProt, baseCarb, baseGord });

        // Os valores do banco já são para 100g, então com peso 100 é direto
        const c = Math.round(baseCal || 0);
        const p = Math.round(baseProt || 0);
        const cb = Math.round(baseCarb || 0);
        const g = Math.round(baseGord || 0);

        setMacrosCalculados({ calorias: c, proteinas: p, carbos: cb, gorduras: g });
        
        // Reseta o peso para 100g ao selecionar um novo alimento
        setPesoLocal(100);
        
        // Atualiza nome, peso E macros calculados em uma única chamada ao componente pai
        onUpdate && onUpdate(id, { 
            alimento: alimento.nome, 
            peso: 100,
            calorias: c,
            proteinas: p,
            carbos: cb,
            gorduras: g
        });
        
        // Fecha a lista de resultados
        setResultadoBusca([]);
        
        console.log('Alimento selecionado:', alimento.nome);
        console.log('Macros calculados para 100g:', { calorias: c, proteinas: p, carbos: cb, gorduras: g });
    }

    /**
     * Calcula macronutrientes proporcionalmente ao peso informado
     * 
     * @param {HTMLElement|null} element - Elemento DOM para buscar valores base em data-*
     * @param {number} pesoConsumido - Peso em gramas para cálculo proporcional
     * @returns {object} Objeto com calorias, proteinas, carbos e gorduras calculados
     * 
     * Prioridade de fontes de dados:
     * 1. alimentoSelecionado (mais recente, da busca)
     * 2. data-* attributes do elemento DOM
     * 3. props do componente
     * 
     * Cálculo: (pesoConsumido * valorBase100g) / 100
     */
    function calculaMacrosAPartirDoElemento(element: HTMLElement | null, pesoConsumido: number) {
        // se há um alimento selecionado recentemente, usa seus valores (mais confiável)
        if (alimentoSelecionado) {
            const baseCal = parseFloat(String(alimentoSelecionado.calorias ?? 0));
            const baseProt = parseFloat(String(alimentoSelecionado.proteinas ?? 0));
            const baseCarb = parseFloat(String(alimentoSelecionado.carboidrato ?? alimentoSelecionado.carbos ?? 0));
            const baseGord = parseFloat(String(alimentoSelecionado.lipidios ?? alimentoSelecionado.gorduras ?? 0));

            const referencia = 100; // Valores base são para 100g
            const c = Math.round((pesoConsumido * (baseCal || 0)) / referencia);
            const p = Math.round((pesoConsumido * (baseProt || 0)) / referencia);
            const cb = Math.round((pesoConsumido * (baseCarb || 0)) / referencia);
            const g = Math.round((pesoConsumido * (baseGord || 0)) / referencia);

            return { calorias: c, proteinas: p, carbos: cb, gorduras: g };
        }

        // Encontra dataset do elemento .alimento-selecao para valores armazenados em data-*
        const selecao = element?.querySelector('.alimento-selecao') as HTMLElement | null;
        const ds = selecao?.dataset;

        // Busca valores base dos atributos data-* ou props
        const baseCal = ds && ds.calorias ? parseFloat(ds.calorias) : parseFloat(String(calorias ?? 0));
        const baseProt = ds && ds.proteinas ? parseFloat(ds.proteinas) : parseFloat(String(proteinas ?? 0));
        // Considera variações de nome (carboidrato / carbos / carbo)
        const baseCarb = ds && (ds.carbo || ds.carboidrato) ? parseFloat(ds.carbo ?? ds.carboidrato ?? '0') : parseFloat(String(carbos ?? 0));
        // Considera variações de nome (lipidios / gorduras)
        const baseGord = ds && (ds.gorduras || ds.lipidios) ? parseFloat(ds.gorduras ?? ds.lipidios ?? '0') : parseFloat(String(gorduras ?? 0));

        const referencia = 100; // Valores base são para 100g
        const c = Math.round((pesoConsumido * (baseCal || 0)) / referencia);
        const p = Math.round((pesoConsumido * (baseProt || 0)) / referencia);
        const cb = Math.round((pesoConsumido * (baseCarb || 0)) / referencia);
        const g = Math.round((pesoConsumido * (baseGord || 0)) / referencia);

        return { calorias: c, proteinas: p, carbos: cb, gorduras: g };
    }

    /**
     * Handler do input de peso
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança do input
     * 
     * Comportamento:
     * 1. Atualiza peso local (truncando decimais)
     * 2. Recalcula macros proporcionalmente ao novo peso
     * 3. Notifica componente pai apenas se valor não vazio
     * 4. Permite campo vazio temporariamente (exibe vazio, trata como 0)
     */
    function handlePesoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;
        const pesoNum = raw === "" ? 0 : Math.trunc(Number(raw) || 0); // Trunca decimais
        setPesoLocal(raw === "" ? "" : pesoNum);

        // Encontra elemento pai (alimento-item) para localizar .alimento-selecao
        const inputEl = e.target as HTMLElement;
        const alimentoItem = inputEl.closest('.alimento-item') as HTMLElement | null;

        // Recalcula macros com o novo peso
        const calculados = calculaMacrosAPartirDoElemento(alimentoItem, pesoNum);
        setMacrosCalculados(calculados);

        // Notifica o componente pai apenas sobre o peso
        // Se o usuário limpou o input (raw === ""), não sobrescreve o parent com 0
        // Permite exibição vazia enquanto trata internamente como 0
        if (raw !== "") {
            onUpdate && onUpdate(id, { peso: pesoNum });
        }
    }

    /**
     * Efeito para sincronizar props com estados locais
     * 
     * Executa quando:
     * - Componente é montado
     * - Props de peso, calorias, proteinas, carbos, gorduras ou nome mudam
     * 
     * Atualiza:
     * - Nome local
     * - Peso local (vazio se 0, para melhor UX)
     * - Macros calculados baseados em data-* do DOM ou props
     */
    useEffect(() => {
        // Sincroniza nome local com prop
        setNomeLocal(nome ?? "");
        // Não mostrar 0 no input — se o peso for 0 ou ausente, exibe vazio (melhor UX)
        setPesoLocal(peso && Number(peso) !== 0 ? peso : "");
        // Usa o elemento DOM atual para obter data-* (se disponível)
        const root = document.querySelector(`[data-value=\"${id}\"]`) as HTMLElement | null;
        const calculados = calculaMacrosAPartirDoElemento(root, Number(peso ?? 0));
        setMacrosCalculados(calculados);
    }, [peso, calorias, proteinas, carbos, gorduras, nome]);

    return (
        <div className={`alimento-item ${editando ? 'editando' : ''}`} data-value={id}>
            {/* Botão para ativar modo de edição */}
            <a className="botao-editar-alimento" role="button" tabIndex={0} onClick={toggleEdit} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleEdit(); }}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </a>
            {/* Label principal exibindo nome e macros resumidos */}
            <span className="alimento-label">
                <h1>
                    {nomeLocal ? nomeLocal : "Novo alimento"}</h1>
                {/* Mostrar peso atual: prioriza pesoLocal (input), senão usa peso prop se >0 */}
                {(pesoLocal !== "" && pesoLocal !== null) ? `${pesoLocal} g • ` : (peso && Number(peso) > 0 ? `${peso} g • ` : "")}
                {/* Mostrar macros calculados (valores inteiros) */}
                {macrosCalculados.calorias ? `${macrosCalculados.calorias} kcal • ` : ""}
                {macrosCalculados.proteinas ? `${macrosCalculados.proteinas} g proteínas • ` : ""}
                {macrosCalculados.carbos ? `${macrosCalculados.carbos} g carbos • ` : ""}
                {macrosCalculados.gorduras ? `${macrosCalculados.gorduras} g gorduras` : ""}
            </span>
            {/* Botão para apagar alimento */}
            <div className="botao-apagar-alimento" role="button" tabIndex={0} onClick={() => onDelete && onDelete(id, refeicaoId)}>
                <i className="fa fa-trash" aria-hidden="true"></i>
            </div>
            {/* Painel de edição (visível apenas quando editando === true) */}
            <div className={`alimento-item-janelaEdicao ${editando ? 'janelaEdicao-aberta' : ''}`}>
                <div className="alimento-consumo">
                    {/* Campo de seleção de alimento com autocomplete */}
                    <div className="alimento-selecao"
                    data-peso={peso}
                    data-calorias={calorias}
                    data-proteinas={proteinas}
                    data-gorduras={gorduras}
                    data-carbo={carbos}
                    >
                        <span className="selecao-label">
                            Alimento:
                        </span>
                        <span className="selecao-valor">
                            <input type="text" 
                            id="selecao-valor-texto" 
                            value={nomeLocal} 
                            className="selecao-valor-texto" 
                            placeholder="Selecione alimento" 
                            autoComplete="off"
                            onChange={(e) => handleAlimentoInputChange(e.target.value)} />
                        </span>
                        {/* Lista de resultados da busca (autocomplete) */}
                        {resultadoBusca.length > 0 && <ListaAlimentos alimentos={resultadoBusca} onSelect={handleSelectAlimento} />}
                    </div>
                    {/* Campo de input do peso consumido */}
                    <div className="alimento-pesoConsumido">
                        <div className="peso-label">
                            Peso:
                        </div>
                        <div className="peso-valor">
                            <input type="number" id="peso-valor-texto" className="peso-valor-texto" placeholder="Peso consumido" value={pesoLocal ?? ''} autoComplete="off" onChange={handlePesoChange} />
                        </div>
                    </div>
                </div>
                {/* Exibição detalhada dos macronutrientes calculados */}
                <div className="alimento-macros">
                    <div className="calorias">
                        <div className="macros-label">
                            <span className="macros-label-valor">
                                Calorias
                            </span>
                        </div>
                        <span className="macros-valor">
                            {macrosCalculados.calorias ?? 0}
                        </span>
                    </div>
                    <div className="proteinas">
                        <div className="macros-label">
                            <span className="macros-label-valor">
                                Proteínas
                            </span>
                        </div>
                        <span className="macros-valor">
                            {macrosCalculados.proteinas ?? 0}
                        </span>
                    </div>
                    <div className="carboidratos">
                        <div className="macros-label">
                            <span className="macros-label-valor">
                                Carbos
                            </span>
                        </div>
                        <span className="macros-valor">
                            {macrosCalculados.carbos ?? 0}
                        </span>
                    </div>
                    <div className="gorduras">
                        <div className="macros-label">
                            <span className="macros-label-valor">
                                Gorduras
                            </span>
                        </div>
                        <span className="macros-valor">
                            {macrosCalculados.gorduras ?? 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Alimento;