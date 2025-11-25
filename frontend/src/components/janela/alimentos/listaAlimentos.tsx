interface listaAlimentosProps {
    alimentos: any[];
    onSelect?: (alimento: any) => void;
}

function ListaAlimentos({alimentos, onSelect}: listaAlimentosProps) {
    const LIMITE_ITENS = 15;
    const alimentosLimitados = (alimentos || []).slice(0, LIMITE_ITENS);

    return (
        <ul className="alimento-selecao-lista">
            {alimentosLimitados.map((alimento, index) => (
                <li 
                key={index} 
                className="alimento-selecao-lista-item" 
                onClick={() => onSelect && onSelect(alimento)}>
                    {alimento.nome || alimento}
                </li>
            ))}
        </ul>
    )
}

export default ListaAlimentos;