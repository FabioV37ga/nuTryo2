/**
 * Componente Refeicoes (Item de Lista)
 * 
 * Representa um item de refeição na lista de refeições do dia.
 * 
 * Funcionalidades:
 * - Exibe tipo da refeição (Café da Manhã, Almoço, etc.)
 * - Mostra prévia dos alimentos (nomes separados por •)
 * - Botão de editar (abre aba de edição)
 * - Botão de deletar refeição
 * 
 * @component
 * @param {object} props
 * @param {number} props.id - ID da refeição
 * @param {string} props.tipo - Tipo da refeição ("Café da Manhã", "Almoço", etc.)
 * @param {string} props.titulo - Prévia dos alimentos (nomes separados)
 * @param {function} props.onDelete - Callback executado ao deletar refeição
 * @param {function} props.adicionarAba - Callback para abrir aba de edição
 */

interface RefeicaoProps {
    id: number;
    tipo: string;
    titulo: string;
    onDelete: (id: number) => void;
    adicionarAba: (id: number) => void;
}

function Refeicoes({ id, tipo, titulo, onDelete, adicionarAba }: RefeicaoProps) {
    return (
        <div className="refeicao" data-value={id}>
            {/* Botão de editar refeição (abre aba de edição) */}
            <a className="botao-editar-refeicao" onClick={() => adicionarAba(id)}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </a>
            
            {/* Label com tipo e prévia dos alimentos */}
            <span className="refeicao-list-label">
                <h1>{tipo}</h1>
                <span>{titulo}</span>
            </span>
            
            {/* Botão de deletar refeição */}
            <div
                className="botao-apagar-refeicao"
                role="button"
                tabIndex={0}
                onClick={() => onDelete && onDelete(id)}
            >
                <i className="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>
    )

}

export default Refeicoes;