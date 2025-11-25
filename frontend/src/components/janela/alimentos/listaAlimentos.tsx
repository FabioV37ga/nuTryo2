/**
 * Componente ListaAlimentos
 * 
 * Exibe lista de resultados da busca de alimentos (autocomplete).
 * 
 * Funcionalidades:
 * - Renderiza até 15 alimentos encontrados
 * - Permite seleção ao clicar
 * - Notifica componente pai quando alimento é selecionado
 * 
 * @component
 * @param {object} props
 * @param {any[]} props.alimentos - Array de alimentos da busca
 * @param {function} [props.onSelect] - Callback executado quando alimento é selecionado
 */

interface listaAlimentosProps {
    alimentos: any[];
    onSelect?: (alimento: any) => void;
}

function ListaAlimentos({alimentos, onSelect}: listaAlimentosProps) {
    // Limita exibição a 15 resultados para não sobrecarregar UI
    const LIMITE_ITENS = 15;
    const alimentosLimitados = (alimentos || []).slice(0, LIMITE_ITENS);

    return (
        <ul className="alimento-selecao-lista">
            {/* Renderiza cada alimento encontrado como item clicável */}
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