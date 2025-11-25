import { useState, useEffect } from "react";
import ListaAlimentos from "./listaAlimentos";
import BuscarAlimentos from "../../../utils/buscarAlimento";

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
    onUpdate?: (id: number, changes: { alimento?: string; peso?: number }) => void;
}

function Alimento({ id, refeicaoId, nome, peso, calorias, proteinas, carbos, gorduras, onDelete, onUpdate }: AlimentoProps) {
    const [editando, setEditando] = useState(false);
    // peso local (controlado) para cálculo imediato
    const [pesoLocal, setPesoLocal] = useState<number | string>(peso ?? "");
    // estado para armazenar resultados da busca
    const [resultadoBusca, setResultadoBusca] = useState<any[]>([]);
    // estado para armazenar os valores nutricionais do alimento selecionado
    const [alimentoSelecionado, setAlimentoSelecionado] = useState<any>(null);

    // macros calculados a partir do pesoLocal e dos valores base obtidos via data-* (ou props)
    const [macrosCalculados, setMacrosCalculados] = useState({
        calorias: Math.round(Number(calorias ?? 0)),
        proteinas: Math.round(Number(proteinas ?? 0)),
        carbos: Math.round(Number(carbos ?? 0)),
        gorduras: Math.round(Number(gorduras ?? 0))
    });

    function toggleEdit() {
        setEditando(v => !v);
    }

    // handler do input de alimento: busca alimentos ao digitar com debounce
    async function handleAlimentoInputChange(valor: string) {
        onUpdate && onUpdate(id, { alimento: valor });
        
        if (valor.trim().length > 0) {
            const resultados = await BuscarAlimentos.buscar(valor);
            setResultadoBusca(resultados);
            console.log('Resultados da busca:', resultados);
        } else {
            setResultadoBusca([]);
        }
    }

    // handler quando um alimento é selecionado da lista
    function handleSelectAlimento(alimento: any) {
        // armazena o alimento selecionado para uso nos cálculos
        setAlimentoSelecionado(alimento);
        
        // atualiza o nome do alimento
        onUpdate && onUpdate(id, { alimento: alimento.nome });
        
        // reseta o peso para 100g ao selecionar um novo alimento
        setPesoLocal(100);
        onUpdate && onUpdate(id, { peso: 100 });
        
        // mapeia os campos da API para os campos esperados (lipidios → gorduras, carboidrato → carbos)
        const gorduras = alimento.lipidios ?? alimento.gorduras ?? 0;
        const carbos = alimento.carboidrato ?? alimento.carbos ?? 0;
        
        // usa 100g como peso de referência
        const pesoParaCalculo = 100;
        
        const baseCal = alimento.calorias ?? 0;
        const baseProt = alimento.proteinas ?? 0;
        const baseCarb = carbos;
        const baseGord = gorduras;

        // os valores do banco já são para 100g, então com peso 100 é direto
        const referencia = 100;
        const c = Math.round((pesoParaCalculo * (baseCal || 0)) / referencia);
        const p = Math.round((pesoParaCalculo * (baseProt || 0)) / referencia);
        const cb = Math.round((pesoParaCalculo * (baseCarb || 0)) / referencia);
        const g = Math.round((pesoParaCalculo * (baseGord || 0)) / referencia);

        setMacrosCalculados({ calorias: c, proteinas: p, carbos: cb, gorduras: g });
        
        // fecha a lista de resultados
        setResultadoBusca([]);
        
        console.log('Alimento selecionado:', alimento);
        console.log('Peso resetado para: 100g');
        console.log('Macros calculados:', { calorias: c, proteinas: p, carbos: cb, gorduras: g });
    }

    // calcula macros a partir de valores base (data-* ou props) e peso informado
    function calculaMacrosAPartirDoElemento(element: HTMLElement | null, pesoConsumido: number) {
        // se há um alimento selecionado recentemente, usa seus valores
        if (alimentoSelecionado) {
            const baseCal = alimentoSelecionado.calorias ?? 0;
            const baseProt = alimentoSelecionado.proteinas ?? 0;
            const baseCarb = alimentoSelecionado.carboidrato ?? alimentoSelecionado.carbos ?? 0;
            const baseGord = alimentoSelecionado.lipidios ?? alimentoSelecionado.gorduras ?? 0;

            const referencia = 100;
            const c = Math.round((pesoConsumido * (baseCal || 0)) / referencia);
            const p = Math.round((pesoConsumido * (baseProt || 0)) / referencia);
            const cb = Math.round((pesoConsumido * (baseCarb || 0)) / referencia);
            const g = Math.round((pesoConsumido * (baseGord || 0)) / referencia);

            return { calorias: c, proteinas: p, carbos: cb, gorduras: g };
        }

        // encontra dataset do elemento .alimento-selecao
        const selecao = element?.querySelector('.alimento-selecao') as HTMLElement | null;
        const ds = selecao?.dataset;

        const baseCal = ds && ds.calorias ? Number(ds.calorias) : Number(calorias ?? 0);
        const baseProt = ds && ds.proteinas ? Number(ds.proteinas) : Number(proteinas ?? 0);
        // considerar variações de nome (carboidrato / carbos)
        const baseCarb = ds && (ds.carbo || ds.carboidrato) ? Number(ds.carbo ?? ds.carboidrato) : Number(carbos ?? 0);
        // considerar variações de nome (lipidios -> gorduras)
        const baseGord = ds && (ds.gorduras || ds.lipidios) ? Number(ds.gorduras ?? ds.lipidios) : Number(gorduras ?? 0);

        const referencia = 100;
        const c = Math.round((pesoConsumido * (baseCal || 0)) / referencia);
        const p = Math.round((pesoConsumido * (baseProt || 0)) / referencia);
        const cb = Math.round((pesoConsumido * (baseCarb || 0)) / referencia);
        const g = Math.round((pesoConsumido * (baseGord || 0)) / referencia);

        return { calorias: c, proteinas: p, carbos: cb, gorduras: g };
    }

    // handler do input de peso: calcula e preenche UI
    function handlePesoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;
        const pesoNum = raw === "" ? 0 : Math.trunc(Number(raw) || 0);
        setPesoLocal(raw === "" ? "" : pesoNum);

        // encontra elemento pai (alimento-item) para localizar .alimento-selecao
        const inputEl = e.target as HTMLElement;
        const alimentoItem = inputEl.closest('.alimento-item') as HTMLElement | null;

        const calculados = calculaMacrosAPartirDoElemento(alimentoItem, pesoNum);
        setMacrosCalculados(calculados);

        // notifica o parent apenas sobre o peso (mantendo compatibilidade)
        // Se o usuário limpou o input (raw === ""), não sobrescreve o parent com 0 —
        // permitimos exibição vazia enquanto tratamos internamente como 0.
        if (raw !== "") {
            onUpdate && onUpdate(id, { peso: pesoNum });
        }
    }

    // inicializa pesoLocal e macros ao montar/receber props
    useEffect(() => {
        // Não mostrar 0 no input — se o peso for 0 ou ausente, exibe vazio.
        setPesoLocal(peso && Number(peso) !== 0 ? peso : "");
        // usa o elemento DOM atual para obter data-* (se disponível)
        const root = document.querySelector(`[data-value=\"${id}\"]`) as HTMLElement | null;
        const calculados = calculaMacrosAPartirDoElemento(root, Number(peso ?? 0));
        setMacrosCalculados(calculados);
    }, [peso, calorias, proteinas, carbos, gorduras]);

    return (
        <div className={`alimento-item ${editando ? 'editando' : ''}`} data-value={id}>
            <a className="botao-editar-alimento" role="button" tabIndex={0} onClick={toggleEdit} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleEdit(); }}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </a>
            <span className="alimento-label">
                <h1>
                    {nome ? nome : "Novo alimento"}</h1>
                {/* Mostrar peso atual: prioriza pesoLocal (input), senão usa peso prop se >0 */}
                {(pesoLocal !== "" && pesoLocal !== null) ? `${pesoLocal} g • ` : (peso && Number(peso) > 0 ? `${peso} g • ` : "")}
                {/* Mostrar macros calculados (inteiros) */}
                {macrosCalculados.calorias ? `${macrosCalculados.calorias} kcal • ` : ""}
                {macrosCalculados.proteinas ? `${macrosCalculados.proteinas} g proteínas • ` : ""}
                {macrosCalculados.carbos ? `${macrosCalculados.carbos} g carbos • ` : ""}
                {macrosCalculados.gorduras ? `${macrosCalculados.gorduras} g gorduras` : ""}
            </span>
            <div className="botao-apagar-alimento" role="button" tabIndex={0} onClick={() => onDelete && onDelete(id, refeicaoId)}>
                <i className="fa fa-trash" aria-hidden="true"></i>
            </div>
            <div className={`alimento-item-janelaEdicao ${editando ? 'janelaEdicao-aberta' : ''}`}>
                <div className="alimento-consumo">
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
                            value={nome ?? ''} 
                            className="selecao-valor-texto" 
                            placeholder="Selecione alimento" 
                            onChange={(e) => handleAlimentoInputChange(e.target.value)} />
                        </span>
                        {resultadoBusca.length > 0 && <ListaAlimentos alimentos={resultadoBusca} onSelect={handleSelectAlimento} />}
                    </div>
                    <div className="alimento-pesoConsumido">
                        <div className="peso-label">
                            Peso:
                        </div>
                        <div className="peso-valor">
                            <input type="number" id="peso-valor-texto" className="peso-valor-texto" placeholder="Peso consumido" value={pesoLocal ?? ''} onChange={handlePesoChange} />
                        </div>
                    </div>
                </div>
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